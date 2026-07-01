import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Package, FileText, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch stats
    const [
        { count: ordersCount },
        { count: productsCount },
        { count: quotesCount },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
    ])

    // Count orders by status
    const { data: ordersByStatus } = await supabase
        .from('orders')
        .select('status')

    const statusCounts = ordersByStatus?.reduce((acc, order) => {
        if (order.status) {
            acc[order.status] = (acc[order.status] || 0) + 1
        }
        return acc
    }, {} as Record<string, number>) || {}

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome to Wigo Mabati Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {statusCounts['new'] || 0} new orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Active catalog items</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quotes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{quotesCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Generated quotes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {ordersCount && quotesCount
                                ? Math.round((quotesCount / ordersCount) * 100)
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">Orders to quotes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders placed by customers</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentOrders && recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{order.customer_name}</p>
                                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{order.order_number}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No orders yet
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}