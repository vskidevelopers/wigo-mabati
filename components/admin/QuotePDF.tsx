import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf' },
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ]
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#2A2420',
        fontSize: 10
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottom: 2,
        borderColor: '#C4A035',
        paddingBottom: 20
    },
    brandName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E2560',
        letterSpacing: 1
    },
    brandTagline: {
        fontSize: 10,
        color: '#6B6560',
        marginTop: 4
    },
    brandContact: {
        fontSize: 9,
        color: '#6B6560',
        marginTop: 6,
        lineHeight: 1.5
    },
    quoteTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E2560',
        textAlign: 'right'
    },
    quoteNumber: {
        fontSize: 11,
        color: '#6B6560',
        textAlign: 'right',
        marginTop: 4
    },
    quoteDate: {
        fontSize: 10,
        color: '#6B6560',
        textAlign: 'right',
        marginTop: 2
    },

    // Sections
    section: { marginBottom: 24 },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1E2560',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottom: 1,
        borderColor: '#D9D2C4',
        paddingBottom: 4
    },

    // Customer info
    customerName: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4
    },
    customerDetail: {
        fontSize: 10,
        color: '#6B6560',
        marginBottom: 2
    },

    // Table
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1E2560',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 4
    },
    tableHeaderText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottom: 1,
        borderColor: '#E5E0D5'
    },
    tableRowAlt: {
        backgroundColor: '#FAF7F0'
    },

    // Column widths (total = 100%)
    colDesc: { width: '35%' },
    colSpecs: { width: '25%' },
    colQty: { width: '10%', textAlign: 'center' as const },
    colUnit: { width: '15%', textAlign: 'right' as const },
    colTotal: { width: '15%', textAlign: 'right' as const },

    cellText: {
        fontSize: 9,
        color: '#2A2420'
    },
    cellBold: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#2A2420'
    },
    cellMuted: {
        fontSize: 8,
        color: '#6B6560',
        marginTop: 2
    },

    // Totals
    totalsSection: {
        marginTop: 20,
        marginLeft: '55%'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        fontSize: 10
    },
    totalLabel: {
        color: '#6B6560'
    },
    totalValue: {
        fontWeight: 'bold',
        color: '#2A2420'
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginTop: 8,
        borderTop: 2,
        borderColor: '#1E2560'
    },
    grandTotalLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E2560'
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#C4A035'
    },

    // Payment box
    paymentBox: {
        backgroundColor: '#F2EDE4',
        padding: 15,
        borderRadius: 4,
        marginTop: 20,
        border: 1,
        borderColor: '#D9D2C4'
    },
    paymentTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1E2560',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        fontSize: 10
    },
    paymentLabel: {
        color: '#6B6560'
    },
    paymentValue: {
        fontWeight: 'bold',
        color: '#1E2560'
    },
    paymentHighlight: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E2560',
        marginTop: 8,
        textAlign: 'center' as const
    },

    // Notes
    notesBox: {
        backgroundColor: '#FAF7F0',
        padding: 12,
        borderRadius: 4,
        marginTop: 16,
        border: 1,
        borderColor: '#E5E0D5'
    },
    notesTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1E2560',
        marginBottom: 6
    },
    notesText: {
        fontSize: 9,
        color: '#2A2420',
        lineHeight: 1.5
    },

    // Terms
    termsSection: {
        marginTop: 24,
        paddingTop: 16,
        borderTop: 1,
        borderColor: '#D9D2C4'
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1E2560',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    termsText: {
        fontSize: 8,
        color: '#6B6560',
        lineHeight: 1.5
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#6B6560',
        borderTop: 1,
        borderColor: '#D9D2C4',
        paddingTop: 12
    },
    footerBold: {
        fontWeight: 'bold',
        color: '#1E2560'
    }
})

interface QuoteItemData {
    description: string
    selected_color: string | null
    selected_gauge: number | null
    selected_finish: string | null
    length_meters: number | null
    quantity: number
    unit_price: number
    subtotal: number
}

