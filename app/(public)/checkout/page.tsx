/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Loader2,
    ShoppingCart,
    Trash2,
    User,
    Phone,
    MapPin,
    CreditCard,
    Package,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'

interface OrderItem {
    productId: string
    productName: string
    productSlug: string
    color: string
    gauge: number
    finish: string
    length: number
    quantity: number
    unitPrice: number
    subtotal: number
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function CheckoutPage() {
    const router = useRouter()
    const supabase = createClient()

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Customer information
    const [customerName, setCustomerName] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [paymentPreference, setPaymentPreference] = useState<'full_payment' | 'lipa_pole_pole'>('full_payment')
    const [notes, setNotes] = useState('')

    // Load order items from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('wigo_order')
        if (stored) {
            try {
                const items = JSON.parse(stored)
                setOrderItems(items)
            } catch (error) {
                console.error('Error parsing order items:', error)
            }
        }
        setLoading(false)
    }, [])

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

    // Remove item from order
    const removeItem = (index: number) => {
        const updated = orderItems.filter((_, i) => i !== index)
        setOrderItems(updated)
        localStorage.setItem('wigo_order', JSON.stringify(updated))
        toast.success('Item removed from order')
    }

    // Clear entire order
    const clearOrder = () => {
        setOrderItems([])
        localStorage.removeItem('wigo_order')
        toast.success('Order cleared')
    }

    // Validate form
    const validateForm = () => {
        if (!customerName.trim()) {
            toast.error('Please enter your name')
            return false
        }

        if (!phone.trim()) {
            toast.error('Please enter your phone number')
            return false
        }

        // Validate Kenyan phone number format
        const phoneRegex = /^0[17]\d{8}$/
        if (!phoneRegex.test(phone.trim())) {
            toast.error('Please enter a valid Kenyan phone number (e.g., 0712345678)')
            return false
        }

        if (!location.trim()) {
            toast.error('Please enter your delivery location')
            return false
        }

        if (orderItems.length === 0) {
            toast.error('Your order is empty')
            return false
        }

        return true
    }

    // Submit order
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setSubmitting(true)

        try {
            // Insert order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: customerName.trim(),
                    phone: phone.trim(),
                    location: location.trim(),
                    payment_preference: paymentPreference,
                    admin_notes: notes.trim() || null,
                    order_number: `ORD-${Date.now()}`,
                })
                .select()
                .single()

            if (orderError) throw orderError
            if (!order) throw new Error('Failed to create order')

            // Insert order items
            const orderItemsToInsert = orderItems.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                selected_color: item.color,
                selected_gauge: item.gauge,
                selected_finish: item.finish,
                length_meters: item.length,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                subtotal: item.subtotal,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsToInsert)

            if (itemsError) throw itemsError

            // Clear localStorage
            localStorage.removeItem('wigo_order')

            toast.success('Order placed successfully!')

            // Redirect to confirmation page
            router.push(`/order-confirmation?order_number=${order.order_number}`)
        } catch (error: any) {
            console.error('Error submitting order:', error)
            toast.error(error.message || 'Failed to place order. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
                    <p className="text-muted-foreground mb-8">Complete your order details</p>
                </motion.div>

                {orderItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Your order is empty</h2>
                        <p className="text-muted-foreground mb-6">Add some products to get started</p>
                        <Link href="/products">
                            <Button size="lg">
                                Browse Products
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Form */}
                        <motion.div
                            className="lg:col-span-2 space-y-6"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Customer Information
                                    </CardTitle>
                                    <CardDescription>
                                        We&apos;ll use this to contact you about your order
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="0712345678"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            We&apos;ll contact you via WhatsApp or call
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Delivery Location *</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Textarea
                                                id="location"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g., Kajiado - Rongai, Near Adventist University"
                                                className="pl-10 min-h-[80px]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Preference */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Payment Preference
                                    </CardTitle>
                                    <CardDescription>
                                        Choose how you&apos;d like to pay
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={paymentPreference}
                                        onValueChange={(value: 'full_payment' | 'lipa_pole_pole') => setPaymentPreference(value)}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-start space-x-3 space-y-0 border-2 rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                            <RadioGroupItem value="full_payment" id="full_payment" />
                                            <div className="flex-1">
                                                <Label htmlFor="full_payment" className="font-semibold cursor-pointer">
                                                    Full Payment
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Pay the full amount upfront via M-Pesa or bank transfer
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 space-y-0 border-2 rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                            <RadioGroupItem value="lipa_pole_pole" id="lipa_pole_pole" />
                                            <div className="flex-1">
                                                <Label htmlFor="lipa_pole_pole" className="font-semibold cursor-pointer">
                                                    Lipa Pole Pole (Installments)
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Pay in installments. We&apos;ll work out a flexible payment plan with you
                                                </p>
                                                <Badge variant="secondary" className="mt-2">
                                                    Flexible
                                                </Badge>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Additional Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Notes (Optional)</CardTitle>
                                    <CardDescription>
                                        Any special instructions or questions?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g., Please deliver on Saturday morning, or call me before delivery..."
                                        rows={4}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Right Column - Order Summary */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Order Summary</span>
                                        <Badge variant="secondary">
                                            {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        {orderItems.map((item, index) => (
                                            <div key={index} className="border rounded-lg p-3 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm">{item.productName}</h4>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.color}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                G{item.gauge}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs capitalize">
                                                                {item.finish}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {item.length}m × {item.quantity} = KES {item.subtotal.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Total */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <span>Subtotal:</span>
                                            <span className="text-primary">KES {subtotal.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Delivery charges will be confirmed by admin
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full text-base py-6"
                                        size="lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                                Place Order
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        By placing this order, you agree to be contacted by our team via WhatsApp or phone
                                    </p>

                                    {/* Clear Order */}
                                    <Button
                                        variant="ghost"
                                        onClick={clearOrder}
                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        Clear Order
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}