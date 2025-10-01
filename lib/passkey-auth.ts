import { db } from "@/lib/db"
import { passkeyCredentials,users } from "@/lib/db/schema"
import crypto from "crypto"
import { eq } from "drizzle-orm"

// WebAuthn configuration
export const WEBAUTHN_CONFIG={
	rpName: "CodeniWork",
	rpID: process.env.NEXTAUTH_URL? new URL( process.env.NEXTAUTH_URL ).hostname:"localhost",
	origin: process.env.NEXTAUTH_URL||"http://localhost:3000",
	timeout: 60000,
}

// Types for WebAuthn
export interface PublicKeyCredentialCreationOptionsJSON {
	rp: {
		name: string
		id: string
	}
	user: {
		id: string
		name: string
		displayName: string
	}
	challenge: string
	pubKeyCredParams: Array<{
		type: "public-key"
		alg: number
	}>
	timeout: number
	attestation: "none"|"indirect"|"direct"
	authenticatorSelection: {
		authenticatorAttachment?: "platform"|"cross-platform"
		userVerification: "required"|"preferred"|"discouraged"
		requireResidentKey: boolean
	}
	excludeCredentials?: Array<{
		type: "public-key"
		id: string
		transports?: Array<"usb"|"nfc"|"ble"|"internal">
	}>
}

export interface PublicKeyCredentialRequestOptionsJSON {
	challenge: string
	timeout: number
	rpId: string
	allowCredentials?: Array<{
		type: "public-key"
		id: string
		transports?: Array<"usb"|"nfc"|"ble"|"internal">
	}>
	userVerification: "required"|"preferred"|"discouraged"
}

export interface AuthenticatorAttestationResponseJSON {
	clientDataJSON: string
	attestationObject: string
}

export interface AuthenticatorAssertionResponseJSON {
	clientDataJSON: string
	authenticatorData: string
	signature: string
	userHandle?: string
}

export interface PublicKeyCredentialJSON {
	id: string
	rawId: string
	response: AuthenticatorAttestationResponseJSON|AuthenticatorAssertionResponseJSON
	type: "public-key"
	clientExtensionResults: Record<string,any>
	authenticatorAttachment?: "platform"|"cross-platform"
}

// Utility functions
export function generateChallenge (): string {
	return crypto.randomBytes( 32 ).toString( 'base64url' )
}

export function generateUserId (): string {
	return crypto.randomBytes( 32 ).toString( 'base64url' )
}

// Base64URL encoding/decoding
export function base64URLEncode ( buffer: ArrayBuffer ): string {
	return Buffer.from( buffer ).toString( 'base64url' )
}

export function base64URLDecode ( str: string ): ArrayBuffer {
	return Buffer.from( str,'base64url' ).buffer
}

// Generate registration options for a new passkey
export async function generateRegistrationOptions (
	userId: string,
	userName: string,
	userDisplayName: string
): Promise<PublicKeyCredentialCreationOptionsJSON> {
	// Get existing credentials to exclude
	const existingCredentials=await db
		.select()
		.from( passkeyCredentials )
		.where( eq( passkeyCredentials.userId,userId ) )

	const excludeCredentials=existingCredentials.map( cred => ( {
		type: "public-key" as const,
		id: cred.credentialId,
		transports: cred.transports? JSON.parse( cred.transports ):undefined,
	} ) )

	return {
		rp: {
			name: WEBAUTHN_CONFIG.rpName,
			id: WEBAUTHN_CONFIG.rpID,
		},
		user: {
			id: generateUserId(),
			name: userName,
			displayName: userDisplayName,
		},
		challenge: generateChallenge(),
		pubKeyCredParams: [
			{ type: "public-key",alg: -7 }, // ES256
			{ type: "public-key",alg: -257 }, // RS256
		],
		timeout: WEBAUTHN_CONFIG.timeout,
		attestation: "none",
		authenticatorSelection: {
			userVerification: "preferred",
			requireResidentKey: false,
		},
		excludeCredentials,
	}
}

// Generate authentication options for existing passkey
export async function generateAuthenticationOptions (
	userId?: string
): Promise<PublicKeyCredentialRequestOptionsJSON> {
	let allowCredentials: Array<{
		type: "public-key"
		id: string
		transports?: Array<"usb"|"nfc"|"ble"|"internal">
	}>|undefined

	if ( userId ) {
		const userCredentials=await db
			.select()
			.from( passkeyCredentials )
			.where( eq( passkeyCredentials.userId,userId ) )

		allowCredentials=userCredentials.map( cred => ( {
			type: "public-key" as const,
			id: cred.credentialId,
			transports: cred.transports? JSON.parse( cred.transports ):undefined,
		} ) )
	}

	return {
		challenge: generateChallenge(),
		timeout: WEBAUTHN_CONFIG.timeout,
		rpId: WEBAUTHN_CONFIG.rpID,
		allowCredentials,
		userVerification: "preferred",
	}
}

