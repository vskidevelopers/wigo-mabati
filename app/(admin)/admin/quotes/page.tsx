import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, FileText, Plus } from 'lucide-react'
import { format } from 'date-fns'

const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
        case 'draft':
            return <Badge variant="secondary">Draft</Badge>
        case 'sent':
            return <Badge className="bg-blue-500 hover:bg-blue-600">Sent</Badge>
        case 'accepted':
            return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>
        case 'expired':
            return <Badge variant="outline">Expired</Badge>
        default:
            return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }
}

export default async function AdminQuotesPage() {
    const supabase = await createClient()

    const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching quotes:', error)
    }

    const draftCount = quotes?.filter(q => q.status === 'draft').length || 0
    const sentCount = quotes?.filter(q => q.status === 'sent').length || 0

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Quotes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track all customer quotes
                    </p>
                </div>
                <div className="flex gap-2">
                    {draftCount > 0 && (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {draftCount} Draft{draftCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                    {sentCount > 0 && (
                        <Badge className="bg-blue-500 text-sm px-3 py-1">
                            {sentCount} Sent
                        </Badge>
                    )}
                    <Link href="/admin/quotes/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Quote
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Quotes</CardTitle>
                    <CardDescription>
                        {quotes?.length || 0} total quote{quotes?.length !== 1 ? 's' : ''} generated
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {quotes && quotes.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-30">Quote #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Grand Total</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotes.map((quote) => (
                                        <TableRow key={quote.id} className="group">
                                            <TableCell className="font-medium">
                                                {quote.quote_number}
                                            </TableCell>
                                            <TableCell>{quote.customer_name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`tel:${quote.phone}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {quote.phone}
                                                </a>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                KES {quote.grand_total?.toLocaleString() || '0'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {quote.valid_until
                                                    ? format(new Date(quote.valid_until as string), 'MMM dd, yyyy')
                                                    : 'Not set'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(quote?.status)}
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {quote.created_at
                                                    ? format(new Date(quote.created_at as string), 'MMM dd, yyyy')
                                                    : 'N/A'
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                                        <Link href={`/admin/quotes/${quote.id}`}>
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
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                Quotes can be generated from orders or created standalone.
                            </p>
                            <Link href="/admin/quotes/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Quote
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}