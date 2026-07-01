import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageCircle, Eye, ShoppingCart, Package } from 'lucide-react'
import { format } from 'date-fns'

// Helper to map status to badge variants
const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
        case 'new':
            return <Badge variant="default">New</Badge>
        case 'contacted':
            return <Badge variant="secondary">Contacted</Badge>
        case 'confirmed':
            return <Badge className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>
        case 'in_transit':
            return <Badge className="bg-purple-500 hover:bg-purple-600">In Transit</Badge>
        case 'delivered':
            return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
        case 'cancelled':
            return <Badge variant="destructive">Cancelled</Badge>
        default:
            return <Badge variant="outline">{status ?? 'unknown'}</Badge>
    }
}

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // Fetch all orders, newest first
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching orders:', error)
    }

    // Calculate quick stats
    const newOrdersCount = orders?.filter(o => o.status === 'new').length || 0

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-8 w-8" />
                        Orders Inbox
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage customer orders and follow up via WhatsApp
                    </p>
                </div>
                {newOrdersCount > 0 && (
                    <Badge variant="default" className="text-sm px-3 py-1">
                        {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''}
                    </Badge>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>
                        {orders?.length || 0} total orders received
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {orders && orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Order #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id} className="group">
                                            <TableCell className="font-medium">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell>{order.customer_name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`tel:${order.phone}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {order.phone}
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {order.location}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs capitalize">
                                                    {order.payment_preference?.replace('_', ' ') ?? 'Unknown'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(order.status)}
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {order.created_at
                                                    ? format(new Date(order.created_at), 'MMM dd, yyyy')
                                                    : 'N/A'
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    {/* Quick WhatsApp Follow-up */}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Follow up on WhatsApp"
                                                    >
                                                        <a
                                                            href={`https://wa.me/${order.phone.replace(/^0/, '254')}?text=Hi%20${encodeURIComponent(order.customer_name)},%20this%20is%20Wigo%20Mabati%20regarding%20your%20order%20${order.order_number}.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </a>
                                                    </Button>

                                                    {/* View Order Details */}
                                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Orders placed by customers through the website will appear here.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}