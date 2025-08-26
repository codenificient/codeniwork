'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AddApplicationDialog } from './add-application-dialog'

export function AddApplicationButton () {
	const [ isDialogOpen,setIsDialogOpen ]=useState( false )

	return (
		<>
			<Button
				onClick={() => setIsDialogOpen( true )}
				className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
			>
				<Plus className="w-4 h-4 mr-2" />
				Add Application
			</Button>

			<AddApplicationDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
		</>
	)
}
