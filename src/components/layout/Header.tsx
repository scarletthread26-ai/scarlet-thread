"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Search, Heart, User, ShoppingBag, Home, Gift, Baby, Star, Image, Menu, X, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { createClient } from '@/lib/supabase/client'
import { useSettings } from '@/hooks/use-settings'


const marqueeItems = [
  "• Free Shipping Above AED 200",
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
  const setShippingConfig = useCartStore((state) => state.setShippingConfig)
  const wishlistItems = useWishlistStore((state) => state.items)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const { data: settings } = useSettings()

  useEffect(() => {
    if (settings) {
      setShippingConfig(Number(settings.shipping_rate ?? 18), Number(settings.free_shipping_min ?? 200))
    }
  }, [settings, setShippingConfig])

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetchWishlist(true)
      }
    })
  }, [fetchWishlist])

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
      <header className="sticky top-0 z-50 w-full border-b bg-white">

        {/* Announcement Bar */}
        <div className="bg-primary text-primary-foreground py-2 text-center text-[12px] font-medium tracking-wider overflow-hidden">
          <div className="hidden lg:block text-[10px] px-4">
            • Free Shipping Above AED {settings?.free_shipping_min ?? 200} &nbsp;&nbsp;• Crafted With Love In UAE &nbsp;&nbsp;• Track Your Order
          </div>
          <div className="lg:hidden overflow-hidden">
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
              {(() => {
                const items = [
                  `• Free Shipping Above AED ${settings?.free_shipping_min ?? 200}`,
                  "• Crafted With Love In UAE",
                  "• Track Your Order",
                ];
                return [...items, ...items, ...items, ...items];
              })().map((item, index) => (
                <span key={index} className="shrink-0">{item}</span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="flex h-18 items-center justify-between px-2 sm:px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
              <img
                src="/images/logo/logo.png"
                alt="The Scarlet Thread Logo"
                className="h-9 w-9 lg:h-10 lg:w-10 object-contain"
              />
              <img
                src="/images/logo/name.png"
                alt="The Scarlet Thread"
                className="h-9 lg:h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative transition-colors font-semibold text-[12px] uppercase  hover:text-primary py-1 ${
                  isActive(link.path) ? 'text-primary' : 'text-slate-700'
                }`}
              >
                {link.name}

              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Toggle (Mobile Only) */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSearchOpen((prev) => !prev)
                setMenuOpen(false)
              }}
              aria-label="Toggle search"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center border border-border/80 rounded-full px-3 py-1.5 w-[220px] xl:w-[260px] bg-white focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all mr-2">
              <Search className="h-[18px] w-[18px] text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSearch(e)
                  }
                }}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {user ? (
              <div className="relative group hidden lg:block">
                <Link href="/account" className="flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-white hover:bg-muted/50 transition-all text-left text-foreground select-none">
                  <User className="h-[18px] w-[18px] text-purple-650 shrink-0" />
                  <div className="flex flex-col leading-none text-xs pr-1">
                    <span className="text-[9px] text-muted-foreground font-medium">Hi, {firstName}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-0.5 text-[11px]">
                      Account
                      <ChevronRight className="w-2.5 h-2.5 rotate-90 text-slate-450 mt-0.5" />
                    </span>
                  </div>
                </Link>

                {/* User Dropdown (Logged In Only) */}
                <div className="absolute top-full right-0 mt-1.5 w-52 bg-white border border-border shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                      useWishlistStore.getState().clearWishlist()
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
              <Link href="/login" className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-white hover:bg-muted/50 transition-all text-left text-foreground select-none">
                <User className="h-[18px] w-[18px] text-slate-450 shrink-0" />
                <div className="flex flex-col leading-none text-xs pr-1">
                  <span className="text-[9px] text-muted-foreground font-medium">Hello, Sign in</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-[11px]">Account</span>
                </div>
              </Link>
            )}

            <Link href="/wishlist" className="hidden lg:flex relative items-center justify-center w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors text-foreground">
              <Heart className="h-[18px] w-[18px]" />
              <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-[#31006E] text-[10px] font-bold text-white flex items-center justify-center shadow-sm border border-white">
                {wishlistCount}
              </span>
            </Link>

            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors text-foreground">
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-[#31006E] text-[10px] font-bold text-white flex items-center justify-center shadow-sm border border-white">
                {cartCount}
              </span>
            </Link>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 text-foreground hover:bg-muted/50 transition-colors rounded-full ml-1"
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
                      className={`flex items-center justify-between px-5 py-3.5 text-[13px] font-semibold uppercase tracking-wide transition-colors border-b border-border/40 last:border-0 ${active ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-primary hover:bg-muted/40'
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
            <div className="flex items-center justify-around h-16 relative w-full max-w-md mx-auto px-1">

              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative w-14 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Home className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">Home</span>
              </Link>

              {/* Him */}
              <Link
                href="/gifts-for-him"
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative w-14 ${isActive('/gifts-for-him') ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Gift className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">Him</span>
              </Link>

              {/* Central Cart Button */}
              <div className="relative flex flex-col items-center justify-center w-14">
                <div className="absolute -top-10">
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl border-[3px] border-white hover:scale-105 transition-transform"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Her */}
              <Link
                href="/gifts-for-her"
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative w-14 ${isActive('/gifts-for-her') ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Heart className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">Her</span>
              </Link>

              {/* Kids */}
              <Link
                href="/kids-babies"
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative w-14 ${isActive('/kids-babies') ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Baby className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">Kids</span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}