interface QuoteData {
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
    items: QuoteItemData[]
}

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export const QuotePDF = ({ data }: { data: QuoteData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandName}>WIGO MABATI</Text>
                    <Text style={styles.brandTagline}>Durable Roofs, Unmatched Quality</Text>
                    <Text style={styles.brandContact}>
                        Opp. Adventist University, Rongai, Kenya{'\n'}
                        +254 748 933 988
                    </Text>
                </View>
                <View>
                    <Text style={styles.quoteTitle}>QUOTE</Text>
                    <Text style={styles.quoteNumber}>{data.quote_number}</Text>
                    <Text style={styles.quoteDate}>Issued: {formatDate(data.date_issued)}</Text>
                    <Text style={styles.quoteDate}>Valid Until: {formatDate(data.valid_until)}</Text>
                </View>
            </View>

            {/* Customer Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prepared For</Text>
                <Text style={styles.customerName}>{data.customer_name}</Text>
                <Text style={styles.customerDetail}>{data.phone}</Text>
                {data.email && <Text style={styles.customerDetail}>✉ {data.email}</Text>}
                {data.location && <Text style={styles.customerDetail}>{data.location}</Text>}
            </View>

            {/* Items Table */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quotation Items</Text>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
                    <Text style={[styles.tableHeaderText, styles.colSpecs]}>Specifications</Text>
                    <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
                    <Text style={[styles.tableHeaderText, styles.colUnit]}>Unit Price</Text>
                    <Text style={[styles.tableHeaderText, styles.colTotal]}>Subtotal</Text>
                </View>

                {/* Table Rows */}
                {data.items.map((item, idx) => {
                    const specs = [
                        item.selected_color,
                        item.selected_gauge ? `Gauge ${item.selected_gauge}` : null,
                        item.selected_finish ? item.selected_finish.charAt(0).toUpperCase() + item.selected_finish.slice(1) : null
                    ].filter(Boolean).join(' • ')

                    return (
                        <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                            <View style={styles.colDesc}>
                                <Text style={styles.cellBold}>{item.description || 'Product'}</Text>
                                {item.length_meters && (
                                    <Text style={styles.cellMuted}>Length: {item.length_meters}m</Text>
                                )}
                            </View>
                            <View style={styles.colSpecs}>
                                <Text style={styles.cellText}>{specs || '—'}</Text>
                            </View>
                            <View style={styles.colQty}>
                                <Text style={styles.cellText}>{item.quantity}</Text>
                            </View>
                            <View style={styles.colUnit}>
                                <Text style={styles.cellText}>KES {item.unit_price.toLocaleString()}</Text>
                            </View>
                            <View style={styles.colTotal}>
                                <Text style={styles.cellBold}>KES {item.subtotal.toLocaleString()}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>KES {(data.subtotal || 0).toLocaleString()}</Text>
                </View>
                {(data.delivery_fee || 0) > 0 && (
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Delivery Fee:</Text>
                        <Text style={styles.totalValue}>KES {data.delivery_fee?.toLocaleString()}</Text>
                    </View>
                )}
                {(data.vat_amount || 0) > 0 && (
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>VAT:</Text>
                        <Text style={styles.totalValue}>KES {data.vat_amount?.toLocaleString()}</Text>
                    </View>
                )}
                {(data.discount_amount || 0) > 0 && (
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Discount:</Text>
                        <Text style={[styles.totalValue, { color: '#C04000' }]}>
                            - KES {data.discount_amount?.toLocaleString()}
                        </Text>
                    </View>
                )}
                <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                    <Text style={styles.grandTotalValue}>KES {(data.grand_total || 0).toLocaleString()}</Text>
                </View>
            </View>

            {/* Payment Terms */}
            <View style={styles.paymentBox}>
                <Text style={styles.paymentTitle}>
                    {data.payment_preference === 'lipa_pole_pole' ? 'Lipa Pole Pole (Installments)' : 'Payment Terms'}
                </Text>

                {data.payment_preference === 'lipa_pole_pole' ? (
                    <>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Deposit Required:</Text>
                            <Text style={styles.paymentValue}>KES {(data.deposit_amount || 0).toLocaleString()}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Balance:</Text>
                            <Text style={styles.paymentValue}>KES {(data.balance_amount || 0).toLocaleString()}</Text>
                        </View>
                        <Text style={[styles.paymentHighlight, { marginTop: 12 }]}>
                            Start with KES {(data.deposit_amount || 0).toLocaleString()} to secure your order
                        </Text>
                    </>
                ) : (
                    <Text style={[styles.paymentHighlight, { marginTop: 4 }]}>
                        Full Payment: KES {(data.grand_total || 0).toLocaleString()}
                    </Text>
                )}

                {data.payment_instructions && (
                    <View style={{ marginTop: 12, paddingTop: 12, borderTop: 1, borderColor: '#D9D2C4' }}>
                        <Text style={[styles.paymentLabel, { marginBottom: 4 }]}>Payment Instructions:</Text>
                        <Text style={styles.notesText}>{data.payment_instructions}</Text>
                    </View>
                )}
            </View>

            {/* Customer Notes */}
            {data.customer_notes && (
                <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}> Notes</Text>
                    <Text style={styles.notesText}>{data.customer_notes}</Text>
                </View>
            )}

            {/* Terms & Conditions */}
            {data.terms_and_conditions && (
                <View style={styles.termsSection}>
                    <Text style={styles.termsTitle}>Terms & Conditions</Text>
                    <Text style={styles.termsText}>{data.terms_and_conditions}</Text>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text>
                    Thank you for choosing <Text style={styles.footerBold}>Wigo Mabati</Text>.
                    We look forward to roofing your dreams.
                </Text>
                <Text style={{ marginTop: 4 }}>
                    For inquiries: +254 748 933 988 | WhatsApp: wa.me/254748933988
                </Text>
                <Text style={{ marginTop: 4, fontSize: 7 }}>
                    This quote is valid until {formatDate(data.valid_until)}. Prices are subject to change after validity period.
                </Text>
            </View>
        </Page>
    </Document>
)