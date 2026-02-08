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
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
		case 'Inactive':
			return 'bg-white/[0.06] text-violet-200/70 border-white/[0.10]'
		default:
			return 'bg-white/[0.06] text-violet-200/70 border-white/[0.10]'
	}
}

const getRelationshipColor=( relationship: string ) => {
	switch ( relationship ) {
		case 'Recruiter':
			return 'bg-blue-500/15 text-blue-300 border-blue-400/30'
		case 'Hiring Manager':
			return 'bg-purple-500/15 text-purple-300 border-purple-400/30'
		case 'Executive':
			return 'bg-orange-500/15 text-orange-300 border-orange-400/30'
		case 'HR Contact':
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
		default:
			return 'bg-white/[0.06] text-violet-200/70 border-white/[0.10]'
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
							<h1 className="text-4xl font-bold text-gradient-heading mb-2">Contacts</h1>
							<p className="text-violet-300/60">Manage your professional network and connections</p>
						</div>
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							Add Contact
						</Button>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-6">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300/40 w-4 h-4" />
						<Input
							type="text"
							placeholder="Search contacts..."
							className="pl-10"
						/>
					</div>
				</div>

				{/* Contact Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card className="glass glass-interactive animate-fade-up" style={{ animationDelay: '0ms' }}>
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Users className="w-6 h-6 text-blue-400" />
							</div>
							<p className="text-white text-2xl font-bold text-gradient-primary">5</p>
							<p className="text-violet-200/70 text-sm">Total Contacts</p>
						</CardContent>
					</Card>

					<Card className="glass glass-interactive animate-fade-up" style={{ animationDelay: '80ms' }}>
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-emerald-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Star className="w-6 h-6 text-emerald-400" />
							</div>
							<p className="text-white text-2xl font-bold text-gradient-primary">4</p>
							<p className="text-violet-200/70 text-sm">Active</p>
						</CardContent>
					</Card>

					<Card className="glass glass-interactive animate-fade-up" style={{ animationDelay: '160ms' }}>
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-purple-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Building2 className="w-6 h-6 text-purple-400" />
							</div>
							<p className="text-white text-2xl font-bold text-gradient-primary">5</p>
							<p className="text-violet-200/70 text-sm">Companies</p>
						</CardContent>
					</Card>

					<Card className="glass glass-interactive animate-fade-up" style={{ animationDelay: '240ms' }}>
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 bg-orange-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
								<MessageCircle className="w-6 h-6 text-orange-400" />
							</div>
							<p className="text-white text-2xl font-bold text-gradient-primary">3</p>
							<p className="text-violet-200/70 text-sm">This Week</p>
						</CardContent>
					</Card>
				</div>

				{/* Contacts List */}
				<Card className="glass">
					<CardHeader>
						<CardTitle className="text-white">All Contacts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{contacts.map( ( contact,index ) => (
								<div key={contact.id} className="flex items-start justify-between p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-200 animate-fade-up" style={{ animationDelay: `${index*50}ms` }}>
									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-violet-500/30">
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
											<p className="text-violet-200/70 text-sm mb-1">{contact.title} at {contact.company}</p>
											<div className="flex items-center space-x-4 text-xs text-violet-300/40">
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
												<p className="text-violet-200/70 text-xs mt-2 italic">"{contact.notes}"</p>
											)}
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Button variant="ghost" size="sm" className="text-violet-200/70 hover:text-white hover:bg-white/[0.06]">
											<Mail className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm" className="text-violet-200/70 hover:text-white hover:bg-white/[0.06]">
											<Phone className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm" className="text-violet-200/70 hover:text-white hover:bg-white/[0.06]">
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
