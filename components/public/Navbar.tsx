/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    Menu,
    X,
    Phone,
    MessageCircle,
    Home,
    Package,
    Info,
    Mail,
    MapPin,
    ChevronRight
} from 'lucide-react'

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
]

export default function Navbar() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/95 backdrop-blur-md shadow-md border-b'
                : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-full h-10 md:w-full md:h-10 from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <img
                                src="/images/projects/logo.png"
                                alt="Wigo Mabati Logo"
                                className="h-full object-cover"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground hover:bg-muted hover:text-primary'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        <a href="tel:+254748933988">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Phone className="h-4 w-4" />
                                <span>0748 933 988</span>
                            </Button>
                        </a>
                        <a
                            href="https://wa.me/254748933988"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                                <MessageCircle className="h-4 w-4" />
                                <span>WhatsApp</span>
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-sm p-0">
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                                            <span className="text-primary-foreground font-bold text-xl">W</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-xl">
                                                WIGO <span className="text-primary">MABATI</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Durable Roofs, Unmatched Quality
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon
                                        const isActive = pathname === link.href
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium flex-1">{link.label}</span>
                                                <ChevronRight className="h-4 w-4 opacity-50" />
                                            </Link>
                                        )
                                    })}
                                </nav>

                                {/* Mobile Contact Info */}
                                <div className="p-4 border-t bg-muted/30 space-y-3">
                                    <a
                                        href="tel:+254748933988"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-muted-foreground">Call us</div>
                                            <div className="font-semibold">0748 933 988</div>
                                        </div>
                                    </a>
                                    <a
                                        href="https://wa.me/254748933988"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs opacity-80">Chat with us</div>
                                            <div className="font-semibold">WhatsApp</div>
                                        </div>
                                    </a>
                                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span>Opp. Adventist University, Rongai, Kenya</span>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}