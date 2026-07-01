/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, MessageCircle, FileText, User, MapPin, Phone, Calendar, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'

type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'

interface OrderItem {
    id: string
    product_id: string | null
    selected_color: string | null
    selected_gauge: number | null
    selected_finish: string | null
    length_meters: number | null
    quantity: number | null
    unit_price: number
    subtotal: number
    products?: {
        name: string
        slug: string
    } | null
}

interface Order {
    id: string
    order_number: string
    customer_name: string
    phone: string
    location: string
    payment_preference: string | null
    payment_method: string | null
    status: OrderStatus | null
    admin_notes: string | null
    created_at: string | null
    updated_at: string | null
    order_items: OrderItem[]
}

const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-gray-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-600' },
    { value: 'in_transit', label: 'In Transit', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
]

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [savingNotes, setSavingNotes] = useState(false)
    const [notesSaved, setNotesSaved] = useState(false)

    const [order, setOrder] = useState<Order | null>(null)
    const [status, setStatus] = useState<OrderStatus | ''>('')
    const [adminNotes, setAdminNotes] = useState('')

    useEffect(() => {
        async function fetchOrder() {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            products (
                                name,
                                slug
                            )
                        )
                    `)
                    .eq('id', orderId)
                    .single()

                if (error) throw error
                if (!data) throw new Error('Order not found')

                setOrder(data)
                setStatus(data.status || '')
                setAdminNotes(data.admin_notes || '')
            } catch (error: any) {
                console.error('Error fetching order:', error)
                toast.error(error.message || 'Failed to load order')
                router.push('/admin/orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, supabase, router])

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order) return

        setUpdatingStatus(true)
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error

            setStatus(newStatus)
            setOrder({ ...order, status: newStatus })
            toast.success(`Order status updated to "${ORDER_STATUSES.find(s => s.value === newStatus)?.label}"`)
        } catch (error: any) {
            console.error('Error updating status:', error)
            toast.error(error.message || 'Failed to update status')
        } finally {
            setUpdatingStatus(false)
        }
    }

    const handleSaveNotes = async () => {
        if (!order) return

        setSavingNotes(true)
        setNotesSaved(false)
        try {
            const { error } = await supabase
                .from('orders')
                .update({ admin_notes: adminNotes })
                .eq('id', orderId)

            if (error) throw error

            setOrder({ ...order, admin_notes: adminNotes })
            setNotesSaved(true)
            toast.success('Notes saved successfully')

            // Hide the checkmark after 3 seconds
            setTimeout(() => setNotesSaved(false), 3000)
        } catch (error: any) {
            console.error('Error saving notes:', error)
            toast.error(error.message || 'Failed to save notes')
        } finally {
            setSavingNotes(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <Link href="/admin/orders">
                        <Button>Back to Orders</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const currentStatus = ORDER_STATUSES.find(s => s.value === status)
    const totalAmount = order.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <Link
                href="/admin/orders"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{order.order_number}</h1>
                        <Badge className={currentStatus?.color}>
                            {currentStatus?.label}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Placed on {order.created_at && format(new Date(order.created_at), 'MMMM dd, yyyy \'at\' h:mm a')}
                    </p>
                </div>
                <Link href={`/admin/quotes/new?order_id=${order.id}`}>
                    <Button size="lg">
                        <FileText className="mr-2 h-5 w-5" />
                        Generate Quote
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column - Customer Info & Status */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.customer_name}</p>
                                    <p className="text-sm text-muted-foreground">Customer Name</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <a href={`tel:${order.phone}`} className="font-medium text-primary hover:underline">
                                        {order.phone}
                                    </a>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                </div>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                    <a
                                        href={`https://wa.me/${order.phone.replace(/^0/, '254')}?text=Hi%20${encodeURIComponent(order.customer_name)},%20this%20is%20Wigo%20Mabati%20regarding%20your%20order%20${order.order_number}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.location}</p>
                                    <p className="text-sm text-muted-foreground">Delivery Location</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium capitalize">
                                        {(order.payment_preference ?? '').replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Payment Preference</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Status</CardTitle>
                            <CardDescription>Update the current status of this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={status} onValueChange={handleStatusChange} disabled={updatingStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ORDER_STATUSES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {updatingStatus && (
                                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Updating status...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Order Items & Notes */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Items</CardTitle>
                            <CardDescription>
                                {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''} in this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {order.order_items && order.order_items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Color</TableHead>
                                                <TableHead>Gauge</TableHead>
                                                <TableHead>Finish</TableHead>
                                                <TableHead>Length</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Unit Price</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.order_items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.products?.name || 'Unknown Product'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.selected_color || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.selected_gauge ? `Gauge ${item.selected_gauge}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {item.selected_finish || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.length_meters ? `${item.length_meters}m` : '-'}
                                                    </TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>KES {item.unit_price.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        KES {item.subtotal.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Separator className="my-4" />
                                    <div className="flex justify-end">
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground mb-1">Total Estimated Amount</p>
                                            <p className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No items in this order
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admin Notes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Admin Notes</CardTitle>
                                    <CardDescription>
                                        Internal notes about this order (not visible to customer)
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleSaveNotes}
                                    disabled={savingNotes}
                                    size="sm"
                                >
                                    {savingNotes ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : notesSaved ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                            Saved
                                        </>
                                    ) : (
                                        'Save Notes'
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={adminNotes}
                                onChange={(e) => {
                                    setAdminNotes(e.target.value)
                                    setNotesSaved(false)
                                }}
                                placeholder="Add notes about this order... e.g., 'Client called, agreed to 30% deposit. Follow up on Friday.'"
                                rows={6}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}