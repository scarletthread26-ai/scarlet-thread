"use client"

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faPinterest, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { Mail, Phone, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#4b0082] border-t border-white/10 text-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">

          {/* Column 1: Brand Info */}
          <div className="space-y-4 flex flex-col items-start text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-white/20 shadow-sm w-fit">
                <img
                  src="/images/logo/logo.png"
                  alt="The Scarlet Thread Logo"
                  className="h-6 w-auto object-contain"
                  style={{ filter: "hue-rotate(23deg) saturate(138%) brightness(70%) contrast(335%)" }}
                />
                <img
                  src="/images/logo/name.png"
                  alt="The Scarlet Thread"
                  className="h-7 w-auto object-contain"
                  style={{ filter: "hue-rotate(12deg) saturate(76%) brightness(76%) contrast(315%)" }}
                />
              </div>
              <p className="text-xs sm:text-sm text-white/70 max-w-xs leading-relaxed">
                Thoughtful, personalized, and beautifully embroidered gifts for your loved ones. Stitched with love, care, and attention to every little detail.
              </p>
            </div>
            {/* Social Links (Tablet & Laptop view) */}
            <div className="hidden sm:flex gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Pinterest"
              >
                <FontAwesomeIcon icon={faPinterest} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="X (Twitter)"
              >
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 flex flex-col items-start text-left">
            <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4 flex flex-col items-start text-left">
            <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/shipping" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Need Help? */}
          <div className="space-y-5 flex flex-col items-start text-left col-span-1 w-full">
            <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
              Need Help?
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-white/70 w-full">
              <li className="flex items-start gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Email Us</span>
                  <a href="mailto:support@thescarletthread.in" className="hover:text-white transition-colors font-medium">
                    support@thescarletthread.in
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 justify-start">
                <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Call / WhatsApp</span>
                  <a href="tel:+919876543210" className="hover:text-white transition-colors font-medium">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 justify-start">
                <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Support Hours</span>
                  <span className="font-medium">Mon - Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </li>
            </ul>

            {/* Social Links (Mobile view only) */}
            <div className="flex sm:hidden justify-center gap-3 pt-4 w-full">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="Pinterest"
              >
                <FontAwesomeIcon icon={faPinterest} className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-[#4b0082] hover:bg-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                aria-label="X (Twitter)"
              >
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 mt-12 border-t border-white/10 flex flex-col items-center justify-center text-center pb-6 sm:pb-0">
          <div className="text-xs sm:text-sm text-white/70 flex flex-row flex-wrap sm:flex-col items-center justify-center gap-x-2 gap-y-0.5 sm:gap-2">
            <span>© {new Date().getFullYear()} The Scarlet Thread. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Crafted by <a href="https://www.ekodrix.com" target="_blank" rel="noopener noreferrer" className="text-white/70 font-semibold hover:underline transition-colors">Ekodrix</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
