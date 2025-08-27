'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Download, FileText, Database, Calendar, Users, Building } from 'lucide-react'
import { useState } from 'react'

interface ExportDataDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ExportDataDialog({ open, onOpenChange }: ExportDataDialogProps) {
	const { toast } = useToast()
	const [isExporting, setIsExporting] = useState(false)
	const [selectedData, setSelectedData] = useState({
		applications: true,
		companies: true,
		documents: true,
		activities: true,
		profile: true
	})
	const [exportFormat, setExportFormat] = useState('json')
	const [dateRange, setDateRange] = useState('all')

	const handleDataToggle = (key: keyof typeof selectedData) => {
		setSelectedData(prev => ({
			...prev,
			[key]: !prev[key]
		}))
	}

	const handleExport = async () => {
		setIsExporting(true)
		try {
			// Simulate export process
			await new Promise(resolve => setTimeout(resolve, 2000))
			
			// Here you would typically call your export API
			// const response = await fetch('/api/export', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     dataTypes: Object.keys(selectedData).filter(key => selectedData[key as keyof typeof selectedData]),
			//     format: exportFormat,
			//     dateRange
			//   })
			// })

			toast({
				title: 'Export Successful!',
				description: `Your data has been exported in ${exportFormat.toUpperCase()} format.`,
			})
			
			onOpenChange(false)
		} catch (error) {
			toast({
				title: 'Export Failed',
				description: 'Failed to export data. Please try again.',
				variant: 'destructive'
			})
		} finally {
			setIsExporting(false)
		}
	}

	const handleCancel = () => {
		onOpenChange(false)
	}

	const hasSelectedData = Object.values(selectedData).some(Boolean)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Export Your Data
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Data Selection */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">Select Data to Export</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
								<Checkbox
									id="applications"
									checked={selectedData.applications}
									onChange={() => handleDataToggle('applications')}
									className="border-gray-400 data-[state=checked]:bg-purple-600"
								/>
								<Label htmlFor="applications" className="text-white flex items-center space-x-2">
									<FileText className="w-4 h-4" />
									<span>Job Applications</span>
								</Label>
							</div>

							<div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
								<Checkbox
									id="companies"
									checked={selectedData.companies}
									onChange={() => handleDataToggle('companies')}
									className="border-gray-400 data-[state=checked]:bg-purple-600"
								/>
								<Label htmlFor="companies" className="text-white flex items-center space-x-2">
									<Building className="w-4 h-4" />
									<span>Companies</span>
								</Label>
							</div>

							<div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
								<Checkbox
									id="documents"
									checked={selectedData.documents}
									onChange={() => handleDataToggle('documents')}
									className="border-gray-400 data-[state=checked]:bg-purple-600"
								/>
								<Label htmlFor="documents" className="text-white flex items-center space-x-2">
									<FileText className="w-4 h-4" />
									<span>Documents</span>
								</Label>
							</div>

							<div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
								<Checkbox
									id="activities"
									checked={selectedData.activities}
									onChange={() => handleDataToggle('activities')}
									className="border-gray-400 data-[state=checked]:bg-purple-600"
								/>
								<Label htmlFor="activities" className="text-white flex items-center space-x-2">
									<Calendar className="w-4 h-4" />
									<span>Activity History</span>
								</Label>
							</div>

							<div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
								<Checkbox
									id="profile"
									checked={selectedData.profile}
									onChange={() => handleDataToggle('profile')}
									className="border-gray-400 data-[state=checked]:bg-purple-600"
								/>
								<Label htmlFor="profile" className="text-white flex items-center space-x-2">
									<Users className="w-4 h-4" />
									<span>Profile Data</span>
								</Label>
							</div>
						</div>
					</div>

					{/* Export Options */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="exportFormat" className="text-white">
								Export Format
							</Label>
							<Select value={exportFormat} onValueChange={setExportFormat}>
								<SelectTrigger className="bg-gray-800 border-gray-600 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-600 text-white">
									<SelectItem value="json">JSON</SelectItem>
									<SelectItem value="csv">CSV</SelectItem>
									<SelectItem value="pdf">PDF Report</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="dateRange" className="text-white">
								Date Range
							</Label>
							<Select value={dateRange} onValueChange={setDateRange}>
								<SelectTrigger className="bg-gray-800 border-gray-600 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-600 text-white">
									<SelectItem value="all">All Time</SelectItem>
									<SelectItem value="last30">Last 30 Days</SelectItem>
									<SelectItem value="last90">Last 90 Days</SelectItem>
									<SelectItem value="lastYear">Last Year</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Export Info */}
					<div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<Database className="w-5 h-5 text-blue-400 mt-0.5" />
							<div className="text-sm text-blue-200">
								<p className="font-medium mb-1">Export Information</p>
								<p>Your data will be securely exported and can be used for backup, analysis, or migration purposes.</p>
								<p className="mt-2 text-blue-300">
									Selected: {Object.values(selectedData).filter(Boolean).length} data types • 
									Format: {exportFormat.toUpperCase()} • 
									Range: {dateRange === 'all' ? 'All Time' : dateRange}
								</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="flex space-x-3">
					<Button
						variant="outline"
						onClick={handleCancel}
						className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
					>
						Cancel
					</Button>
					<Button
						onClick={handleExport}
						disabled={!hasSelectedData || isExporting}
						className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
					>
						<Download className="w-4 h-4 mr-2" />
						{isExporting ? 'Exporting...' : 'Export Data'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
