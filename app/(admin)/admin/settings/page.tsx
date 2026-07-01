'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Settings as SettingsIcon,
    Building2,
    CreditCard,
    Truck,
    FileText,
    Percent,
    Image as ImageIcon,
    Share2,
    Mail,
    MessageCircle,
    Construction,
    Sparkles,
    Rocket,
    Clock,
    CheckCircle2,
    Circle,
    Lock
} from 'lucide-react'

interface SettingCategory {
    icon: React.ElementType
    title: string
    description: string
    status: 'planned' | 'in-progress' | 'done'
    priority: 'high' | 'medium' | 'low'
}

const upcomingSettings: SettingCategory[] = [
    {
        icon: Building2,
        title: 'Company Information',
        description: 'Business name, address, contact details, and branding',
        status: 'planned',
        priority: 'high',
    },
    {
        icon: CreditCard,
        title: 'Payment Details',
        description: 'M-Pesa Paybill, Till numbers, and bank account info',
        status: 'planned',
        priority: 'high',
    },
    {
        icon: Truck,
        title: 'Delivery Zones',
        description: 'Configure delivery areas and base rates across Kenya',
        status: 'planned',
        priority: 'high',
    },
    {
        icon: FileText,
        title: 'Quote Templates',
        description: 'Default terms, conditions, and validity periods',
        status: 'planned',
        priority: 'medium',
    },
    {
        icon: Percent,
        title: 'Tax & VAT Settings',
        description: 'VAT rates, tax calculations, and invoice formatting',
        status: 'planned',
        priority: 'medium',
    },
    {
        icon: ImageIcon,
        title: 'Logo & Branding',
        description: 'Upload company logo and customize PDF quote branding',
        status: 'planned',
        priority: 'medium',
    },
    {
        icon: Share2,
        title: 'Social Media',
        description: 'Facebook, Instagram, and other social links',
        status: 'planned',
        priority: 'low',
    },
    {
        icon: Mail,
        title: 'Email Templates',
        description: 'Automated emails for quotes, orders, and follow-ups',
        status: 'planned',
        priority: 'low',
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp Templates',
        description: 'Pre-written messages for common customer interactions',
        status: 'planned',
        priority: 'low',
    },
]

const getStatusBadge = (status: SettingCategory['status']) => {
    switch (status) {
        case 'done':
            return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" /> Live</Badge>
        case 'in-progress':
            return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3 animate-spin" /> Building</Badge>
        case 'planned':
            return <Badge variant="outline"><Circle className="mr-1 h-3 w-3" /> Planned</Badge>
    }
}

const getPriorityColor = (priority: SettingCategory['priority']) => {
    switch (priority) {
        case 'high':
            return 'text-red-500'
        case 'medium':
            return 'text-yellow-500'
        case 'low':
            return 'text-blue-500'
    }
}

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8 max-w-6xl">
            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-8">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <SettingsIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground">Configure your Wigo Mabati workspace</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg max-w-2xl">
                        <Construction className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            <span className="font-semibold">Under Construction:</span> We&apos;re building something great.
                            These settings will be available soon. Think of it like laying the foundation for a strong roof —
                            takes time, but worth it. 🏗️
                        </p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Settings</CardTitle>
                        <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingSettings.length}</div>
                        <p className="text-xs text-muted-foreground">Configuration options planned</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                        <Rocket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {upcomingSettings.filter(s => s.priority === 'high').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Critical for business operations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0%</div>
                        <p className="text-xs text-muted-foreground">Just getting started</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Settings Grid */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Upcoming Settings
                            </CardTitle>
                            <CardDescription>
                                Here&apos;s what&apos;s coming to help you run Wigo Mabati even smoother
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Roadmap v1.0
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingSettings.map((setting, index) => {
                            const Icon = setting.icon
                            return (
                                <div
                                    key={index}
                                    className="group relative p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {getStatusBadge(setting.status)}
                                            <span className={`text-xs font-medium ${getPriorityColor(setting.priority)}`}>
                                                {setting.priority} priority
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mb-1">{setting.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {setting.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Need a Setting We Missed?
                    </CardTitle>
                    <CardDescription>
                        Tell us what configuration options would make your workflow easier
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 p-4 bg-muted/50 rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground">
                                💡 <span className="font-medium">Pro tip:</span> While settings are being built,
                                you can manage most configurations directly in the relevant pages:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                <li>• <span className="font-medium">Products:</span> Manage catalog, prices, and options</li>
                                <li>• <span className="font-medium">Quotes:</span> Set custom terms per quote</li>
                                <li>• <span className="font-medium">Orders:</span> Track status and add notes</li>
                            </ul>
                        </div>
                        <Button
                            variant="outline"
                            className="sm:self-start"
                            onClick={() => window.open('https://wa.me/254748933988?text=Hi%2C%20I%20have%20a%20suggestion%20for%20Wigo%20Mabati%20settings%3A', '_blank')}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Send Feedback
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Built with care by the Wigo Mabati team 🇰🇪
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    &quot;Durable roofs, unmatched quality&quot; — even in our code.
                </p>
            </div>
        </div>
    )
}