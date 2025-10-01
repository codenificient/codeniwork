'use client'

import { Button } from '@/components/ui/button'
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { usePasskeyAuth } from '@/hooks/use-passkey-auth'
import { Fingerprint,Plus,Shield,Trash2 } from 'lucide-react'
import { useEffect,useState } from 'react'

interface PasskeyCredential {
	id: string
	name: string
	createdAt: string
	lastUsed?: string
	deviceType?: string
}

export function PasskeyManager () {
	const [ passkeys,setPasskeys ]=useState<PasskeyCredential[]>( [] )
	const [ isLoading,setIsLoading ]=useState( false )
	const [ error,setError ]=useState<string|null>( null )
	const { isSupported,registerPasskey }=usePasskeyAuth()

	const loadPasskeys=async () => {
		try {
			const response=await fetch( '/api/auth/passkey/list' )
			if ( response.ok ) {
				const data=await response.json()
				setPasskeys( data.passkeys||[] )
			}
		} catch ( error ) {
			console.error( 'Failed to load passkeys:',error )
		}
	}

	useEffect( () => {
		loadPasskeys()
	},[] )

	const handleAddPasskey=async () => {
		setIsLoading( true )
		setError( null )

		try {
			await registerPasskey()
			await loadPasskeys() // Reload the list
		} catch ( error ) {
			console.error( 'Failed to add passkey:',error )
			setError( 'Failed to add passkey. Please try again.' )
		} finally {
			setIsLoading( false )
		}
	}

	const handleDeletePasskey=async ( passkeyId: string ) => {
		if ( !confirm( 'Are you sure you want to delete this passkey?' ) ) {
			return
		}

		try {
			const response=await fetch( `/api/auth/passkey/${passkeyId}`,{
				method: 'DELETE',
			} )

			if ( response.ok ) {
				await loadPasskeys() // Reload the list
			} else {
				setError( 'Failed to delete passkey' )
			}
		} catch ( error ) {
			console.error( 'Failed to delete passkey:',error )
			setError( 'Failed to delete passkey. Please try again.' )
		}
	}

	if ( !isSupported ) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Fingerprint className="w-5 h-5" />
						Passkeys
					</CardTitle>
					<CardDescription>
						Secure, passwordless authentication using your device's biometrics or PIN
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<Shield className="h-5 w-5 text-yellow-400" />
							</div>
							<div className="ml-3">
								<p className="text-sm text-yellow-800">
									Passkeys are not supported in your current browser. Please use a modern browser that supports WebAuthn.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Fingerprint className="w-5 h-5" />
					Passkeys
				</CardTitle>
				<CardDescription>
					Manage your passkeys for secure, passwordless authentication
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{error&&(
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<p className="text-sm text-red-800">{error}</p>
					</div>
				)}

				{passkeys.length===0? (
					<div className="text-center py-8">
						<Fingerprint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No passkeys yet</h3>
						<p className="text-gray-600 mb-4">
							Add a passkey to enable secure, passwordless authentication
						</p>
						<Button
							onClick={handleAddPasskey}
							disabled={isLoading}
							className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
						>
							<Plus className="w-4 h-4 mr-2" />
							{isLoading? 'Adding Passkey...':'Add Your First Passkey'}
						</Button>
					</div>
				):(
					<>
						<div className="space-y-3">
							{passkeys.map( ( passkey ) => (
								<div
									key={passkey.id}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
											<Fingerprint className="w-5 h-5 text-purple-600" />
										</div>
										<div>
											<h4 className="font-medium text-gray-900">{passkey.name}</h4>
											<p className="text-sm text-gray-600">
												Created {new Date( passkey.createdAt ).toLocaleDateString()}
												{passkey.lastUsed&&(
													<span className="ml-2">
														• Last used {new Date( passkey.lastUsed ).toLocaleDateString()}
													</span>
												)}
											</p>
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDeletePasskey( passkey.id )}
										className="text-red-600 hover:text-red-700 hover:bg-red-50"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							) )}
						</div>

						<Button
							onClick={handleAddPasskey}
							disabled={isLoading}
							variant="outline"
							className="w-full"
						>
							<Plus className="w-4 h-4 mr-2" />
							{isLoading? 'Adding Passkey...':'Add Another Passkey'}
						</Button>
					</>
				)}

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<Shield className="h-5 w-5 text-blue-400" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-blue-800">
								<strong>Tip:</strong> Passkeys are stored securely on your device and can't be phished or stolen.
								You can add multiple passkeys for different devices.
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}


