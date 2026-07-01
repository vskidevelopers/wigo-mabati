'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    CheckCircle2,
    ShoppingCart,
    MessageCircle,
    Loader2,
    Package,
    ChevronLeft,
    ChevronRight,
    Ruler,
    Hash,
    Info
} from 'lucide-react'
import { toast } from 'sonner'

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
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
}

const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const supabase = createClient()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Configuration state
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [selectedGauge, setSelectedGauge] = useState<number | null>(null)
    const [selectedFinish, setSelectedFinish] = useState<string>('')
    const [lengthMeters, setLengthMeters] = useState<number>(3)
    const [quantity, setQuantity] = useState<number>(1)

    // Parse images from product
    const images = product?.image_url ? (() => {
        try {
            const parsed = JSON.parse(product.image_url)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    })() : []

    // Fetch product on mount
    useEffect(() => {
        async function fetchProduct() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('slug', slug)
                    .eq('is_active', true)
                    .single()

                if (error) throw error
                if (!data) throw new Error('Product not found')

                setProduct(data as Product)

                // Set defaults
                const colors = data.available_colors || []
                const gauges = data.available_gauges || []
                const finishes = data.available_finishes || []

                if (colors.length > 0) setSelectedColor(colors[0])
                if (gauges.length > 0) setSelectedGauge(gauges[0])
                if (finishes.length > 0) setSelectedFinish(finishes[0])
            } catch (error) {
                console.error('Error fetching product:', error)
                toast.error('Product not found')
                router.push('/products')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug, supabase, router])

    // Calculate total price
    const calculateTotal = () => {
        if (!product || !selectedGauge || !product.price_per_gauge) return 0
        const pricePerMeter = product.price_per_gauge[selectedGauge.toString()] || 0
        return pricePerMeter * lengthMeters * quantity
    }

    // Get price per meter for selected gauge
    const getPricePerMeter = () => {
        if (!product || !selectedGauge || !product.price_per_gauge) return 0
        return product.price_per_gauge[selectedGauge.toString()] || 0
    }

    // Handle add to order
    const handleAddToOrder = () => {
        if (!selectedColor || !selectedGauge || !selectedFinish) {
            toast.error('Please select all options')
            return
        }

        if (lengthMeters <= 0) {
            toast.error('Please enter a valid length')
            return
        }

        if (quantity <= 0) {
            toast.error('Please enter a valid quantity')
            return
        }

        // TODO: Implement Zustand store for order management
        // For now, just show success message
        toast.success('Added to order! Go to checkout to complete.')

        // Store in localStorage for now
        const orderItem = {
            productId: product?.id,
            productName: product?.name,
            productSlug: product?.slug,
            color: selectedColor,
            gauge: selectedGauge,
            finish: selectedFinish,
            length: lengthMeters,
            quantity,
            unitPrice: getPricePerMeter(),
            subtotal: calculateTotal(),
        }

        const existingOrder = JSON.parse(localStorage.getItem('wigo_order') || '[]')
        existingOrder.push(orderItem)
        localStorage.setItem('wigo_order', JSON.stringify(existingOrder))

        // Redirect to checkout after a short delay
        setTimeout(() => {
            router.push('/checkout')
        }, 1500)
    }

    // Handle order via WhatsApp
    const handleOrderViaWhatsApp = () => {
        if (!product || !selectedColor || !selectedGauge || !selectedFinish) {
            toast.error('Please select all options')
            return
        }

        const message = `Hi, I'm interested in ordering:\n\n` +
            `Product: ${product.name}\n` +
            `Color: ${selectedColor}\n` +
            `Gauge: ${selectedGauge}\n` +
            `Finish: ${selectedFinish}\n` +
            `Length: ${lengthMeters}m\n` +
            `Quantity: ${quantity}\n` +
            `Estimated Total: KES ${calculateTotal().toLocaleString()}`

        const whatsappUrl = `https://wa.me/254748933988?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    // Image navigation
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/products">
                        <Button>Back to Products</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="border-b bg-background">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-foreground transition-colors">
                            Products
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column - Images */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                            {images.length > 0 ? (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImageIndex}
                                            src={images[currentImageIndex]}
                                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>

                                    {/* Navigation arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                                                onClick={prevImage}
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                                                onClick={nextImage}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Image counter */}
                                    <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-32 w-32 text-primary/20" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column - Product Info & Configurator */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        className="space-y-6"
                    >
                        {/* Product Header */}
                        <div>
                            <Badge variant="secondary" className="mb-3">
                                {product.category}
                            </Badge>
                            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
                            {product.description && (
                                <div
                                    className="text-muted-foreground prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            )}
                        </div>

                        <Separator />

                        {/* Step 1: Select Color */}
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    1
                                </div>
                                Select Color
                            </Label>
                            <div className="grid grid-cols-5 gap-3 mt-3">
                                {(product.available_colors || []).map((colorName) => (
                                    <motion.button
                                        key={colorName}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative group`}
                                        onClick={() => setSelectedColor(colorName)}
                                    >
                                        <div
                                            className={`aspect-square rounded-xl border-2 transition-all ${selectedColor === colorName
                                                    ? 'border-primary ring-2 ring-primary/20 scale-110'
                                                    : 'border-muted hover:border-primary/50'
                                                }`}
                                            style={{ backgroundColor: COLOR_MAP[colorName] || '#ccc' }}
                                        />
                                        <p className="text-xs text-center mt-2 font-medium">
                                            {colorName.split(' ')[0]}
                                        </p>
                                        {selectedColor === colorName && (
                                            <CheckCircle2 className="absolute -top-1 -right-1 h-5 w-5 text-primary bg-background rounded-full" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Select Gauge */}
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    2
                                </div>
                                Select Gauge
                            </Label>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                {(product.available_gauges || []).map((gauge) => (
                                    <motion.button
                                        key={gauge}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${selectedGauge === gauge
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                        onClick={() => setSelectedGauge(gauge)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold">Gauge {gauge}</span>
                                            {selectedGauge === gauge && (
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            KES {product.price_per_gauge?.[gauge.toString()]?.toLocaleString() || '0'}/{product.base_unit}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Select Finish */}
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    3
                                </div>
                                Select Finish
                            </Label>
                            <div className="grid grid-cols-3 gap-3 mt-3">
                                {(product.available_finishes || []).map((finish) => (
                                    <motion.button
                                        key={finish}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 transition-all capitalize ${selectedFinish === finish
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                        onClick={() => setSelectedFinish(finish)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{finish}</span>
                                            {selectedFinish === finish && (
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Step 4: Dimensions */}
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    4
                                </div>
                                Specify Dimensions
                            </Label>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <Label htmlFor="length" className="text-sm font-medium mb-2 block">
                                        <Ruler className="inline h-4 w-4 mr-1" />
                                        Length ({product.base_unit === 'meter' ? 'meters' : 'pieces'})
                                    </Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        step="0.1"
                                        min="0.5"
                                        value={lengthMeters}
                                        onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                                        <Hash className="inline h-4 w-4 mr-1" />
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Price Summary & Actions */}
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Price per {product.base_unit}:</span>
                                        <span className="font-semibold">KES {getPricePerMeter().toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Length:</span>
                                        <span className="font-semibold">{lengthMeters}m</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Quantity:</span>
                                        <span className="font-semibold">{quantity}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold">Estimated Total:</span>
                                        <motion.span
                                            key={calculateTotal()}
                                            initial={{ scale: 1.1, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-3xl font-bold text-primary"
                                        >
                                            KES {calculateTotal().toLocaleString()}
                                        </motion.span>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                                        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                        <span>Excludes delivery charges. Final price confirmed by admin.</span>
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <Button
                                            onClick={handleAddToOrder}
                                            className="flex-1 text-base py-6"
                                            size="lg"
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Order
                                        </Button>
                                        <Button
                                            onClick={handleOrderViaWhatsApp}
                                            variant="outline"
                                            className="flex-1 text-base py-6"
                                            size="lg"
                                        >
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            Order via WhatsApp
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}