// Verify registration response
export async function verifyRegistrationResponse (
	credential: PublicKeyCredentialJSON,
	expectedChallenge: string,
	userId: string
): Promise<{ verified: boolean; credentialId?: string }> {
	try {
		// This is a simplified verification - in production, you'd use a proper WebAuthn library
		// like @simplewebauthn/server for complete verification

		const { id,rawId,response }=credential
		const attestationResponse=response as AuthenticatorAttestationResponseJSON

		// Decode client data
		const clientDataJSON=JSON.parse(
			Buffer.from( attestationResponse.clientDataJSON,'base64url' ).toString()
		)

		// Verify challenge
		if ( clientDataJSON.challenge!==expectedChallenge ) {
			return { verified: false }
		}

		// Verify origin
		if ( clientDataJSON.origin!==WEBAUTHN_CONFIG.origin ) {
			return { verified: false }
		}

		// Verify type
		if ( clientDataJSON.type!=='webauthn.create' ) {
			return { verified: false }
		}

		// In a real implementation, you would:
		// 1. Decode and verify the attestation object
		// 2. Extract the public key
		// 3. Verify the attestation signature
		// 4. Check the authenticator data

		// For now, we'll store the credential with a placeholder public key
		const credentialId=id
		const publicKey=rawId // This should be the actual public key from attestation object

		// Store the credential
		await db.insert( passkeyCredentials ).values( {
			userId,
			credentialId,
			publicKey,
			counter: '0',
			deviceType: credential.authenticatorAttachment||'unknown',
			backedUp: false,
			transports: JSON.stringify( [] ),
			name: `Passkey ${new Date().toLocaleDateString()}`,
		} )

		return { verified: true,credentialId }
	} catch ( error ) {
		console.error( 'Registration verification error:',error )
		return { verified: false }
	}
}

// Verify authentication response
export async function verifyAuthenticationResponse (
	credential: PublicKeyCredentialJSON,
	expectedChallenge: string
): Promise<{ verified: boolean; userId?: string }> {
	try {
		const { id,response }=credential
		const assertionResponse=response as AuthenticatorAssertionResponseJSON

		// Find the credential in database
		const storedCredential=await db
			.select()
			.from( passkeyCredentials )
			.where( eq( passkeyCredentials.credentialId,id ) )
			.limit( 1 )

		if ( storedCredential.length===0 ) {
			return { verified: false }
		}

		const cred=storedCredential[ 0 ]

		// Decode client data
		const clientDataJSON=JSON.parse(
			Buffer.from( assertionResponse.clientDataJSON,'base64url' ).toString()
		)

		// Verify challenge
		if ( clientDataJSON.challenge!==expectedChallenge ) {
			return { verified: false }
		}

		// Verify origin
		if ( clientDataJSON.origin!==WEBAUTHN_CONFIG.origin ) {
			return { verified: false }
		}

		// Verify type
		if ( clientDataJSON.type!=='webauthn.get' ) {
			return { verified: false }
		}

		// In a real implementation, you would:
		// 1. Verify the authenticator data
		// 2. Verify the signature using the stored public key
		// 3. Check and update the counter

		// Update last used timestamp
		await db
			.update( passkeyCredentials )
			.set( { lastUsed: new Date() } )
			.where( eq( passkeyCredentials.id,cred.id ) )

		return { verified: true,userId: cred.userId }
	} catch ( error ) {
		console.error( 'Authentication verification error:',error )
		return { verified: false }
	}
}

// Master password encryption utilities
export function generateSalt (): string {
	return crypto.randomBytes( 32 ).toString( 'hex' )
}

export async function hashMasterPassword ( password: string,salt: string ): Promise<string> {
	return new Promise( ( resolve,reject ) => {
		crypto.pbkdf2( password,salt,100000,64,'sha512',( err,derivedKey ) => {
			if ( err ) reject( err )
			else resolve( derivedKey.toString( 'hex' ) )
		} )
	} )
}

export async function deriveEncryptionKey ( masterPassword: string,salt: string ): Promise<Buffer> {
	return new Promise( ( resolve,reject ) => {
		crypto.pbkdf2( masterPassword,salt,100000,32,'sha256',( err,derivedKey ) => {
			if ( err ) reject( err )
			else resolve( derivedKey )
		} )
	} )
}

export function encryptData ( data: string,key: Buffer ): { encrypted: string; iv: string } {
	const iv=crypto.randomBytes( 16 )
	const cipher=crypto.createCipheriv( 'aes-256-cbc',key,iv )
	let encrypted=cipher.update( data,'utf8','hex' )
	encrypted+=cipher.final( 'hex' )
	return {
		encrypted,
		iv: iv.toString( 'hex' )
	}
}

export function decryptData ( encryptedData: string,key: Buffer,iv: string ): string {
	const decipher=crypto.createDecipheriv( 'aes-256-cbc',key,Buffer.from( iv,'hex' ) )
	let decrypted=decipher.update( encryptedData,'hex','utf8' )
	decrypted+=decipher.final( 'utf8' )
	return decrypted
}

// Store master password for user
export async function storeMasterPassword ( userId: string,masterPassword: string ): Promise<void> {
	const salt=generateSalt()
	const encryptionSalt=generateSalt()
	const hashedPassword=await hashMasterPassword( masterPassword,salt )

	await db
		.update( users )
		.set( {
			masterPasswordHash: hashedPassword,
			masterPasswordSalt: salt,
			encryptionKeyDerivationSalt: encryptionSalt,
		} )
		.where( eq( users.id,userId ) )
}

// Verify master password
export async function verifyMasterPassword ( userId: string,masterPassword: string ): Promise<boolean> {
	const user=await db
		.select()
		.from( users )
		.where( eq( users.id,userId ) )
		.limit( 1 )

	if ( user.length===0||!user[ 0 ].masterPasswordHash||!user[ 0 ].masterPasswordSalt ) {
		return false
	}

	const hashedPassword=await hashMasterPassword( masterPassword,user[ 0 ].masterPasswordSalt )
	return hashedPassword===user[ 0 ].masterPasswordHash
}

// Get encryption key for user
export async function getUserEncryptionKey ( userId: string,masterPassword: string ): Promise<Buffer|null> {
	const user=await db
		.select()
		.from( users )
		.where( eq( users.id,userId ) )
		.limit( 1 )

	if ( user.length===0||!user[ 0 ].encryptionKeyDerivationSalt ) {
		return null
	}

	return await deriveEncryptionKey( masterPassword,user[ 0 ].encryptionKeyDerivationSalt )
}


