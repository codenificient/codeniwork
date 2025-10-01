import { useCallback,useState } from 'react'

// Types for WebAuthn client-side
interface PublicKeyCredentialCreationOptionsJSON {
	rp: { name: string; id: string }
	user: { id: string; name: string; displayName: string }
	challenge: string
	pubKeyCredParams: Array<{ type: 'public-key'; alg: number }>
	timeout: number
	attestation: 'none'|'indirect'|'direct'
	authenticatorSelection: {
		authenticatorAttachment?: 'platform'|'cross-platform'
		userVerification: 'required'|'preferred'|'discouraged'
		requireResidentKey: boolean
	}
	excludeCredentials?: Array<{
		type: 'public-key'
		id: string
		transports?: Array<'usb'|'nfc'|'ble'|'internal'>
	}>
}

interface PublicKeyCredentialRequestOptionsJSON {
	challenge: string
	timeout: number
	rpId: string
	allowCredentials?: Array<{
		type: 'public-key'
		id: string
		transports?: Array<'usb'|'nfc'|'ble'|'internal'>
	}>
	userVerification: 'required'|'preferred'|'discouraged'
}

// Utility functions for base64url conversion
function base64URLStringToBuffer ( base64URLString: string ): ArrayBuffer {
	const base64=base64URLString.replace( /-/g,'+' ).replace( /_/g,'/' )
	const padded=base64.padEnd( base64.length+( 4-( base64.length%4 ) )%4,'=' )
	const binary=atob( padded )
	const buffer=new ArrayBuffer( binary.length )
	const bytes=new Uint8Array( buffer )
	for ( let i=0; i<binary.length; i++ ) {
		bytes[ i ]=binary.charCodeAt( i )
	}
	return buffer
}

