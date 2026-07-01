/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, Loader2, CheckCircle2, XCircle, Image as ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import TiptapEditor from '@/components/ui/tiptap-editor'

// Predefined roofing colors with hex codes
const ROOFING_COLORS = [
    { name: 'Jungle Green', hex: '#2D5016' },
    { name: 'Charcoal Grey', hex: '#36454F' },
    { name: 'Tile Red', hex: '#C04000' },
    { name: 'Brick Red', hex: '#CB4154' },
    { name: 'Maasai Red', hex: '#A52A2A' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Ivory White', hex: '#FFFFF0' },
    { name: 'Bronze', hex: '#CD7F32' },
    { name: 'Slate Grey', hex: '#708090' },
]

const AVAILABLE_GAUGES = [26, 28, 30, 32]
const AVAILABLE_FINISHES = ['matte', 'gloss', 'aluzinc']

interface ImageUpload {
    id: string
    file: File
    url?: string
    status: 'pending' | 'uploading' | 'success' | 'error'
    error?: string
}

export default function NewProductPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // Product form state
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [baseUnit, setBaseUnit] = useState('meter')
    const [isActive, setIsActive] = useState(true)

    // Images state
    const [images, setImages] = useState<ImageUpload[]>([])

    // Options state
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedGauges, setSelectedGauges] = useState<number[]>([])
    const [selectedFinishes, setSelectedFinishes] = useState<string[]>([])
    const [pricePerGauge, setPricePerGauge] = useState<Record<number, number>>({})

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    const handleNameChange = (value: string) => {
        setName(value)
        setSlug(generateSlug(value))
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (files.length === 0) return

        if (images.length + files.length > 5) {
            toast.error('Maximum 5 images allowed')
            return
        }

        const newImages: ImageUpload[] = files.map(file => ({
            id: crypto.randomUUID(),
            file,
            status: 'pending'
        }))

        setImages(prev => [...prev, ...newImages])

        for (const img of newImages) {
            await uploadImage(img)
        }

        e.target.value = ''
    }

    const uploadImage = async (image: ImageUpload) => {
        try {
            setImages(prev => prev.map(img =>
                img.id === image.id ? { ...img, status: 'uploading' } : img
            ))

            const fileExt = image.file.name.split('.').pop()
            const fileName = `${slug || 'product'}-${image.id}.${fileExt}`
            const filePath = `products/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('wigo-mabati')
                .upload(filePath, image.file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('wigo-mabati')
                .getPublicUrl(filePath)

            setImages(prev => prev.map(img =>
                img.id === image.id
                    ? { ...img, status: 'success', url: publicUrl }
                    : img
            ))

            toast.success(`${image.file.name} uploaded successfully`)
        } catch (error: any) {
            console.error('Upload error:', error)

            setImages(prev => prev.map(img =>
                img.id === image.id
                    ? { ...img, status: 'error', error: error.message }
                    : img
            ))

            toast.error(`Failed to upload ${image.file.name}`)
        }
    }

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id))
    }

    const handleColorToggle = (colorName: string) => {
        setSelectedColors(prev =>
            prev.includes(colorName)
                ? prev.filter(c => c !== colorName)
                : [...prev, colorName]
        )
    }

    const handleGaugeToggle = (gauge: number) => {
        setSelectedGauges(prev => {
            const newGauges = prev.includes(gauge)
                ? prev.filter(g => g !== gauge)
                : [...prev, gauge]

            if (!pricePerGauge[gauge]) {
                setPricePerGauge(prev => ({ ...prev, [gauge]: 0 }))
            }

            return newGauges
        })
    }

    const handleFinishToggle = (finish: string) => {
        setSelectedFinishes(prev =>
            prev.includes(finish)
                ? prev.filter(f => f !== finish)
                : [...prev, finish]
        )
    }

    const handlePriceChange = (gauge: number, value: string) => {
        setPricePerGauge(prev => ({
            ...prev,
            [gauge]: parseFloat(value) || 0
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const pendingImages = images.filter(img => img.status !== 'success')
        if (pendingImages.length > 0) {
            toast.error('Please wait for all images to finish uploading')
            return
        }

        if (selectedColors.length === 0) {
            toast.error('Please select at least one color')
            return
        }

        if (selectedGauges.length === 0) {
            toast.error('Please select at least one gauge')
            return
        }

        if (selectedFinishes.length === 0) {
            toast.error('Please select at least one finish')
            return
        }

        setLoading(true)

        try {
            const imageUrls = images
                .filter(img => img.url)
                .map(img => img.url as string)

            const { error: productError } = await supabase
                .from('products')
                .insert({
                    name,
                    slug,
                    category,
                    description,
                    base_unit: baseUnit,
                    image_url: JSON.stringify(imageUrls),
                    is_active: isActive,
                    available_colors: selectedColors,
                    available_gauges: selectedGauges,
                    available_finishes: selectedFinishes,
                    price_per_gauge: pricePerGauge,
                })

            if (productError) throw productError

            toast.success('Product created successfully')
            router.push('/admin/products')
        } catch (error: any) {
            console.error('Error creating product:', error)
            toast.error(error.message || 'Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Link
                href="/admin/products"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>

            <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>Basic information about the product</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Wigo Corrugate"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wigo">Wigo (In-House)</SelectItem>
                                        <SelectItem value="decra">Decra</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="baseUnit">Base Unit *</Label>
                                <Select value={baseUnit} onValueChange={setBaseUnit} required>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meter">Per Meter</SelectItem>
                                        <SelectItem value="piece">Per Piece</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <TiptapEditor
                                content={description}
                                onChange={setDescription}
                                placeholder="Product description..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload up to 5 images (max 5MB each)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label
                            htmlFor="image-upload"
                            className={`
                                block border-2 border-dashed rounded-lg p-6 cursor-pointer
                                transition-all duration-200
                                ${images.length >= 5
                                    ? 'border-muted-foreground/10 bg-muted/30 cursor-not-allowed opacity-50'
                                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <Upload className={`h-8 w-8 ${images.length >= 5 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
                                <div className="text-center">
                                    <p className={`text-sm font-medium ${images.length >= 5 ? 'text-muted-foreground/50' : 'text-foreground hover:text-primary'}`}>
                                        {images.length >= 5 ? 'Maximum images reached' : 'Click anywhere to upload images'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, WEBP up to 5MB each
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {images.length}/5 images uploaded
                                </p>
                            </div>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={images.length >= 5}
                            />
                        </label>

                        {images.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {images.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                            {image.status === 'success' && image.url ? (
                                                <img
                                                    src={image.url}
                                                    alt={image.file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                    {image.status === 'uploading' && (
                                                        <>
                                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                            <p className="text-xs text-muted-foreground">Uploading...</p>
                                                        </>
                                                    )}
                                                    {image.status === 'pending' && (
                                                        <p className="text-xs text-muted-foreground">Pending...</p>
                                                    )}
                                                    {image.status === 'error' && (
                                                        <>
                                                            <XCircle className="h-6 w-6 text-destructive" />
                                                            <p className="text-xs text-destructive">Failed</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-2 right-2">
                                            {image.status === 'success' && (
                                                <CheckCircle2 className="h-5 w-5 text-green-500 bg-background rounded-full" />
                                            )}
                                            {image.status === 'error' && (
                                                <XCircle className="h-5 w-5 text-destructive bg-background rounded-full" />
                                            )}
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground truncate flex-1">
                                                {image.file.name}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeImage(image.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {image.status === 'error' && image.error && (
                                            <p className="text-xs text-destructive mt-1">
                                                {image.error}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Available Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Colors</CardTitle>
                        <CardDescription>Select which colors are available for this product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
                            {ROOFING_COLORS.map((color) => (
                                <div
                                    key={color.name}
                                    className={`
                                        relative cursor-pointer rounded-lg border-2 p-3 transition-all
                                        ${selectedColors.includes(color.name)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted hover:border-muted-foreground/50'
                                        }
                                    `}
                                    onClick={() => handleColorToggle(color.name)}
                                >
                                    <div
                                        className="w-full aspect-square rounded-md mb-2 border"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <p className="text-xs font-medium text-center">{color.name}</p>
                                    {selectedColors.includes(color.name) && (
                                        <CheckCircle2 className="absolute top-1 right-1 h-4 w-4 text-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            {selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''} selected
                        </p>
                    </CardContent>
                </Card>

                {/* Available Gauges & Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Gauges & Pricing</CardTitle>
                        <CardDescription>Select available gauges and set price per meter for each</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                            {AVAILABLE_GAUGES.map((gauge) => (
                                <div
                                    key={gauge}
                                    className={`
                                        relative cursor-pointer rounded-lg border-2 p-4 transition-all
                                        ${selectedGauges.includes(gauge)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted hover:border-muted-foreground/50'
                                        }
                                    `}
                                    onClick={() => handleGaugeToggle(gauge)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-lg font-bold">Gauge {gauge}</p>
                                        {selectedGauges.includes(gauge) && (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {gauge === 26 ? 'Thickest' : gauge === 32 ? 'Thinnest' : 'Standard'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {selectedGauges.length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>Price per Meter (KES)</Label>
                                    {selectedGauges.sort().map((gauge) => (
                                        <div key={gauge} className="flex items-center gap-3">
                                            <Label className="w-24">Gauge {gauge}:</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={pricePerGauge[gauge] || ''}
                                                onChange={(e) => handlePriceChange(gauge, e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Available Finishes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Finishes</CardTitle>
                        <CardDescription>Select which finishes are available for this product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 grid-cols-3">
                            {AVAILABLE_FINISHES.map((finish) => (
                                <div
                                    key={finish}
                                    className={`
                                        relative cursor-pointer rounded-lg border-2 p-4 transition-all
                                        ${selectedFinishes.includes(finish)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted hover:border-muted-foreground/50'
                                        }
                                    `}
                                    onClick={() => handleFinishToggle(finish)}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium capitalize">{finish}</p>
                                        {selectedFinishes.includes(finish) && (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            {selectedFinishes.length} finish{selectedFinishes.length !== 1 ? 'es' : ''} selected
                        </p>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}