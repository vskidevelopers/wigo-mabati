'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
    Search,
    Filter,
    X,
    ArrowRight,
    Package,
    Loader2,
    SlidersHorizontal
} from 'lucide-react'

// Color mapping for display
const COLOR_MAP: Record<string, string> = {
    'Jungle Green': '#2D5016',
    'Charcoal Grey': '#36454F',
    'Tile Red': '#C04000',
    'Brick Red': '#CB4154',
    'Maasai Red': '#A52A2A',
    'Navy Blue': '#000080',
    'Burgundy': '#800020',
    'Ivory White': '#FFFFF0',
    'Bronze': '#CD7F32',
    'Slate Grey': '#708090',
}

const CATEGORIES = [
    { value: 'wigo', label: 'Wigo (In-House)' },
    { value: 'decra', label: 'Decra' },
    { value: 'accessories', label: 'Accessories' },
]

const GAUGES = [26, 28, 30, 32]
const FINISHES = ['matte', 'gloss', 'aluzinc']

interface Product {
    id: string
    name: string
    slug: string
    category: string
    description: string | null
    base_unit: string
    image_url: string | null
    available_colors: string[] | null
    available_gauges: number[] | null
    available_finishes: string[] | null
    price_per_gauge: Record<string, number> | null
}

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const }
    }
} as const

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
} as const

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 }
    }
} as const

