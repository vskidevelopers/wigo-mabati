import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

const productLinks = [
  { href: "/products", label: "Wigo Corrugate" },
  { href: "/products", label: "Wigo Box Profile" },
  { href: "/products", label: "Decra Milano" },
  { href: "/products", label: "Accessories" },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-3 text-2xl font-bold text-primary-foreground md:text-3xl">
              Ready to Roof Your Dreams?
            </h3>
            <p className="mb-6 text-primary-foreground/90">
              Get a free quote today. Our team is ready to help you choose the
              perfect roofing solution.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/products">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-primary hover:bg-slate-100"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/254748933988"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-16 items-center justify-center rounded-lg shadow-lg">
                <img
                  src="/images/projects/logo.png"
                  alt="Wigo Mabati Logo"
                  className="h-full object-cover"
                />
              </div>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Premium mabati roofing solutions that protect your home for
              decades. Quality materials, expert guidance, and unbeatable value
              across Kenya.
            </p>
            <div className="flex gap-2">
              <a
                href="https://wa.me/254748933988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-green-600"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
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
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Our Products
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+254748933988"
                  className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">0748 933 988</div>
                    <div className="text-xs">Mon-Sat, 8am-6pm</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wigomabati.co.ke"
                  className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">
                      info@wigomabati.co.ke
                    </div>
                    <div className="text-xs">Email us anytime</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Rongai, Kenya</div>
                    <div className="text-xs">
                      Opp. Adventist University,
                      <br />
                      Next to Shell Petrol Station
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Business Hours</div>
                    <div className="text-xs">
                      Mon-Sat: 8:00 AM - 6:00 PM
                      <br />
                      Sun: Closed
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-sm text-slate-500 md:text-left">
              © {currentYear} Wigo Mabati. All rights reserved. Made with{" "}
              <Heart className="inline h-3 w-3 fill-red-500 text-red-500" /> in
              Kenya 🇰🇪
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                href="/warranty"
                className="transition-colors hover:text-white"
              >
                Warranty
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
