/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Package } from 'lucide-react'

export default async function AdminProductsPage() {
    const supabase = await createClient()

    // Fetch all products (no more product_variants join)
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
    }

    // Calculate variant count from array fields
    const getVariantCount = (product: any) => {
        const colors = product.available_colors?.length || 0
        const gauges = product.available_gauges?.length || 0
        const finishes = product.available_finishes?.length || 0
        return colors * gauges * finishes
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground mt-1">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Product
                    </Button>
                </Link>
            </div>

            {products && products.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <CardDescription className="mt-1">
                                            <Badge variant="outline" className="mr-2">
                                                {product.category}
                                            </Badge>
                                            {product.base_unit}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-sm text-muted-foreground line-clamp-2 mb-4 prose prose-sm"
                                    dangerouslySetInnerHTML={{ __html: product.description || '<p class="text-muted-foreground">No description</p>' }}
                                />
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        <Package className="inline h-4 w-4 mr-1" />
                                        {getVariantCount(product)} combinations
                                    </div>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                        <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
                        <Link href="/admin/products/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Product
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}