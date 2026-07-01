'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    CheckCircle2,
    MessageCircle,
    Package,
    Clock,
    Phone,
    ArrowRight,
    Loader2,
    Home,
    ShoppingBag
} from 'lucide-react'
import { toast } from 'sonner'

interface OrderItem {
    id: string
    product_id: string
    selected_color: string | null
    selected_gauge: number | null
    selected_finish: string | null
    length_meters: number | null
    quantity: number
    unit_price: number
    subtotal: number
    products?: {
        name: string
    }
}

interface Order {
    id: string
    order_number: string
    customer_name: string
    phone: string
    location: string
    payment_preference: string
    status: string
    created_at: string
    order_items: OrderItem[]
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            type: "spring",
            stiffness: 200
        }
    }
} as const

// Inner component that uses useSearchParams
function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order_number')
    const supabase = createClient()

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch order details
    useEffect(() => {
        async function fetchOrder() {
            if (!orderNumber) {
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            products (
                                name
                            )
                        )
                    `)
                    .eq('order_number', orderNumber)
                    .single()

                if (error) throw error
                if (data) {
                    setOrder(data as Order)
                }
            } catch (error) {
                console.error('Error fetching order:', error)
                toast.error('Failed to load order details')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderNumber, supabase])

    // Calculate total
    const total = order?.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        if (!order) return ''

        let message = `Hi, I just placed order ${order.order_number}.\n\n`
        message += `Customer: ${order.customer_name}\n`
        message += `Phone: ${order.phone}\n`
        message += `Location: ${order.location}\n\n`
        message += `Items:\n`

        order.order_items?.forEach((item, idx) => {
            message += `${idx + 1}. ${item.products?.name || 'Product'}\n`
            message += `   Color: ${item.selected_color || 'N/A'}\n`
            message += `   Gauge: ${item.selected_gauge || 'N/A'}\n`
            message += `   Finish: ${item.selected_finish || 'N/A'}\n`
            message += `   Length: ${item.length_meters || 'N/A'}m\n`
            message += `   Quantity: ${item.quantity}\n`
            message += `   Subtotal: KES ${item.subtotal.toLocaleString()}\n\n`
        })

        message += `Total: KES ${total.toLocaleString()}\n`
        message += `Payment: ${order.payment_preference === 'lipa_pole_pole' ? 'Lipa Pole Pole' : 'Full Payment'}\n\n`
        message += `Please confirm my order. Thank you!`

        return message
    }

    const handleWhatsAppFollowUp = () => {
        const message = generateWhatsAppMessage()
        const whatsappUrl = `https://wa.me/254748933988?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-muted-foreground mb-6">We couldn&apos;t find your order details.</p>
                    <Link href="/">
                        <Button>Go to Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-primary/5">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="max-w-3xl mx-auto"
                >
                    {/* Success Icon */}
                    <motion.div
                        variants={scaleIn}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">Order Placed Successfully!</h1>
                        <p className="text-xl text-muted-foreground">
                            Thank you for choosing Wigo Mabati
                        </p>
                    </motion.div>

                    {/* Order Number Card */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
                                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                        {order.order_number}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Save this number for reference
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* What Happens Next */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    What Happens Next?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">We&apos;ll Contact You</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Our team will reach out via WhatsApp or phone within 30 minutes to confirm your order details and discuss delivery.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Final Confirmation</h4>
                                            <p className="text-sm text-muted-foreground">
                                                We&apos;ll confirm the final price (including delivery charges) and payment details.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Delivery</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Once payment is confirmed, we&apos;ll schedule delivery to your location.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Order Summary</span>
                                    <Badge variant="secondary">
                                        {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Customer Info */}
                                <div className="space-y-2 pb-4 border-b">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Customer:</span>
                                        <span className="font-medium">{order.customer_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span className="font-medium">{order.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium text-right max-w-[60%]">{order.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Payment:</span>
                                        <span className="font-medium">
                                            {order.payment_preference === 'lipa_pole_pole' ? 'Lipa Pole Pole' : 'Full Payment'}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                    {order.order_items?.map((item, index) => (
                                        <div key={item.id} className="border rounded-lg p-3 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{item.products?.name || 'Product'}</h4>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.selected_color && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.selected_color}
                                                            </Badge>
                                                        )}
                                                        {item.selected_gauge && (
                                                            <Badge variant="outline" className="text-xs">
                                                                G{item.selected_gauge}
                                                            </Badge>
                                                        )}
                                                        {item.selected_finish && (
                                                            <Badge variant="outline" className="text-xs capitalize">
                                                                {item.selected_finish}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {item.length_meters}m × {item.quantity}
                                                </span>
                                                <span className="font-semibold">
                                                    KES {item.subtotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Total */}
                                <div className="flex items-center justify-between text-xl font-bold">
                                    <span>Estimated Total:</span>
                                    <span className="text-primary">KES {total.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    *Excludes delivery charges. Final price will be confirmed by our team.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={fadeIn}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        <Button
                            onClick={handleWhatsAppFollowUp}
                            className="w-full text-base py-6 bg-green-500 hover:bg-green-600"
                            size="lg"
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Follow Up on WhatsApp
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/products" className="w-full">
                                <Button variant="outline" className="w-full" size="lg">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Link href="/" className="w-full">
                                <Button variant="outline" className="w-full" size="lg">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-sm text-muted-foreground">
                                Need immediate assistance?{' '}
                                <a
                                    href="tel:0748933988"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Call us: 0748 933988
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

// Main page component with Suspense boundary
export default function OrderConfirmationPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }
        >
            <OrderConfirmationContent />
        </Suspense>
    )
}