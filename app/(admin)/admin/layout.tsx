import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    // const { data: { user } } = await supabase.auth.getUser()
    const user = { id: 1 } // Placeholder for user authentication check

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/admin/login')
    }

    const profile = { role: 'admin' } // Placeholder for profile role check

    // Check if user is admin
    // const { data: profile } = await supabase
    //     .from('profiles')
    //     .select('role')
    //     .eq('id', user.id)
    //     .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-background border-r min-h-screen sticky top-0">
                    <div className="p-6">
                        <h2 className="text-xl font-bold">Wigo Admin</h2>
                        <p className="text-sm text-muted-foreground mt-1">Management Portal</p>
                    </div>

                    <Separator />

                    <nav className="p-4 space-y-1">
                        <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/orders">
                            <Button variant="ghost" className="w-full justify-start">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Orders
                            </Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button variant="ghost" className="w-full justify-start">
                                <Package className="mr-2 h-4 w-4" />
                                Products
                            </Button>
                        </Link>
                        <Link href="/admin/quotes">
                            <Button variant="ghost" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Quotes
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </nav>

                    <Separator className="mt-auto" />

                    <div className="p-4">
                        <form action="/admin/logout">
                            <Button variant="outline" className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}