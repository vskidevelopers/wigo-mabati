'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Clock,
    Send,
    CheckCircle2,
    Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

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

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        // Simulate form submission
        setTimeout(() => {
            setSending(false)
            toast.success('Message sent! We\'ll get back to you soon.')
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        }, 1500)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
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
                        className="max-w-3xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                                Get In Touch
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6"
                            variants={fadeInUp}
                        >
                            Let&apos;s Talk About Your{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Roofing Needs
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-muted-foreground"
                            variants={fadeInUp}
                        >
                            Have questions? Need a quote? We&apos;re here to help. Reach out to us through any of the channels below.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {/* Phone */}
                        <motion.div variants={fadeInUp}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                                <CardContent className="pt-6 text-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-4">
                                        <Phone className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Call Us</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Speak directly with our team
                                    </p>
                                    <a
                                        href="tel:+254748933988"
                                        className="text-2xl font-bold text-primary hover:underline"
                                    >
                                        0748 933 988
                                    </a>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Mon-Sat, 8am-6pm
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* WhatsApp */}
                        <motion.div variants={fadeInUp}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                                <CardContent className="pt-6 text-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-green-500/10 mb-4">
                                        <MessageCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Quick responses via chat
                                    </p>
                                    <a
                                        href="https://wa.me/254748933988"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-lg font-bold text-green-600 hover:underline"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Chat Now
                                    </a>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Usually replies within 30 mins
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={fadeInUp}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                                <CardContent className="pt-6 text-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 mb-4">
                                        <Mail className="h-8 w-8 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                                    <p className="text-muted-foreground mb-4">
                                        For detailed inquiries
                                    </p>
                                    <a
                                        href="mailto:info@wigomabati.co.ke"
                                        className="text-lg font-bold text-primary hover:underline"
                                    >
                                        info@wigomabati.co.ke
                                    </a>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        We respond within 24 hours
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form & Location */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we&apos;ll get back to you as soon as possible
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="0712345678"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Quote request, product inquiry, etc."
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your roofing needs..."
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            size="lg"
                                            disabled={sending}
                                        >
                                            {sending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Location & Hours */}
                        <motion.div
                            className="space-y-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            {/* Location */}
                            <motion.div variants={fadeInUp}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Visit Our Showroom
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                                            <div className="text-center">
                                                <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Map placeholder</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-semibold">Wigo Mabati Showroom</p>
                                            <p className="text-sm text-muted-foreground">
                                                Opp. Adventist University of Kenya<br />
                                                Next to Shell Petrol Station<br />
                                                Rongai, Kajiado County<br />
                                                Kenya
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Business Hours */}
                            <motion.div variants={fadeInUp}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" />
                                            Business Hours
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="font-medium">Monday - Friday</span>
                                                <span className="text-muted-foreground">8:00 AM - 6:00 PM</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="font-medium">Saturday</span>
                                                <span className="text-muted-foreground">8:00 AM - 4:00 PM</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="font-medium">Sunday</span>
                                                <span className="text-muted-foreground">Closed</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                                            <p className="text-sm text-green-800 dark:text-green-200">
                                                <CheckCircle2 className="inline h-4 w-4 mr-1" />
                                                Currently Open
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Social Media */}
                            <motion.div variants={fadeInUp}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Follow Us</CardTitle>
                                        <CardDescription>
                                            Stay connected on social media for updates and offers
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-3">
                                            <a
                                                href="https://facebook.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600"
                                                aria-label="Facebook"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                </svg>
                                            </a>
                                            <a
                                                href="https://instagram.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-pink-600"
                                                aria-label="Instagram"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                                </svg>
                                            </a>
                                            <a
                                                href="https://twitter.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-sky-500"
                                                aria-label="Twitter"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>

                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick CTA */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Prefer Instant Response?</h2>
                        <p className="text-muted-foreground mb-6">
                            For the fastest response, reach out to us directly via WhatsApp or phone
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="https://wa.me/254748933988">
                                <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp Us
                                </Button>
                            </a>
                            <a href="tel:+254748933988">
                                <Button size="lg" variant="outline" className="gap-2">
                                    <Phone className="h-5 w-5" />
                                    Call Now
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}