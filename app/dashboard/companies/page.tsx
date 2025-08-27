'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditCompanyDialog } from '@/components/dashboard/edit-company-dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Briefcase, Building2, Edit, Globe, MapPin, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Company {
	id: string
	name: string
	website: string | null
	logo: string | null
	description: string | null
	location: string | null
	industry: string | null
	size: string | null
	applicationsCount: number
}

export default function CompaniesPage() {
	const [companies, setCompanies] = useState<Company[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [editingCompany, setEditingCompany] = useState<Company | null>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	useEffect(() => {
		fetchCompanies()
	}, [])

	const fetchCompanies = async () => {
		try {
			const response = await fetch('/api/dashboard/companies')
			if (!response.ok) {
				throw new Error('Failed to fetch companies')
			}
			const data = await response.json()
			setCompanies(data)
		} catch (error) {
			console.error('Error fetching companies:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleEditCompany = (company: Company) => {
		setEditingCompany(company)
		setIsEditDialogOpen(true)
	}

	const handleCompanyUpdated = async () => {
		await fetchCompanies()
	}

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<DashboardHeader />
				<div className="p-6">
					<div className="flex items-center justify-center h-64">
						<LoadingSpinner />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
					<p className="text-blue-200">Explore companies and their opportunities</p>
				</div>

				{companies.length === 0 ? (
					<div className="text-center py-12">
						<Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-white mb-2">No companies yet</h3>
						<p className="text-gray-300">Companies will appear here when you add job applications.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{companies.map((company) => (
							<Card key={company.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-3">
											<div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
												{company.logo ? (
													<img
														src={company.logo}
														alt={`${company.name} logo`}
														className="w-full h-full object-cover"
														onError={(e) => {
															const target = e.target as HTMLImageElement
															target.style.display = 'none'
															target.nextElementSibling?.classList.remove('hidden')
														}}
													/>
												) : null}
												<Building2 className="w-6 h-6 text-white" />
											</div>
											<div>
												<CardTitle className="text-white text-lg">{company.name}</CardTitle>
												{company.industry && (
													<Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-400/30">
														{company.industry}
													</Badge>
												)}
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditCompany(company)}
											className="text-blue-200 hover:text-white hover:bg-white/20 p-2"
										>
											<Edit className="w-4 h-4" />
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									{company.location && (
										<div className="flex items-center space-x-2 text-blue-200">
											<MapPin className="w-4 h-4" />
											<span className="text-sm">{company.location}</span>
										</div>
									)}
									{company.website && (
										<div className="flex items-center space-x-2 text-blue-200">
											<Globe className="w-4 h-4" />
											<a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
												{company.website.replace('https://', '')}
											</a>
										</div>
									)}
									{company.size && (
										<div className="flex items-center space-x-2 text-blue-200">
											<Users className="w-4 h-4" />
											<span className="text-sm">{company.size}</span>
										</div>
									)}
									<div className="flex items-center space-x-2 text-blue-200">
										<Briefcase className="w-4 h-4" />
										<span className="text-sm">{company.applicationsCount} application{company.applicationsCount !== 1 ? 's' : ''}</span>
									</div>
									{company.description && (
										<p className="text-sm text-gray-300 bg-black/20 p-3 rounded-lg">
											{company.description}
										</p>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Edit Company Dialog */}
				<EditCompanyDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					company={editingCompany}
					onCompanyUpdated={handleCompanyUpdated}
				/>
			</div>
		</div>
	)
}
