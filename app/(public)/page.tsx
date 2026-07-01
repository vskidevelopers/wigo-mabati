'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Shield,
    Truck,
    Clock,
    CheckCircle2,
    ArrowRight,
    Phone,
    MessageCircle,
    Sparkles,
    Home as HomeIcon,
    Building2,
    Palette,
    Ruler,
    Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
} as const

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
    }
} as const


export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
                {/* Animated background elements */}
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
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
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Durable Roofs, Unmatched Quality
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent"
                            variants={fadeInUp}
                        >
                            Build With Confidence
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            Premium mabati roofing solutions that protect your home for decades.
                            Quality materials, expert guidance, and unbeatable value.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={fadeInUp}
                        >
                            <Link href="/products">
                                <Button size="lg" className="text-lg px-8 py-6 group">
                                    Explore Products
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="https://wa.me/254748933988">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Chat on WhatsApp
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                            variants={fadeInUp}
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>10+ Years Durability</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>Countrywide Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>Lipa Pole Pole Available</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{
                        y: [0, 10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
                        <motion.div
                            className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                            animate={{
                                y: [0, 12, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Value Propositions */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-4"
                            variants={fadeInUp}
                        >
                            Why Choose Wigo Mabati?
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            We don&apos;t just sell roofing materials. We deliver peace of mind.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                icon: Shield,
                                title: "Built to Last",
                                description: "Premium gauge steel with corrosion-resistant coatings. Your roof will withstand Kenya's toughest weather for decades.",
                                color: "text-blue-500",
                                bgColor: "bg-blue-500/10"
                            },
                            {
                                icon: Palette,
                                title: "Beautiful Colors",
                                description: "10+ stunning colors that won't fade. From classic Charcoal Grey to vibrant Maasai Red, find your perfect match.",
                                color: "text-purple-500",
                                bgColor: "bg-purple-500/10"
                            },
                            {
                                icon: Truck,
                                title: "Fast Delivery",
                                description: "Countrywide delivery with careful handling. We bring your roofing materials right to your construction site.",
                                color: "text-green-500",
                                bgColor: "bg-green-500/10"
                            }
                        ].map((item, index) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={index} variants={scaleIn}>
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                                        <CardContent className="pt-6">
                                            <div className={`inline-flex p-4 rounded-2xl ${item.bgColor} mb-6`}>
                                                <Icon className={`h-8 w-8 ${item.color}`} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-4"
                            variants={fadeInUp}
                        >
                            Simple 3-Step Process
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            From browsing to installation, we make it easy
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                step: "01",
                                icon: Ruler,
                                title: "Configure Your Roof",
                                description: "Choose your product, color, gauge, and finish. See live pricing as you customize."
                            },
                            {
                                step: "02",
                                icon: MessageCircle,
                                title: "Place Your Order",
                                description: "Submit your order and get instant WhatsApp confirmation. We'll follow up within minutes."
                            },
                            {
                                step: "03",
                                icon: HomeIcon,
                                title: "We Deliver & Install",
                                description: "Fast delivery to your site. Pay full or use Lipa Pole Pole for flexible payments."
                            }
                        ].map((item, index) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    variants={fadeInUp}
                                >
                                    <div className="bg-background rounded-2xl p-8 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                                            {item.step}
                                        </div>
                                        <Icon className="h-12 w-12 text-primary mb-4" />
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-4"
                            variants={fadeInUp}
                        >
                            Our Premium Products
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            Explore our range of high-quality roofing solutions
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                name: "Wigo Corrugate",
                                category: "In-House",
                                description: "Traditional corrugated roofing with modern durability",
                                colors: ["Jungle Green", "Charcoal Grey", "Tile Red"],
                                image: "https://qzzcxoagpupwklsacklw.supabase.co/storage/v1/object/public/wigo-mabati/assets/corugate.png"
                            },
                            {
                                name: "Wigo Box Profile",
                                category: "In-House",
                                description: "Modern box profile with premium finish options",
                                colors: ["Maasai Red", "Bronze", "Slate Grey"],
                                image: "https://qzzcxoagpupwklsacklw.supabase.co/storage/v1/object/public/wigo-mabati/assets/box%20tile%20bg.png"
                            },
                            {
                                name: "Decra Milano",
                                category: "Stone Coated",
                                description: "Premium stone-coated roofing for luxury homes",
                                colors: ["Charcoal Grey", "Tile Red", "Jungle Green"],
                                image: "https://qzzcxoagpupwklsacklw.supabase.co/storage/v1/object/public/wigo-mabati/assets/decra%20millano.png"
                            }
                        ].map((product, index) => (
                            <motion.div key={index} variants={scaleIn}>
                                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                                {product.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="pt-6">
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            {product.description}
                                        </p>
                                        <div className="flex gap-2 mb-4">
                                            {product.colors.slice(0, 5).map((colorName, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-8 h-8 rounded-full border-2 border-background shadow-md"
                                                    style={{ backgroundColor: COLOR_MAP[colorName] || '#ccc' }}
                                                    title={colorName}
                                                />
                                            ))}
                                            {product.colors.length > 5 && (
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                    +{product.colors.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        <Link href="/products">
                                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="text-center mt-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Link href="/products">
                            <Button size="lg" variant="outline" className="text-lg px-8">
                                View All Products
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Color Showcase */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-4"
                            variants={fadeInUp}
                        >
                            10+ Stunning Colors
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            Find the perfect color to complement your home&apos;s style
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
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
                        ].map((color, index) => (
                            <motion.div
                                key={color.name}
                                className="group cursor-pointer"
                                variants={scaleIn}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div
                                    className="aspect-square rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border-4 border-background"
                                    style={{ backgroundColor: color.hex }}
                                />
                                <p className="text-center mt-2 text-sm font-medium group-hover:text-primary transition-colors">
                                    {color.name}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials / Trust */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="text-center mb-12"
                            variants={fadeInUp}
                        >
                            <div className="flex justify-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Trusted by Homeowners Across Kenya
                            </h2>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border-2 border-primary/10"
                            variants={scaleIn}
                        >
                            <div className="text-center">
                                <p className="text-xl md:text-2xl italic mb-6 leading-relaxed">
                                    &quot;What you see is real work done for real clients. Your home deserves a roof that lasts for years,
                                    not seasons. Choose Wigo mabati today and give your family safety, comfort, and peace of mind every season.&quot;
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                        <HomeIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Wigo Mabati Team</p>
                                        <p className="text-sm text-muted-foreground">Quality, Durable, Affordable</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-6"
                            variants={fadeInUp}
                        >
                            Ready to Build Your Dream Roof?
                        </motion.h2>
                        <motion.p
                            className="text-xl mb-8 opacity-90"
                            variants={fadeInUp}
                        >
                            Get a free quote today. Our team is ready to help you choose the perfect roofing solution.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={fadeInUp}
                        >
                            <Link href="/products">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group">
                                    Start Your Order
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="tel:0748933988">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Call Us Now
                                </Button>
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}