function bufferToBase64URLString ( buffer: ArrayBuffer ): string {
	const bytes=new Uint8Array( buffer )
	let str=''
	for ( const charCode of bytes ) {
		str+=String.fromCharCode( charCode )
	}
	const base64String=btoa( str )
	return base64String.replace( /\+/g,'-' ).replace( /\//g,'_' ).replace( /=/g,'' )
}

// Convert JSON options to WebAuthn format
function convertRegistrationOptions ( options: PublicKeyCredentialCreationOptionsJSON ): PublicKeyCredentialCreationOptions {
	return {
		...options,
		challenge: base64URLStringToBuffer( options.challenge ),
		user: {
			...options.user,
			id: base64URLStringToBuffer( options.user.id ),
		},
		excludeCredentials: options.excludeCredentials?.map( cred => ( {
			...cred,
			id: base64URLStringToBuffer( cred.id ),
		} ) ),
	}
}

function convertAuthenticationOptions ( options: PublicKeyCredentialRequestOptionsJSON ): PublicKeyCredentialRequestOptions {
	return {
		...options,
		challenge: base64URLStringToBuffer( options.challenge ),
		allowCredentials: options.allowCredentials?.map( cred => ( {
			...cred,
			id: base64URLStringToBuffer( cred.id ),
		} ) ),
	}
}

// Convert WebAuthn credential to JSON
function credentialToJSON ( credential: PublicKeyCredential ): any {
	const response=credential.response as AuthenticatorAttestationResponse|AuthenticatorAssertionResponse

	let responseJSON: any={
		clientDataJSON: bufferToBase64URLString( response.clientDataJSON ),
	}

	if ( 'attestationObject' in response ) {
		// Registration response
		responseJSON.attestationObject=bufferToBase64URLString( response.attestationObject )
	} else {
		// Authentication response
		responseJSON.authenticatorData=bufferToBase64URLString( response.authenticatorData )
		responseJSON.signature=bufferToBase64URLString( response.signature )
		if ( response.userHandle ) {
			responseJSON.userHandle=bufferToBase64URLString( response.userHandle )
		}
	}

	return {
		id: credential.id,
		rawId: bufferToBase64URLString( credential.rawId ),
		response: responseJSON,
		type: credential.type,
		clientExtensionResults: credential.getClientExtensionResults(),
		authenticatorAttachment: ( credential as any ).authenticatorAttachment,
	}
}

export function usePasskeyAuth () {
	const [ isLoading,setIsLoading ]=useState( false )
	const [ error,setError ]=useState<string|null>( null )

	// Check if WebAuthn is supported
	const isSupported=useCallback( () => {
		return typeof window!=='undefined'&&
			'navigator' in window&&
			'credentials' in navigator&&
			'create' in navigator.credentials&&
			'get' in navigator.credentials
	},[] )

	// Register a new passkey
	const registerPasskey=useCallback( async ( userName?: string,userDisplayName?: string ) => {
		if ( !isSupported() ) {
			throw new Error( 'WebAuthn is not supported in this browser' )
		}

		setIsLoading( true )
		setError( null )

		try {
			// Get registration options from server
			const optionsResponse=await fetch( '/api/auth/passkey/register/options',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { userName,userDisplayName } ),
			} )

			if ( !optionsResponse.ok ) {
				throw new Error( 'Failed to get registration options' )
			}

			const options: PublicKeyCredentialCreationOptionsJSON=await optionsResponse.json()

			// Convert to WebAuthn format
			const webAuthnOptions=convertRegistrationOptions( options )

			// Create credential
			const credential=await navigator.credentials.create( {
				publicKey: webAuthnOptions,
			} ) as PublicKeyCredential

			if ( !credential ) {
				throw new Error( 'Failed to create credential' )
			}

			// Convert to JSON and send to server
			const credentialJSON=credentialToJSON( credential )

			const verifyResponse=await fetch( '/api/auth/passkey/register/verify',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( credentialJSON ),
			} )

			if ( !verifyResponse.ok ) {
				throw new Error( 'Failed to verify registration' )
			}

			const result=await verifyResponse.json()
			return result
		} catch ( err ) {
			const errorMessage=err instanceof Error? err.message:'Registration failed'
			setError( errorMessage )
			throw new Error( errorMessage )
		} finally {
			setIsLoading( false )
		}
	},[ isSupported ] )

	// Authenticate with passkey
	const authenticateWithPasskey=useCallback( async ( userId?: string ) => {
		if ( !isSupported() ) {
			throw new Error( 'WebAuthn is not supported in this browser' )
		}

		setIsLoading( true )
		setError( null )

		try {
			// Get authentication options from server
			const optionsResponse=await fetch( '/api/auth/passkey/authenticate/options',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { userId } ),
			} )

			if ( !optionsResponse.ok ) {
				throw new Error( 'Failed to get authentication options' )
			}

			const options: PublicKeyCredentialRequestOptionsJSON=await optionsResponse.json()

			// Convert to WebAuthn format
			const webAuthnOptions=convertAuthenticationOptions( options )

			// Get credential
			const credential=await navigator.credentials.get( {
				publicKey: webAuthnOptions,
			} ) as PublicKeyCredential

			if ( !credential ) {
				throw new Error( 'Failed to get credential' )
			}

			// Convert to JSON and send to server
			const credentialJSON=credentialToJSON( credential )

			const verifyResponse=await fetch( '/api/auth/passkey/authenticate/verify',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( credentialJSON ),
			} )

			if ( !verifyResponse.ok ) {
				throw new Error( 'Failed to verify authentication' )
			}

			const result=await verifyResponse.json()
			return result
		} catch ( err ) {
			const errorMessage=err instanceof Error? err.message:'Authentication failed'
			setError( errorMessage )
			throw new Error( errorMessage )
		} finally {
			setIsLoading( false )
		}
	},[ isSupported ] )

	// Setup master password
	const setupMasterPassword=useCallback( async ( masterPassword: string ) => {
		setIsLoading( true )
		setError( null )

		try {
			const response=await fetch( '/api/auth/master-password/setup',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { masterPassword } ),
			} )

			if ( !response.ok ) {
				throw new Error( 'Failed to setup master password' )
			}

			return await response.json()
		} catch ( err ) {
			const errorMessage=err instanceof Error? err.message:'Master password setup failed'
			setError( errorMessage )
			throw new Error( errorMessage )
		} finally {
			setIsLoading( false )
		}
	},[] )

	// Verify master password
	const verifyMasterPassword=useCallback( async ( masterPassword: string ) => {
		setIsLoading( true )
		setError( null )

		try {
			const response=await fetch( '/api/auth/master-password/verify',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { masterPassword } ),
			} )

			if ( !response.ok ) {
				throw new Error( 'Failed to verify master password' )
			}

			return await response.json()
		} catch ( err ) {
			const errorMessage=err instanceof Error? err.message:'Master password verification failed'
			setError( errorMessage )
			throw new Error( errorMessage )
		} finally {
			setIsLoading( false )
		}
	},[] )

	return {
		isSupported: isSupported(),
		isLoading,
		error,
		registerPasskey,
		authenticateWithPasskey,
		setupMasterPassword,
		verifyMasterPassword,
	}
}


