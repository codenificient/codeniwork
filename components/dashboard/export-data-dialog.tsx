'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select'
import { Download,FileSpreadsheet,FileText } from 'lucide-react'
import { useState } from 'react'

interface ExportDataDialogProps {
	trigger?: React.ReactNode
}

export function ExportDataDialog ( { trigger }: ExportDataDialogProps ) {
	const [ isOpen,setIsOpen ]=useState( false )
	const [ exportOptions,setExportOptions ]=useState( {
		format: 'csv',
		dateRange: 'all',
		includeApplications: true,
		includeCompanies: true,
		includeActivity: true,
		includeStats: true
	} )

	const handleExport=async () => {
		try {
			// Show loading state
			console.log( 'Exporting data with options:',exportOptions )

			// TODO: Implement actual export functionality
			// This would typically call your API to generate and download the file

			// Simulate export process
			await new Promise( resolve => setTimeout( resolve,2000 ) )

			// For now, create a sample CSV content
			const csvContent=`Position,Company,Status,Applied Date,Notes
Software Engineer,Google,Applied,2024-01-15,Great opportunity
Product Manager,Microsoft,Interview,2024-01-10,Second round scheduled
Data Scientist,Amazon,Screening,2024-01-08,Waiting for response`

			// Create and download file
			const blob=new Blob( [ csvContent ],{ type: 'text/csv' } )
			const url=window.URL.createObjectURL( blob )
			const a=document.createElement( 'a' )
			a.href=url
			a.download=`codeniwork-export-${new Date().toISOString().split( 'T' )[ 0 ]}.csv`
			document.body.appendChild( a )
			a.click()
			window.URL.revokeObjectURL( url )
			document.body.removeChild( a )

			// Close dialog and show success message
			setIsOpen( false )
			alert( 'Data exported successfully!' )
		} catch ( error ) {
			console.error( 'Error exporting data:',error )
			alert( 'Failed to export data. Please try again.' )
		}
	}

	const handleOptionChange=( field: string,value: string|boolean ) => {
		setExportOptions( prev => ( { ...prev,[ field ]: value } ) )
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{trigger||(
					<Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
						<Download className="w-4 h-4 mr-2" />
						Export Data
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-white/20">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
						<Download className="w-5 h-5 mr-2 text-orange-500" />
						Export Dashboard Data
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Export Format */}
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-2 block">
							Export Format
						</Label>
						<Select
							value={exportOptions.format}
							onValueChange={( value ) => handleOptionChange( 'format',value )}
						>
							<SelectTrigger className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="csv">
									<div className="flex items-center">
										<FileSpreadsheet className="w-4 h-4 mr-2" />
										CSV
									</div>
								</SelectItem>
								<SelectItem value="json">
									<div className="flex items-center">
										<FileText className="w-4 h-4 mr-2" />
										JSON
									</div>
								</SelectItem>
								<SelectItem value="pdf">
									<div className="flex items-center">
										<FileText className="w-4 h-4 mr-2" />
										PDF Report
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Date Range */}
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-2 block">
							Date Range
						</Label>
						<Select
							value={exportOptions.dateRange}
							onValueChange={( value ) => handleOptionChange( 'dateRange',value )}
						>
							<SelectTrigger className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Time</SelectItem>
								<SelectItem value="last30">Last 30 Days</SelectItem>
								<SelectItem value="last90">Last 90 Days</SelectItem>
								<SelectItem value="lastYear">Last Year</SelectItem>
								<SelectItem value="custom">Custom Range</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Data Selection */}
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-3 block">
							Include Data
						</Label>
						<div className="space-y-3">
							<label className="flex items-center space-x-3 cursor-pointer">
								<Checkbox
									checked={exportOptions.includeApplications}
									onChange={( e ) => handleOptionChange( 'includeApplications',e.target.checked )}
									className="text-orange-500 focus:ring-orange-500"
								/>
								<span className="text-sm text-gray-700">Job Applications</span>
							</label>

							<label className="flex items-center space-x-3 cursor-pointer">
								<Checkbox
									checked={exportOptions.includeCompanies}
									onChange={( e ) => handleOptionChange( 'includeCompanies',e.target.checked )}
									className="text-orange-500 focus:ring-orange-500"
								/>
								<span className="text-sm text-gray-700">Companies</span>
							</label>

							<label className="flex items-center space-x-3 cursor-pointer">
								<Checkbox
									checked={exportOptions.includeActivity}
									onChange={( e ) => handleOptionChange( 'includeActivity',e.target.checked )}
									className="text-orange-500 focus:ring-orange-500"
								/>
								<span className="text-sm text-gray-700">Recent Activity</span>
							</label>

							<label className="flex items-center space-x-3 cursor-pointer">
								<Checkbox
									checked={exportOptions.includeStats}
									onChange={( e ) => handleOptionChange( 'includeStats',e.target.checked )}
									className="text-orange-500 focus:ring-orange-500"
								/>
								<span className="text-sm text-gray-700">Dashboard Statistics</span>
							</label>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen( false )}
							className="border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</Button>
						<Button
							onClick={handleExport}
							className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
						>
							<Download className="w-4 h-4 mr-2" />
							Export Data
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
