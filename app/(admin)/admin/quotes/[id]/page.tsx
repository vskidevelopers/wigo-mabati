/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Download, User, MapPin, Phone, Mail, Calendar, Loader2, CheckCircle2, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import TiptapEditor from '@/components/ui/tiptap-editor'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { QuotePDF } from '@/components/admin/QuotePDF'

type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

interface QuoteItem {
    id: string
    product_id: string | null
    selected_color: string | null
    selected_gauge: number | null
    selected_finish: string | null
    description: string
    length_meters: number | null
    quantity: number
    unit_price: number
    subtotal: number
    products?: {
        name: string
    }
}

interface Quote {
    id: string
    quote_number: string
    order_id: string | null
    customer_name: string
    phone: string
    email: string | null
    location: string | null
    date_issued: string | null
    valid_until: string | null
    subtotal: number | null
    delivery_fee: number | null
    vat_amount: number | null
    discount_amount: number | null
    grand_total: number | null
    payment_preference: string
    deposit_amount: number | null
    balance_amount: number | null
    payment_instructions: string | null
    customer_notes: string | null
    internal_notes: string | null
    terms_and_conditions: string | null
    status: QuoteStatus | null
    pdf_url: string | null
    created_at: string | null
    updated_at: string | null
    quote_items: QuoteItem[] | null
    orders?: {
        order_number: string
    } | null
}

const QUOTE_STATUSES: { value: QuoteStatus; label: string; color: string }[] = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-500' },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { value: 'expired', label: 'Expired', color: 'bg-orange-500' },
]

