import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building2,Mail,MapPin,MessageCircle,Phone,Plus,Search,Star,Users } from 'lucide-react'

// Mock contacts data
const contacts=[
	{
		id: 1,
		name: 'Sarah Johnson',
		title: 'Senior Recruiter',
		company: 'TechCorp Solutions',
		email: 'sarah.johnson@techcorp.com',
		phone: '+1 (555) 123-4567',
		location: 'San Francisco, CA',
		relationship: 'Recruiter',
		lastContact: '2024-01-08',
		status: 'Active',
		notes: 'Met at TechCrunch conference. Very responsive and helpful.'
	},
	{
		id: 2,
		name: 'Michael Chen',
		title: 'Engineering Manager',
		company: 'InnovateLab',
		email: 'mchen@innovatelab.ai',
		phone: '+1 (555) 987-6543',
		location: 'New York, NY',
		relationship: 'Hiring Manager',
		lastContact: '2024-01-05',
		status: 'Active',
		notes: 'Direct hiring manager for the role I applied to.'
	},
	{
		id: 3,
		name: 'Emily Rodriguez',
		title: 'Talent Acquisition',
		company: 'DataFlow Systems',
		email: 'emily.rodriguez@dataflow.io',
		phone: '+1 (555) 456-7890',
		location: 'Austin, TX',
		relationship: 'Recruiter',
		lastContact: '2024-01-03',
		status: 'Active',
		notes: 'Great communication throughout the process.'
	},
	{
		id: 4,
		name: 'David Kim',
		title: 'CTO',
		company: 'CloudScale Inc',
		email: 'david.kim@cloudscale.com',
		phone: '+1 (555) 789-0123',
		location: 'Seattle, WA',
		relationship: 'Executive',
		lastContact: '2023-12-20',
		status: 'Inactive',
		notes: 'Met at AWS re:Invent. Interested in cloud expertise.'
	},
	{
		id: 5,
		name: 'Lisa Thompson',
		title: 'HR Director',
		company: 'StartupXYZ',
		email: 'lisa.thompson@startupxyz.com',
		phone: '+1 (555) 321-6540',
		location: 'Boston, MA',
		relationship: 'HR Contact',
		lastContact: '2024-01-10',
		status: 'Active',
		notes: 'New contact from recent application.'
	}
]

const getStatusColor=( status: string ) => {
	switch ( status ) {
		case 'Active':
			return 'bg-green-600/20 text-green-200 border-green-400/30'
		case 'Inactive':
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
		default:
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
	}
}

const getRelationshipColor=( relationship: string ) => {
	switch ( relationship ) {
		case 'Recruiter':
			return 'bg-blue-600/20 text-blue-200 border-blue-400/30'
		case 'Hiring Manager':
			return 'bg-purple-600/20 text-purple-200 border-purple-400/30'
		case 'Executive':
			return 'bg-orange-600/20 text-orange-200 border-orange-400/30'
		case 'HR Contact':
			return 'bg-green-600/20 text-green-200 border-green-400/30'
		default:
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
	}
}

export default function ContactsPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
							<p className="text-blue-200">Manage your professional network and connections</p>
						</div>
						<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
							<Plus className="w-4 h-4 mr-2" />
							Add Contact
						</Button>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-6">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
						<Input
							type="text"
							placeholder="Search contacts..."
							className="pl-10 bg-white/20 border-white/30 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm text-white placeholder-blue-200"
						/>
					</div>
				</div>

				{/* Contact Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Users className="w-6 h-6 text-white" />
							</div>
							<p className="text-white text-2xl font-bold">5</p>
							<p className="text-blue-200 text-sm">Total Contacts</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Star className="w-6 h-6 text-white" />
							</div>
							<p className="text-white text-2xl font-bold">4</p>
							<p className="text-blue-200 text-sm">Active</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Building2 className="w-6 h-6 text-white" />
							</div>
							<p className="text-white text-2xl font-bold">5</p>
							<p className="text-blue-200 text-sm">Companies</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<MessageCircle className="w-6 h-6 text-white" />
							</div>
							<p className="text-white text-2xl font-bold">3</p>
							<p className="text-blue-200 text-sm">This Week</p>
						</CardContent>
					</Card>
				</div>

				{/* Contacts List */}
				<Card className="bg-white/10 backdrop-blur-sm border-white/20">
					<CardHeader>
						<CardTitle className="text-white">All Contacts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{contacts.map( ( contact ) => (
								<div key={contact.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
											{contact.name.split( ' ' ).map( n => n[ 0 ] ).join( '' )}
										</div>
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="text-white font-medium">{contact.name}</h3>
												<Badge className={getStatusColor( contact.status )}>
													{contact.status}
												</Badge>
												<Badge className={getRelationshipColor( contact.relationship )}>
													{contact.relationship}
												</Badge>
											</div>
											<p className="text-blue-200 text-sm mb-1">{contact.title} at {contact.company}</p>
											<div className="flex items-center space-x-4 text-xs text-blue-200">
												<span className="flex items-center space-x-1">
													<Mail className="w-3 h-3" />
													{contact.email}
												</span>
												<span className="flex items-center space-x-1">
													<Phone className="w-3 h-3" />
													{contact.phone}
												</span>
												<span className="flex items-center space-x-1">
													<MapPin className="w-3 h-3" />
													{contact.location}
												</span>
											</div>
											{contact.notes&&(
												<p className="text-blue-200 text-xs mt-2 italic">"{contact.notes}"</p>
											)}
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
											<Mail className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
											<Phone className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
											<MessageCircle className="w-4 h-4" />
										</Button>
									</div>
								</div>
							) )}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
