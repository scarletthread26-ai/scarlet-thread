"use client"

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faPinterest, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { Mail, Phone, Clock, ChevronDown } from 'lucide-react'

export function Footer() {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false)
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(false)
  const [isNeedHelpOpen, setIsNeedHelpOpen] = useState(false)

  return (
    <footer className="bg-[#4b0082] border-t border-white/10 text-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:pt-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">

          {/* Column 1: Brand Info */}
          <div className="border-b border-white/10 sm:border-none pb-4 sm:pb-0 w-full sm:w-auto space-y-4 flex flex-col items-start text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-white/20 shadow-sm w-fit">
                <img
                  src="/images/logo/logo.png"
                  alt="The Scarlet Thread Logo"
                  className="h-6 w-auto object-contain"
                />
                <img
                  src="/images/logo/name.png"
                  alt="The Scarlet Thread"
                  className="h-7 w-auto object-contain"
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
          <div className="border-b border-white/10 sm:border-none pt-1 pb-3 sm:py-0 w-full sm:w-auto space-y-3 sm:space-y-4 flex flex-col items-start text-left">
            <button 
              onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
              className="flex items-center justify-between w-full sm:w-auto text-left focus:outline-none sm:pointer-events-none cursor-pointer sm:cursor-default"
            >
              <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
                Quick Links
              </h4>
              <ChevronDown 
                className={`w-4 h-4 text-white/70 transition-transform duration-200 sm:hidden ${isQuickLinksOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            <ul className={`${isQuickLinksOpen ? 'block' : 'hidden'} sm:block space-y-2.5 text-xs sm:text-sm text-white/70 w-full`}>
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
          <div className="border-b border-white/10 sm:border-none pt-1 pb-3 sm:py-0 w-full sm:w-auto space-y-3 sm:space-y-4 flex flex-col items-start text-left">
            <button 
              onClick={() => setIsCustomerCareOpen(!isCustomerCareOpen)}
              className="flex items-center justify-between w-full sm:w-auto text-left focus:outline-none sm:pointer-events-none cursor-pointer sm:cursor-default"
            >
              <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
                Customer Care
              </h4>
              <ChevronDown 
                className={`w-4 h-4 text-white/70 transition-transform duration-200 sm:hidden ${isCustomerCareOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            <ul className={`${isCustomerCareOpen ? 'block' : 'hidden'} sm:block space-y-2.5 text-xs sm:text-sm text-white/70 w-full`}>
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

          <div className="border-b border-white/10 sm:border-none pt-1 pb-3 sm:py-0 w-full sm:w-auto space-y-3 sm:space-y-4 flex flex-col items-start text-left col-span-1">
            <button 
              onClick={() => setIsNeedHelpOpen(!isNeedHelpOpen)}
              className="flex items-center justify-between w-full sm:w-auto text-left focus:outline-none sm:pointer-events-none cursor-pointer sm:cursor-default"
            >
              <h4 className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white pb-1 w-full max-w-[200px] sm:max-w-none">
                Need Help?
              </h4>
              <ChevronDown 
                className={`w-4 h-4 text-white/70 transition-transform duration-200 sm:hidden ${isNeedHelpOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <div className={`${isNeedHelpOpen ? 'block' : 'hidden'} sm:block w-full space-y-4`}>
              <ul className="space-y-3.5 text-xs sm:text-sm text-white/70 w-full">
                <li className="flex items-start gap-2.5 justify-start">
                  <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">Email Us</span>
                    <a href="mailto:support@scarletthread.ae" className="hover:text-white transition-colors font-medium">
                      support@scarletthread.ae
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 justify-start">
                  <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">Call / WhatsApp</span>
                    <a href="https://wa.me/971501872337" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                      +971 50 187 2337
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

        </div>

        {/* Footer Bottom bar */}
        <div className="pt-3 mt-6 sm:mt-3 border-t border-white/10 flex flex-col items-center justify-center text-center pb-4 sm:pb-0">
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

