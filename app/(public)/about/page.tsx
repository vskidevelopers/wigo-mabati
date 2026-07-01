'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
    Shield,
    Award,
    Users,
    Target,
    Heart,
    CheckCircle2,
    ArrowRight,
    MessageCircle,
    TrendingUp,
    Clock,
    Sparkles
} from 'lucide-react'

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

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
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
                        className="max-w-4xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Our Story
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6"
                            variants={fadeInUp}
                        >
                            Building Trust,{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                One Roof at a Time
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            For over a decade, Wigo Mabati has been Kenya&apos;s trusted partner in quality roofing solutions.
                            We don&apos;t just sell materials—we deliver peace of mind.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Card className="h-full border-2 hover:border-primary/20 transition-all">
                                <CardContent className="pt-6">
                                    <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-6">
                                        <Target className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        To provide every Kenyan family with durable, affordable, and beautiful roofing solutions
                                        that stand the test of time. We believe every home deserves protection that lasts for decades,
                                        not seasons.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Premium quality materials</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Affordable pricing for all budgets</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Expert guidance and support</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className="h-full border-2 hover:border-primary/20 transition-all">
                                <CardContent className="pt-6">
                                    <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 mb-6">
                                        <Heart className="h-8 w-8 text-purple-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        To be Kenya&apos;s most trusted roofing partner, known for unmatched quality,
                                        exceptional service, and innovative solutions that transform houses into homes.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Nationwide presence and delivery</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Industry-leading durability standards</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Customer-first approach always</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
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
                            Why Families Trust Us
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={fadeInUp}
                        >
                            We&apos;ve built our reputation on quality, reliability, and customer satisfaction
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
                                icon: Shield,
                                title: "10+ Years Durability",
                                description: "Our roofing materials are engineered to withstand Kenya's toughest weather conditions for over a decade.",
                                color: "text-blue-500",
                                bgColor: "bg-blue-500/10"
                            },
                            {
                                icon: Award,
                                title: "Premium Quality",
                                description: "We source only the finest materials with corrosion-resistant coatings and fade-proof colors.",
                                color: "text-purple-500",
                                bgColor: "bg-purple-500/10"
                            },
                            {
                                icon: Users,
                                title: "Expert Team",
                                description: "Our knowledgeable team provides personalized guidance to help you choose the perfect roofing solution.",
                                color: "text-green-500",
                                bgColor: "bg-green-500/10"
                            },
                            {
                                icon: TrendingUp,
                                title: "Competitive Pricing",
                                description: "Quality doesn't have to break the bank. We offer unbeatable value with flexible payment options.",
                                color: "text-orange-500",
                                bgColor: "bg-orange-500/10"
                            },
                            {
                                icon: Clock,
                                title: "Fast Delivery",
                                description: "Countrywide delivery with careful handling. We bring your roofing materials right to your site.",
                                color: "text-pink-500",
                                bgColor: "bg-pink-500/10"
                            },
                            {
                                icon: Heart,
                                title: "Customer First",
                                description: "From first inquiry to final installation, we're with you every step of the way with dedicated support.",
                                color: "text-red-500",
                                bgColor: "bg-red-500/10"
                            }
                        ].map((item, index) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                                        <CardContent className="pt-6">
                                            <div className={`inline-flex p-4 rounded-2xl ${item.bgColor} mb-6`}>
                                                <Icon className={`h-8 w-8 ${item.color}`} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
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

            {/* Stats */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            { number: "10+", label: "Years Experience" },
                            { number: "5000+", label: "Happy Customers" },
                            { number: "10+", label: "Color Options" },
                            { number: "47", label: "Counties Served" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                variants={fadeInUp}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
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
                            Ready to Start Your Roofing Journey?
                        </motion.h2>
                        <motion.p
                            className="text-xl mb-8 opacity-90"
                            variants={fadeInUp}
                        >
                            Join thousands of satisfied customers who trust Wigo Mabati for their roofing needs.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={fadeInUp}
                        >
                            <Link href="/products">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group">
                                    Browse Products
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="https://wa.me/254748933988">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Chat With Us
                                </Button>
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}