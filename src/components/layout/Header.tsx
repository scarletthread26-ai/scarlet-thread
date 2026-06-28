"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Search, Heart, User, ShoppingBag, Home, Gift, Baby, Star, Image, Menu, X, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { createClient } from '@/lib/supabase/client'

const marqueeItems = [
  "• Free Shipping Above AED 150",
  "• Crafted With Love In UAE",
  "• Track Your Order",
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showBottomNav, setShowBottomNav] = useState(false)
  const [user, setUser] = useState<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  // ← ADD THIS: Show bottom nav only when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBottomNav(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery("")
  }, [pathname])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const [mounted, setMounted] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0
  const wishlistCount = mounted ? wishlistItems.length : 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchQuery("")
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Gifts For Him', path: '/gifts-for-him', icon: Gift },
    { name: 'Gifts For Her', path: '/gifts-for-her', icon: Heart },
    { name: 'Kids & Babies', path: '/kids-babies', icon: Baby },
    { name: 'Gallery', path: '/gallery', icon: Image },
  ]

  const bottomNavLinksLeft = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Gifts', path: '/gifts-for-her', icon: Gift },
  ]
  
  const bottomNavLinksRight = [
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Account', path: '/account', icon: User },
  ]

  const getFirstName = () => {
    if (!user) return "";
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(" ")[0];
    }
    if (user.email) {
      const parts = user.email.split("@")[0];
      return parts.charAt(0).toUpperCase() + parts.slice(1);
    }
    return "User";
  };
  const firstName = getFirstName();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/60 backdrop-blur-sm">

        {/* Announcement Bar */}
        <div className="bg-primary text-primary-foreground py-1 text-center text-[12px] font-medium tracking-wider overflow-hidden">
          <div className="hidden lg:block px-4">
            • Free Shipping Above AED 150 &nbsp;&nbsp;• Crafted With Love In UAE &nbsp;&nbsp;• Track Your Order
          </div>
          <div className="lg:hidden overflow-hidden">
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
              {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={index} className="shrink-0">{item}</span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="flex h-16 items-center justify-between px-4">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
              <img
                src="/images/logo/logo.png"
                alt="The Scarlet Thread Logo"
                className="h-5 w-10 lg:h-8 lg:w-8 object-contain"
                style={{ filter: "hue-rotate(23deg) saturate(138%) brightness(70%) contrast(335%)" }}
              />
              <img
                src="/images/logo/name.png"
                alt="The Scarlet Thread"
                className="h-8 w-auto object-contain"
                style={{ filter: "hue-rotate(12deg) saturate(76%) brightness(76%) contrast(315%)" }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`transition-colors font-medium text-sm hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => {
                setSearchOpen((prev) => !prev)
                setMenuOpen(false)
              }}
              aria-label="Toggle search"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            {user ? (
              <div className="relative group p-2 hidden lg:block">
                <Link href="/account" className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-xs font-semibold max-w-[120px] truncate">Hi, {firstName}</span>
                </Link>
                
                {/* User Dropdown (Logged In Only) */}
                <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-border shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-bold text-foreground truncate">Hi, {firstName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-colors">My Account</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-colors">My Orders</Link>
                  <Link href="/wishlist" className="px-4 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-colors flex justify-between items-center">
                    Wishlist
                    {wishlistCount > 0 && <span className="bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{wishlistCount}</span>}
                  </Link>
                  <div className="h-px bg-border/50 my-1" />
                  <button
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      setUser(null)
                      router.push('/')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:flex items-center px-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            )}
            <Link href="/cart" className="p-2 text-foreground hover:text-primary transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors ml-1"
              onClick={() => {
                setMenuOpen((prev) => !prev)
                setSearchOpen(false)
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search-bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t bg-white shadow-md"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gifts, occasions, products..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground text-[12px] font-semibold uppercase tracking-wide px-4 py-1.5 rounded-sm hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Dropdown Nav Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t bg-white shadow-md"
            >
              <nav className="flex flex-col py-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between px-5 py-3.5 text-[13px] font-semibold uppercase tracking-wide transition-colors border-b border-border/40 last:border-0 ${
                        active ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-primary hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </Link>
                  )
                })}
                <div className="flex items-center gap-4 px-5 py-4 border-t border-border/40 mt-1">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" /> Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation — appears on scroll */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.nav
            key="bottom-nav"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between h-16 px-4 relative w-full max-w-md mx-auto">
              
              {/* Left Links */}
              <div className="flex items-center gap-8">
                {bottomNavLinksLeft.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                        active ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium leading-none">{link.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Central Floating Cart Button */}
              <div className="absolute left-1/2 -top-6 -translate-x-1/2">
                <Link 
                  href="/cart" 
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl border-[3px] border-white hover:scale-105 transition-transform relative z-50"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-8">
                {bottomNavLinksRight.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                        active ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium leading-none">{link.name}</span>
                    </Link>
                  )
                })}
              </div>

            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}