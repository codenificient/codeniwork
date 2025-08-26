import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Briefcase,Building2,Globe,MapPin,Users } from 'lucide-react'

// Mock data for companies
const companies=[
	{
		id: 1,
		name: 'TechCorp Solutions',
		industry: 'Software Development',
		location: 'San Francisco, CA',
		website: 'https://techcorp.com',
		employees: '500-1000',
		openPositions: 12,
		status: 'Active'
	},
	{
		id: 2,
		name: 'InnovateLab',
		industry: 'AI & Machine Learning',
		location: 'New York, NY',
		website: 'https://innovatelab.ai',
		employees: '100-250',
		openPositions: 8,
		status: 'Active'
	},
	{
		id: 3,
		name: 'DataFlow Systems',
		industry: 'Data Analytics',
		location: 'Austin, TX',
		website: 'https://dataflow.io',
		employees: '250-500',
		openPositions: 15,
		status: 'Active'
	},
	{
		id: 4,
		name: 'CloudScale Inc',
		industry: 'Cloud Infrastructure',
		location: 'Seattle, WA',
		website: 'https://cloudscale.com',
		employees: '1000+',
		openPositions: 25,
		status: 'Active'
	}
]

export default function CompaniesPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
					<p className="text-blue-200">Explore companies and their opportunities</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{companies.map( ( company ) => (
						<Card key={company.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center space-x-3">
										<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
											<Building2 className="w-6 h-6 text-white" />
										</div>
										<div>
											<CardTitle className="text-white text-lg">{company.name}</CardTitle>
											<Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-400/30">
												{company.industry}
											</Badge>
										</div>
									</div>
									<Badge className={company.status==='Active'? 'bg-green-600/20 text-green-200 border-green-400/30':'bg-gray-600/20 text-gray-200 border-gray-400/30'}>
										{company.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center space-x-2 text-blue-200">
									<MapPin className="w-4 h-4" />
									<span className="text-sm">{company.location}</span>
								</div>
								<div className="flex items-center space-x-2 text-blue-200">
									<Globe className="w-4 h-4" />
									<a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
										{company.website.replace( 'https://','' )}
									</a>
								</div>
								<div className="flex items-center space-x-2 text-blue-200">
									<Users className="w-4 h-4" />
									<span className="text-sm">{company.employees} employees</span>
								</div>
								<div className="flex items-center space-x-2 text-blue-200">
									<Briefcase className="w-4 h-4" />
									<span className="text-sm">{company.openPositions} open positions</span>
								</div>
							</CardContent>
						</Card>
					) )}
				</div>
			</div>
		</div>
	)
}
