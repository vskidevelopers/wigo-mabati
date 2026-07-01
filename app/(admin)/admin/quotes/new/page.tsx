/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2, Loader2, Save, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import TiptapEditor from '@/components/ui/tiptap-editor'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { QuotePDF } from '@/components/admin/QuotePDF'

interface Product {
    id: string
    name: string
    available_colors: string[] | null
    available_gauges: number[] | null
    available_finishes: string[] | null
    price_per_gauge: Record<string, number> | null
}

interface QuoteItem {
    id: string
    product_id: string
    product_name: string
    selected_color: string
    selected_gauge: number | null
    selected_finish: string
    description: string
    length_meters: number | null
    quantity: number
    unit_price: number
    subtotal: number
}

interface SavedQuote {
    id: string
    quote_number: string
    date_issued: string | null
    valid_until: string | null
    customer_name: string
    phone: string
    email: string | null
    location: string | null
    payment_preference: string
    deposit_amount: number | null
    balance_amount: number | null
    payment_instructions: string | null
    customer_notes: string | null
    terms_and_conditions: string | null
    subtotal: number | null
    delivery_fee: number | null
    vat_amount: number | null
    discount_amount: number | null
    grand_total: number | null
    quote_items: QuoteItem[]
}

export default function NewQuotePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order_id')
    const supabase = createClient()

    const [loading, setLoading] = useState(!!orderId)
    const [saving, setSaving] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [savedQuote, setSavedQuote] = useState<SavedQuote | null>(null)
    const [showDownloadModal, setShowDownloadModal] = useState(false)

    // Quote metadata
    const [customerName, setCustomerName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [location, setLocation] = useState('')
    const [validUntil, setValidUntil] = useState('')
    const [paymentPreference, setPaymentPreference] = useState<'full_payment' | 'lipa_pole_pole'>('full_payment')
    const [depositAmount, setDepositAmount] = useState<number>(0)

    // Financial
    const [deliveryFee, setDeliveryFee] = useState<number>(0)
    const [vatAmount, setVatAmount] = useState<number>(0)
    const [discountAmount, setDiscountAmount] = useState<number>(0)

    // Notes
    const [customerNotes, setCustomerNotes] = useState('')
    const [internalNotes, setInternalNotes] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')

    // Items
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])

    // Fetch products on mount
    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)

            if (data) {
                setProducts(data as Product[])
            }
        }

        fetchProducts()
    }, [supabase])

    // Fetch order data if order_id is present
    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) {
                setLoading(false)
                return
            }

            try {
                const { data: order, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            products (
                                name,
                                price_per_gauge
                            )
                        )
                    `)
                    .eq('id', orderId)
                    .single()

                if (error) throw error
                if (!order) throw new Error('Order not found')

                // Prefill customer info
                setCustomerName(order.customer_name)
                setPhone(order.phone)
                setLocation(order.location)
                setPaymentPreference(order.payment_preference ?? 'full_payment')

                // Set default validity (7 days from now)
                const validDate = new Date()
                validDate.setDate(validDate.getDate() + 7)
                setValidUntil(validDate.toISOString().split('T')[0])

                // Prefill quote items from order items
                if (order.order_items && order.order_items.length > 0) {
                    const items: QuoteItem[] = order.order_items.map((item: any) => {
                        const productPrice = item.products?.price_per_gauge || {}
                        const unitPrice = item.selected_gauge
                            ? (productPrice[item.selected_gauge.toString()] || item.unit_price)
                            : item.unit_price

                        return {
                            id: crypto.randomUUID(),
                            product_id: item.product_id,
                            product_name: item.products?.name || 'Unknown Product',
                            selected_color: item.selected_color || '',
                            selected_gauge: item.selected_gauge,
                            selected_finish: item.selected_finish || '',
                            description: `${item.products?.name || 'Product'} - ${item.selected_color || ''} ${item.selected_gauge ? `Gauge ${item.selected_gauge}` : ''} ${item.selected_finish || ''}`.trim(),
                            length_meters: item.length_meters,
                            quantity: item.quantity,
                            unit_price: unitPrice,
                            subtotal: unitPrice * (item.length_meters || 1) * item.quantity,
                        }
                    })
                    setQuoteItems(items)
                }
            } catch (error: any) {
                console.error('Error fetching order:', error)
                toast.error(error.message || 'Failed to load order data')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, supabase])

    // Set default validity if not from order
    useEffect(() => {
        if (!orderId && !validUntil) {
            const validDate = new Date()
            validDate.setDate(validDate.getDate() + 7)
            setValidUntil(validDate.toISOString().split('T')[0])
        }
    }, [orderId, validUntil])

    // Calculate totals
    const subtotal = quoteItems.reduce((sum, item) => sum + item.subtotal, 0)
    const grandTotal = subtotal + deliveryFee + vatAmount - discountAmount
    const balanceAmount = paymentPreference === 'lipa_pole_pole' ? grandTotal - depositAmount : 0

    const addQuoteItem = () => {
        setQuoteItems([
            ...quoteItems,
            {
                id: crypto.randomUUID(),
                product_id: '',
                product_name: '',
                selected_color: '',
                selected_gauge: null,
                selected_finish: '',
                description: '',
                length_meters: null,
                quantity: 1,
                unit_price: 0,
                subtotal: 0,
            },
        ])
    }

    const updateQuoteItem = (id: string, field: keyof QuoteItem, value: any) => {
        setQuoteItems(prev => {
            const updated = prev.map(item => {
                if (item.id !== id) return item

                const newItem = { ...item, [field]: value }

                // If product changed, fetch product details
                if (field === 'product_id' && value) {
                    const product = products.find(p => p.id === value)
                    if (product) {
                        newItem.product_name = product.name
                        newItem.selected_color = product.available_colors?.[0] ?? ''
                        newItem.selected_gauge = product.available_gauges?.[0] ?? null
                        newItem.selected_finish = product.available_finishes?.[0] ?? ''

                        // Set unit price based on gauge
                        if (newItem.selected_gauge != null) {
                            newItem.unit_price = product.price_per_gauge?.[newItem.selected_gauge.toString()] ?? 0
                        }
                    }
                }

                // If gauge changed, update price
                if (field === 'selected_gauge' && value && item.product_id) {
                    const product = products.find(p => p.id === item.product_id)
                    if (product) {
                        newItem.unit_price = product.price_per_gauge?.[value.toString()] ?? 0
                    }
                }

                // Recalculate subtotal
                newItem.subtotal = newItem.unit_price * (newItem.length_meters || 1) * newItem.quantity

                // Update description
                newItem.description = `${newItem.product_name} - ${newItem.selected_color} ${newItem.selected_gauge ? `Gauge ${newItem.selected_gauge}` : ''} ${newItem.selected_finish}`.trim()

                return newItem
            })
            return updated
        })
    }

    const removeQuoteItem = (id: string) => {
        setQuoteItems(prev => prev.filter(item => item.id !== id))
    }

    const handleSubmit = async (status: 'draft' | 'sent') => {
        if (quoteItems.length === 0) {
            toast.error('Please add at least one item to the quote')
            return
        }

        if (!customerName || !phone) {
            toast.error('Please fill in customer name and phone')
            return
        }

        setSaving(true)

        try {
            // Insert quote - quote_number will be auto-generated by database trigger (WigoQT-2026-0001)
            const { data: quote, error: quoteError } = await supabase
                .from('quotes')
                .insert({
                    order_id: orderId || null,
                    customer_name: customerName,
                    phone,
                    email: email || null,
                    location: location || null,
                    valid_until: validUntil || null,
                    subtotal,
                    delivery_fee: deliveryFee,
                    vat_amount: vatAmount,
                    discount_amount: discountAmount,
                    grand_total: grandTotal,
                    payment_preference: paymentPreference,
                    deposit_amount: paymentPreference === 'lipa_pole_pole' ? depositAmount : null,
                    balance_amount: paymentPreference === 'lipa_pole_pole' ? balanceAmount : null,
                    customer_notes: customerNotes || null,
                    internal_notes: internalNotes || null,
                    terms_and_conditions: termsAndConditions || null,
                    status,
                } as any)
                .select()
                .single()

            if (quoteError) throw quoteError

            // Insert quote items
            if (quoteItems.length > 0) {
                const itemsToInsert = quoteItems.map(item => ({
                    quote_id: quote.id,
                    product_id: item.product_id || null,
                    selected_color: item.selected_color || null,
                    selected_gauge: item.selected_gauge,
                    selected_finish: item.selected_finish || null,
                    description: item.description,
                    length_meters: item.length_meters,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.subtotal,
                }))

                const { error: itemsError } = await supabase
                    .from('quote_items')
                    .insert(itemsToInsert)

                if (itemsError) throw itemsError
            }

            // Save the quote data for PDF generation
            setSavedQuote({
                id: quote.id,
                quote_number: quote.quote_number, // Auto-generated by trigger: WigoQT-2026-0001
                date_issued: quote.date_issued,
                valid_until: quote.valid_until,
                customer_name: quote.customer_name ?? customerName,
                phone: quote.phone ?? phone,
                email: quote.email,
                location: quote.location,
                payment_preference: quote.payment_preference ?? paymentPreference,
                deposit_amount: quote.deposit_amount,
                balance_amount: quote.balance_amount,
                payment_instructions: quote.payment_instructions,
                customer_notes: quote.customer_notes,
                terms_and_conditions: quote.terms_and_conditions,
                subtotal: quote.subtotal,
                delivery_fee: quote.delivery_fee,
                vat_amount: quote.vat_amount,
                discount_amount: quote.discount_amount,
                grand_total: quote.grand_total,
                quote_items: quoteItems,
            })

            if (status === 'sent') {
                // Show download modal for "sent" quotes
                setShowDownloadModal(true)
                toast.success(`Quote ${quote.quote_number} saved! Download the PDF to share with customer.`)
            } else {
                toast.success(`Quote ${quote.quote_number} saved as draft`)
                // Redirect to quotes list for drafts
                router.push('/admin/quotes')
            }
        } catch (error: any) {
            console.error('Error creating quote:', error)
            toast.error(error.message || 'Failed to create quote')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <Link
                href={orderId ? `/admin/orders/${orderId}` : '/admin/quotes'}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {orderId ? 'Back to Order' : 'Back to Quotes'}
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    {orderId ? 'Generate Quote from Order' : 'Create New Quote'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {orderId ? 'Quote prefilled with order data' : 'Create a standalone quote'}
                </p>
            </div>

            <div className="space-y-6">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                        <CardDescription>Details of the customer receiving this quote</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Customer Name *</Label>
                                <Input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone *</Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Valid Until</Label>
                                <Input
                                    type="date"
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Preference</Label>
                                <Select
                                    value={paymentPreference}
                                    onValueChange={(v: 'full_payment' | 'lipa_pole_pole') => setPaymentPreference(v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full_payment">Full Payment</SelectItem>
                                        <SelectItem value="lipa_pole_pole">Lipa Pole Pole (Installments)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {paymentPreference === 'lipa_pole_pole' && (
                            <div className="space-y-2">
                                <Label>Deposit Amount (KES)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quote Items */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Quote Items</CardTitle>
                                <CardDescription>Add products and services to this quote</CardDescription>
                            </div>
                            <Button onClick={addQuoteItem} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {quoteItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No items added yet. Click &quot;Add Item&quot; to start building the quote.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Color</TableHead>
                                            <TableHead>Gauge</TableHead>
                                            <TableHead>Finish</TableHead>
                                            <TableHead>Length (m)</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quoteItems.map((item) => {
                                            const product = products.find(p => p.id === item.product_id)
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Select
                                                            value={item.product_id}
                                                            onValueChange={(v) => updateQuoteItem(item.id, 'product_id', v)}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Select product" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {products.map((p) => (
                                                                    <SelectItem key={p.id} value={p.id}>
                                                                        {p.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={item.selected_color}
                                                            onValueChange={(v) => updateQuoteItem(item.id, 'selected_color', v)}
                                                            disabled={!product}
                                                        >
                                                            <SelectTrigger className="w-[120px]">
                                                                <SelectValue placeholder="Color" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {product?.available_colors?.map((color) => (
                                                                    <SelectItem key={color} value={color}>
                                                                        {color}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={item.selected_gauge?.toString() || ''}
                                                            onValueChange={(v) => updateQuoteItem(item.id, 'selected_gauge', parseInt(v))}
                                                            disabled={!product}
                                                        >
                                                            <SelectTrigger className="w-[100px]">
                                                                <SelectValue placeholder="Gauge" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {product?.available_gauges?.map((gauge) => (
                                                                    <SelectItem key={gauge} value={gauge.toString()}>
                                                                        {gauge}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={item.selected_finish}
                                                            onValueChange={(v) => updateQuoteItem(item.id, 'selected_finish', v)}
                                                            disabled={!product}
                                                        >
                                                            <SelectTrigger className="w-[100px]">
                                                                <SelectValue placeholder="Finish" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {product?.available_finishes?.map((finish) => (
                                                                    <SelectItem key={finish} value={finish}>
                                                                        {finish}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            value={item.length_meters || ''}
                                                            onChange={(e) => updateQuoteItem(item.id, 'length_meters', parseFloat(e.target.value) || null)}
                                                            className="w-[80px]"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                            className="w-[70px]"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateQuoteItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                            className="w-[100px]"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        KES {item.subtotal.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeQuoteItem(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Financial Summary</CardTitle>
                        <CardDescription>Adjust delivery, VAT, and discounts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Delivery Fee (KES)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>VAT Amount (KES)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={vatAmount}
                                    onChange={(e) => setVatAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Discount Amount (KES)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>KES {subtotal.toLocaleString()}</span>
                            </div>
                            {deliveryFee > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery:</span>
                                    <span>KES {deliveryFee.toLocaleString()}</span>
                                </div>
                            )}
                            {vatAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">VAT:</span>
                                    <span>KES {vatAmount.toLocaleString()}</span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount:</span>
                                    <span className="text-red-600">-KES {discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Grand Total:</span>
                                <span>KES {grandTotal.toLocaleString()}</span>
                            </div>
                            {paymentPreference === 'lipa_pole_pole' && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Deposit:</span>
                                        <span>KES {depositAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span>Balance:</span>
                                        <span>KES {balanceAmount.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes & Terms */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes & Terms</CardTitle>
                        <CardDescription>Additional information for the customer and internal notes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Customer Notes (visible on quote)</Label>
                            <TiptapEditor
                                content={customerNotes}
                                onChange={setCustomerNotes}
                                placeholder="e.g., Delivery expected within 5 days of deposit payment..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Internal Notes (admin only, not on quote)</Label>
                            <TiptapEditor
                                content={internalNotes}
                                onChange={setInternalNotes}
                                placeholder="e.g., Client negotiated 5% discount, follow up next week..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Terms & Conditions</Label>
                            <TiptapEditor
                                content={termsAndConditions}
                                onChange={setTermsAndConditions}
                                placeholder="Standard terms and conditions for this quote..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={() => handleSubmit('draft')}
                        disabled={saving}
                        variant="outline"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save as Draft
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => handleSubmit('sent')}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FileText className="mr-2 h-4 w-4" />
                                Save & Download PDF
                            </>
                        )}
                    </Button>
                    <Link href={orderId ? `/admin/orders/${orderId}` : '/admin/quotes'}>
                        <Button variant="ghost">Cancel</Button>
                    </Link>
                </div>
            </div>

            {/* PDF Download Modal */}
            {showDownloadModal && savedQuote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Quote Saved Successfully!
                            </CardTitle>
                            <CardDescription>
                                Your quote <span className="font-semibold">{savedQuote.quote_number}</span> has been saved. Download the PDF to share with the customer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <PDFDownloadLink
                                document={
                                    <QuotePDF
                                        data={{
                                            quote_number: savedQuote.quote_number,
                                            date_issued: savedQuote.date_issued,
                                            valid_until: savedQuote.valid_until,
                                            customer_name: savedQuote.customer_name,
                                            phone: savedQuote.phone,
                                            email: savedQuote.email,
                                            location: savedQuote.location,
                                            payment_preference: savedQuote.payment_preference,
                                            deposit_amount: savedQuote.deposit_amount,
                                            balance_amount: savedQuote.balance_amount,
                                            payment_instructions: savedQuote.payment_instructions,
                                            customer_notes: savedQuote.customer_notes,
                                            terms_and_conditions: savedQuote.terms_and_conditions,
                                            subtotal: savedQuote.subtotal,
                                            delivery_fee: savedQuote.delivery_fee,
                                            vat_amount: savedQuote.vat_amount,
                                            discount_amount: savedQuote.discount_amount,
                                            grand_total: savedQuote.grand_total,
                                            items: savedQuote.quote_items.map(item => ({
                                                description: item.description,
                                                selected_color: item.selected_color,
                                                selected_gauge: item.selected_gauge,
                                                selected_finish: item.selected_finish,
                                                length_meters: item.length_meters,
                                                quantity: item.quantity,
                                                unit_price: item.unit_price,
                                                subtotal: item.subtotal,
                                            })),
                                        }}
                                    />
                                }
                                fileName={`${savedQuote.quote_number}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button className="w-full" size="lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download PDF
                                            </>
                                        )}
                                    </Button>
                                )}
                            </PDFDownloadLink>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowDownloadModal(false)
                                        router.push('/admin/quotes')
                                    }}
                                >
                                    Go to Quotes List
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowDownloadModal(false)
                                        setSavedQuote(null)
                                        // Reset form for new quote
                                        setCustomerName('')
                                        setPhone('')
                                        setEmail('')
                                        setLocation('')
                                        setQuoteItems([])
                                        setCustomerNotes('')
                                        setInternalNotes('')
                                        setTermsAndConditions('')
                                    }}
                                >
                                    Create Another
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}