export default function ProductsPage() {
    const supabase = createClient()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [selectedGauges, setSelectedGauges] = useState<number[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedFinishes, setSelectedFinishes] = useState<string[]>([])
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (data) {
                    setProducts(data as Product[])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [supabase])

    // Filter products based on selections
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                if (!product.name.toLowerCase().includes(query) &&
                    !product.description?.toLowerCase().includes(query)) {
                    return false
                }
            }

            // Category filter
            if (selectedCategory && product.category !== selectedCategory) {
                return false
            }

            // Gauge filter (product must have at least one selected gauge)
            if (selectedGauges.length > 0) {
                const productGauges = product.available_gauges || []
                if (!selectedGauges.some(g => productGauges.includes(g))) {
                    return false
                }
            }

            // Color filter (product must have at least one selected color)
            if (selectedColors.length > 0) {
                const productColors = product.available_colors || []
                if (!selectedColors.some(c => productColors.includes(c))) {
                    return false
                }
            }

            // Finish filter (product must have at least one selected finish)
            if (selectedFinishes.length > 0) {
                const productFinishes = product.available_finishes || []
                if (!selectedFinishes.some(f => productFinishes.includes(f))) {
                    return false
                }
            }

            return true
        })
    }, [products, searchQuery, selectedCategory, selectedGauges, selectedColors, selectedFinishes])

    // Get price range for a product
    const getPriceRange = (product: Product) => {
        if (!product.price_per_gauge) return null
        const prices = Object.values(product.price_per_gauge).filter(p => p > 0)
        if (prices.length === 0) return null
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        return { min, max }
    }

    // Parse image URLs from JSON string
    const getProductImages = (product: Product): string[] => {
        if (!product.image_url) return []
        try {
            const parsed = JSON.parse(product.image_url)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }

    // Toggle helpers
    const toggleGauge = (gauge: number) => {
        setSelectedGauges(prev =>
            prev.includes(gauge) ? prev.filter(g => g !== gauge) : [...prev, gauge]
        )
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        )
    }

    const toggleFinish = (finish: string) => {
        setSelectedFinishes(prev =>
            prev.includes(finish) ? prev.filter(f => f !== finish) : [...prev, finish]
        )
    }

    const clearAllFilters = () => {
        setSearchQuery('')
        setSelectedCategory('')
        setSelectedGauges([])
        setSelectedColors([])
        setSelectedFinishes([])
    }

    const activeFilterCount = [
        selectedCategory,
        selectedGauges.length > 0,
        selectedColors.length > 0,
        selectedFinishes.length > 0
    ].filter(Boolean).length

    // Filter UI as a regular function (not a component)
    const renderFilterPanel = () => (
        <div className="space-y-6">
            {/* Category */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Category</Label>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === ''
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                            }`}
                    >
                        All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize ${selectedCategory === cat.value
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Gauge */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Gauge</Label>
                <div className="grid grid-cols-2 gap-2">
                    {GAUGES.map(gauge => (
                        <button
                            key={gauge}
                            onClick={() => toggleGauge(gauge)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedGauges.includes(gauge)
                                ? 'bg-primary text-primary-foreground'
                                : 'border hover:border-primary/50'
                                }`}
                        >
                            Gauge {gauge}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Finish */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Finish</Label>
                <div className="space-y-2">
                    {FINISHES.map(finish => (
                        <button
                            key={finish}
                            onClick={() => toggleFinish(finish)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${selectedFinishes.includes(finish)
                                ? 'bg-primary text-primary-foreground'
                                : 'border hover:border-primary/50'
                                }`}
                        >
                            {finish}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Color */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Color</Label>
                <div className="grid grid-cols-5 gap-2">
                    {Object.entries(COLOR_MAP).map(([name, hex]) => (
                        <button
                            key={name}
                            onClick={() => toggleColor(name)}
                            className="group relative"
                            title={name}
                        >
                            <div
                                className={`aspect-square rounded-lg border-2 transition-all ${selectedColors.includes(name)
                                    ? 'border-primary ring-2 ring-primary/20 scale-110'
                                    : 'border-muted hover:border-primary/50'
                                    }`}
                                style={{ backgroundColor: hex }}
                            />
                            <p className="text-[10px] text-center mt-1 truncate">
                                {name.split(' ')[0]}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
                <>
                    <Separator />
                    <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="w-full"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear All Filters
                    </Button>
                </>
            )}
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-3xl"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                                <Package className="mr-2 h-3 w-3" />
                                {products.length} Products Available
                            </Badge>
                        </motion.div>
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-4"
                            variants={fadeInUp}
                        >
                            Our Products
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground"
                            variants={fadeInUp}
                        >
                            Premium roofing solutions for every budget and style. Find your perfect match.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <SlidersHorizontal className="h-5 w-5" />
                                        Filters
                                    </h2>
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary">{activeFilterCount}</Badge>
                                    )}
                                </div>
                                {renderFilterPanel()}
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Search & Mobile Filter */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Mobile Filter Button */}
                                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                            {activeFilterCount > 0 && (
                                                <Badge className="ml-2 bg-primary text-primary-foreground">
                                                    {activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            {renderFilterPanel()}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Results Count */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of {products.length} products
                                </p>
                                {activeFilterCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>

                            {/* Products Grid */}
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={staggerContainer}
                                    key={JSON.stringify({
                                        searchQuery,
                                        selectedCategory,
                                        selectedGauges,
                                        selectedColors,
                                        selectedFinishes
                                    })}
                                >
                                    <AnimatePresence>
                                        {filteredProducts.map((product) => {
                                            const priceRange = getPriceRange(product)
                                            const colors = product.available_colors || []
                                            const displayColors = colors.slice(0, 4)
                                            const remainingColors = colors.length - 4
                                            const images = getProductImages(product)
                                            const mainImage = images[0]

                                            return (
                                                <motion.div
                                                    key={product.id}
                                                    variants={scaleIn}
                                                    layout
                                                >
                                                    <Link href={`/products/${product.slug}`}>
                                                        <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/20">
                                                            {/* Image Area */}
                                                            <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-muted relative overflow-hidden">
                                                                {mainImage ? (
                                                                    <img
                                                                        src={mainImage}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    />
                                                                ) : (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <Package className="h-20 w-20 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                                                                    </div>
                                                                )}
                                                                <div className="absolute top-3 left-3">
                                                                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                                                        {product.category}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <CardContent className="pt-4">
                                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                                    {product.name}
                                                                </h3>

                                                                {/* Color Swatches */}
                                                                {colors.length > 0 && (
                                                                    <div className="flex items-center gap-1 mb-3">
                                                                        {displayColors.map((colorName) => (
                                                                            <div
                                                                                key={colorName}
                                                                                className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                                                                                style={{ backgroundColor: COLOR_MAP[colorName] || '#ccc' }}
                                                                                title={colorName}
                                                                            />
                                                                        ))}
                                                                        {remainingColors > 0 && (
                                                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                                                                                +{remainingColors}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Gauges */}
                                                                {product.available_gauges && product.available_gauges.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                                        {product.available_gauges.map(gauge => (
                                                                            <Badge key={gauge} variant="outline" className="text-xs">
                                                                                G{gauge}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Price */}
                                                                {priceRange && (
                                                                    <div className="mb-4">
                                                                        <p className="text-xs text-muted-foreground mb-1">
                                                                            Price per {product.base_unit}
                                                                        </p>
                                                                        <p className="text-lg font-bold">
                                                                            {priceRange.min === priceRange.max ? (
                                                                                <>KES {priceRange.min.toLocaleString()}</>
                                                                            ) : (
                                                                                <>KES {priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()}</>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* CTA */}
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                                >
                                                                    View Details
                                                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20"
                                >
                                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your filters or search terms
                                    </p>
                                    <Button onClick={clearAllFilters} variant="outline">
                                        Clear All Filters
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}