export default function QuoteDetailPage() {
    const params = useParams()
    const router = useRouter()
    const quoteId = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [saved, setSaved] = useState(false)

    const [quote, setQuote] = useState<Quote | null>(null)

    // Editable fields
    const [status, setStatus] = useState<QuoteStatus | null>(null)
    const [customerNotes, setCustomerNotes] = useState('')
    const [internalNotes, setInternalNotes] = useState('')
    const [paymentInstructions, setPaymentInstructions] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [vatAmount, setVatAmount] = useState(0)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [depositAmount, setDepositAmount] = useState(0)

    useEffect(() => {
        async function fetchQuote() {
            try {
                const { data, error } = await supabase
                    .from('quotes')
                    .select(`
                        *,
                        quote_items (
                            *,
                            products (
                                name
                            )
                        ),
                        orders (
                            order_number
                        )
                    `)
                    .eq('id', quoteId)
                    .single()

                if (error) throw error
                if (!data) throw new Error('Quote not found')

                const quoteData = data as Quote
                setQuote(quoteData)
                setStatus(quoteData.status)
                setCustomerNotes(quoteData.customer_notes || '')
                setInternalNotes(quoteData.internal_notes || '')
                setPaymentInstructions(quoteData.payment_instructions || '')
                setTermsAndConditions(quoteData.terms_and_conditions || '')
                setDeliveryFee(quoteData.delivery_fee || 0)
                setVatAmount(quoteData.vat_amount || 0)
                setDiscountAmount(quoteData.discount_amount || 0)
                setDepositAmount(quoteData.deposit_amount || 0)
            } catch (error: any) {
                console.error('Error fetching quote:', error)
                toast.error(error.message || 'Failed to load quote')
                router.push('/admin/quotes')
            } finally {
                setLoading(false)
            }
        }

        fetchQuote()
    }, [quoteId, supabase, router])

    const handleSave = async () => {
        if (!quote) return

        setSaving(true)
        setSaved(false)

        try {
            const subtotal = quote.quote_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0
            const grandTotal = subtotal + deliveryFee + vatAmount - discountAmount
            const balanceAmount = quote.payment_preference === 'lipa_pole_pole'
                ? grandTotal - depositAmount
                : null

            const { error } = await supabase
                .from('quotes')
                .update({
                    status,
                    customer_notes: customerNotes || null,
                    internal_notes: internalNotes || null,
                    payment_instructions: paymentInstructions || null,
                    terms_and_conditions: termsAndConditions || null,
                    delivery_fee: deliveryFee,
                    vat_amount: vatAmount,
                    discount_amount: discountAmount,
                    deposit_amount: quote.payment_preference === 'lipa_pole_pole' ? depositAmount : null,
                    balance_amount: balanceAmount,
                    grand_total: grandTotal,
                })
                .eq('id', quoteId)

            if (error) throw error

            // Update local state
            setQuote({
                ...quote,
                status,
                customer_notes: customerNotes || null,
                internal_notes: internalNotes || null,
                payment_instructions: paymentInstructions || null,
                terms_and_conditions: termsAndConditions || null,
                delivery_fee: deliveryFee,
                vat_amount: vatAmount,
                discount_amount: discountAmount,
                deposit_amount: quote.payment_preference === 'lipa_pole_pole' ? depositAmount : null,
                balance_amount: balanceAmount,
                grand_total: grandTotal,
            })

            setIsEditing(false)
            setSaved(true)
            toast.success('Quote updated successfully')

            setTimeout(() => setSaved(false), 3000)
        } catch (error: any) {
            console.error('Error saving quote:', error)
            toast.error(error.message || 'Failed to save quote')
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

    if (!quote) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Quote Not Found</h1>
                    <Link href="/admin/quotes">
                        <Button>Back to Quotes</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const currentStatus = QUOTE_STATUSES.find(s => s.value === status)
    const subtotal = quote.quote_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <Link
                href="/admin/quotes"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quotes
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{quote.quote_number}</h1>
                        <Badge className={currentStatus?.color}>
                            {currentStatus?.label}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Issued: {quote.date_issued ? format(new Date(quote.date_issued), 'MMMM dd, yyyy') : '—'}</span>
                        {quote.valid_until && (
                            <span>Valid until: {format(new Date(quote.valid_until), 'MMMM dd, yyyy')}</span>
                        )}
                        {quote.orders && (
                            <Link href={`/admin/orders/${quote.order_id}`} className="text-primary hover:underline">
                                From Order: {quote.orders.order_number}
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Quote
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : saved ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button onClick={() => setIsEditing(false)} variant="ghost">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </>
                    )}
                    {quote && (
                        <PDFDownloadLink
                            document={
                                <QuotePDF
                                    data={{
                                        quote_number: quote.quote_number,
                                        date_issued: quote.date_issued,
                                        valid_until: quote.valid_until,
                                        customer_name: quote.customer_name,
                                        phone: quote.phone,
                                        email: quote.email,
                                        location: quote.location,
                                        payment_preference: quote.payment_preference,
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
                                        items: (quote.quote_items || []).map(item => ({
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
                            fileName={`${quote.quote_number}.pdf`}
                        >
                            {({ loading }) => (
                                <Button variant="outline" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
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
                    )}
                </div>
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
                                    <p className="font-medium">{quote.customer_name}</p>
                                    <p className="text-sm text-muted-foreground">Customer Name</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <a href={`tel:${quote.phone}`} className="font-medium text-primary hover:underline">
                                        {quote.phone}
                                    </a>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                </div>
                            </div>
                            {quote.email && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <a href={`mailto:${quote.email}`} className="font-medium text-primary hover:underline">
                                                {quote.email}
                                            </a>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {quote.location && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">{quote.location}</p>
                                            <p className="text-sm text-muted-foreground">Delivery Location</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium capitalize">
                                        {quote.payment_preference.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Payment Preference</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quote Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quote Status</CardTitle>
                            <CardDescription>Update the current status of this quote</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Select value={status || ''} onValueChange={(value) => setStatus(value as QuoteStatus)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {QUOTE_STATUSES.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={currentStatus?.color}>
                                    {currentStatus?.label}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Quote Items & Financials */}
                <div className="md:col-span-2 space-y-6">
                    {/* Quote Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quote Items</CardTitle>
                            <CardDescription>
                                {quote.quote_items?.length || 0} item{(quote.quote_items?.length || 0) !== 1 ? 's' : ''} in this quote
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {quote.quote_items && quote.quote_items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Description</TableHead>
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
                                            {quote.quote_items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.description || item.products?.name || 'Item'}
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
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No items in this quote
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing && (
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
                            )}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>KES {subtotal.toLocaleString()}</span>
                                </div>
                                {(isEditing || deliveryFee > 0) && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery:</span>
                                        <span>KES {deliveryFee.toLocaleString()}</span>
                                    </div>
                                )}
                                {(isEditing || vatAmount > 0) && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">VAT:</span>
                                        <span>KES {vatAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                {(isEditing || discountAmount > 0) && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span className="text-red-600">-KES {discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Grand Total:</span>
                                    <span>KES {quote.grand_total?.toLocaleString() || '0'}</span>
                                </div>
                                {quote.payment_preference === 'lipa_pole_pole' && (
                                    <>
                                        {(isEditing || quote.deposit_amount) && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Deposit:</span>
                                                <span>KES {depositAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {(isEditing || quote.balance_amount) && (
                                            <div className="flex justify-between text-sm font-semibold">
                                                <span>Balance:</span>
                                                <span>KES {quote.balance_amount?.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes & Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes & Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Payment Instructions</Label>
                                {isEditing ? (
                                    <TiptapEditor
                                        content={paymentInstructions}
                                        onChange={setPaymentInstructions}
                                        placeholder="e.g., Pay deposit via M-Pesa Paybill: 123456, Account: Q-2026-0001"
                                    />
                                ) : (
                                    <div
                                        className="prose prose-sm max-w-none p-4 border rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: quote.payment_instructions || '<p class="text-muted-foreground">No payment instructions provided</p>' }}
                                    />
                                )}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Customer Notes (visible on quote)</Label>
                                {isEditing ? (
                                    <TiptapEditor
                                        content={customerNotes}
                                        onChange={setCustomerNotes}
                                        placeholder="e.g., Delivery expected within 5 days of deposit payment..."
                                    />
                                ) : (
                                    <div
                                        className="prose prose-sm max-w-none p-4 border rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: quote.customer_notes || '<p class="text-muted-foreground">No customer notes provided</p>' }}
                                    />
                                )}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Internal Notes (admin only)</Label>
                                {isEditing ? (
                                    <TiptapEditor
                                        content={internalNotes}
                                        onChange={setInternalNotes}
                                        placeholder="e.g., Client negotiated 5% discount, follow up next week..."
                                    />
                                ) : (
                                    <div
                                        className="prose prose-sm max-w-none p-4 border rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: quote.internal_notes || '<p class="text-muted-foreground">No internal notes</p>' }}
                                    />
                                )}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Terms & Conditions</Label>
                                {isEditing ? (
                                    <TiptapEditor
                                        content={termsAndConditions}
                                        onChange={setTermsAndConditions}
                                        placeholder="Standard terms and conditions for this quote..."
                                    />
                                ) : (
                                    <div
                                        className="prose prose-sm max-w-none p-4 border rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: quote.terms_and_conditions || '<p class="text-muted-foreground">No terms and conditions</p>' }}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}