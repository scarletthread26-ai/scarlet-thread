"use client"

// ---------------------------------------------------------------------------
// FONT NOTE: "Blacker Pro Display" is a paid font (not on Google Fonts), so it
// won't render unless you self-host the font files. In your global CSS
// (e.g. app/globals.css) add something like:
//
//   @font-face {
//     font-family: "Blacker Pro Display";
//     src: url("/fonts/BlackerProDisplay-Black.woff2") format("woff2");
//     font-weight: 900;
//     font-style: normal;
//     font-display: swap;
//   }
//
// or use next/font/local pointing at the .woff2/.woff/.ttf files you own a
// license for, then reference that font's className/variable on the <h1>
// below instead of the inline fontFamily. Until the font files are added,
// the heading falls back to Georgia/serif.
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { GiftIcon, HeartIcon, StarIcon, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// ---------------------------------------------------------------------------
// Slide data
// Each slide carries:
//   - desktop background (replaces scarlet-homebanner.png per slide)
//   - tablet image  (sm–md, shown as the full-bleed background)
//   - mobile image  (xs, shown as the full-bleed background)
//   - heading / description / cta link
// ---------------------------------------------------------------------------
const STATIC_SLIDES = [
  {
    id: 0,
    desktopBg: "/images/heropage/scarlet-couple1.png",
    tabletImg: "/images/heropage/scarlet-couple1.png",
    mobileImg: "/images/heropage/scarlet-mobile.png",
    ctaLink: "/products",
    title: "",
    subtitle: "",
    buttonText: "Shop Collection",
  },
  {
    id: 1,
    desktopBg: "/images/heropage/scarlet-baby1.png",
    tabletImg: "/images/heropage/scarlet-baby1.png",
    mobileImg: "/images/heropage/scarlet-mobilebaby.png",
    ctaLink: "/products",
    title: "",
    subtitle: "",
    buttonText: "Shop Collection",
  },
  {
    id: 2,
    desktopBg: "/images/heropage/scarlet-couple2.png",
    tabletImg: "/images/heropage/scarlet-couple2.png",
    mobileImg: "/images/heropage/scarlet-mobilecouple.png",
    ctaLink: "/products",
    title: "",
    subtitle: "",
    buttonText: "Shop Collection",
  },
  {
    id: 3,
    desktopBg: "/images/heropage/scarlet-lady2.png",
    tabletImg: "/images/heropage/scarlet-lady2.png",
    mobileImg: "/images/heropage/scarlet-mobilelady.png",
    ctaLink: "/products",
    title: "",
    subtitle: "",
    buttonText: "Shop Collection",
  },
]

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } },
}

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.05 } },
}

const descVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" as const, delay: 0.3 } },
}

const btnVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" as const, delay: 0.5 } },
}

// ---------------------------------------------------------------------------
// Dot indicator
// ---------------------------------------------------------------------------
function Dots({ total, active, onChange }: { total: number; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${i === active
            ? "bg-primary w-5 h-2"
            : "bg-primary/30 hover:bg-primary/60 w-2 h-2"
            }`}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero title formatter
// Title case (NOT uppercase), with the final accent word in italic primary color,
// matching: "More Than a Gift. A Memory in the Making."
//
// "More Than a Gift." is forced onto its own line with a hard <br />, then
// "A Memory in the Making." wraps naturally beneath it based on container
// width (so on narrow columns it can still break into two lines there).
// ---------------------------------------------------------------------------
function formatHeroTitle(titleStr: string, isMobile: boolean) {
  if (!titleStr) return "";

  const lower = titleStr.toLowerCase();
  if (lower.includes("more than a gift") && lower.includes("memory in the making")) {
    // Two independent block-level lines — guaranteed to break here no
    // matter what surrounding flex/grid/white-space rules are in play
    // (a plain <br /> can get collapsed by some flex/motion wrappers).
    return (
      <>
        <span className="block whitespace-nowrap">More Than a Gift.</span>
        <span className="block text-primary">
          A Memory in the <span className="italic">Making</span>.
        </span>
      </>
    );
  }

  const parts = titleStr.split(". ");
  if (parts.length > 1) {
    const firstPart = parts[0] + ".";
    const secondPart = parts.slice(1).join(". ");
    const words = secondPart.split(" ");
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      const remainingWords = words.slice(0, -1).join(" ");
      return (
        <>
          {firstPart}{isMobile ? <br className="block sm:hidden" /> : <br />}
          {remainingWords} <span className="text-primary italic">{lastWord}</span>
        </>
      );
    }
  }

  // Fallback for strings without a period (e.g. "CUSTOM BABY HOODED TOWELS")
  const words = titleStr.split(" ");
  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    const remainingWords = words.slice(0, -1).join(" ");
    return (
      <>
        {remainingWords} <span className="text-primary italic">{lastWord}</span>
      </>
    );
  }

  return titleStr;
}

// ---------------------------------------------------------------------------
// Description formatter
// Lets you manually control where the subtitle/description text breaks
// onto a new line, instead of relying on automatic word-wrap.
//
// Usage: put "\n" in the text anywhere you want a forced line break.
//   e.g. "Whether you're celebrating\nsomeone special or\ntreating yourself,
//         make it uniquely\npersonal."
// This works both for the hardcoded fallback string below AND for any
// subtitle coming from the CMS (slide.subtitle) — editors just need to type
// \n (or you can wire up a "line break" button in the CMS textarea).
// ---------------------------------------------------------------------------
function formatDescription(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export function Hero() {
  const [slides, setSlides] = useState<any[]>(STATIC_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [delay, setDelay] = useState(5000)

  // Adjust delay for mobile
  useEffect(() => {
    const handleResize = () => setDelay(window.innerWidth < 768 ? 2500 : 3500)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    async function loadSlides() {
      try {
        const res = await fetch("/api/admin/cms/hero-slides");
        if (res.ok) {
          const data = await res.json();
          const activeSlides = data.filter((slide: any) => slide.is_active);
          if (activeSlides.length > 0) {
            setSlides(
              activeSlides.map((slide: any, index: number) => ({
                id: index,
                desktopBg: slide.image_desktop,
                tabletImg: slide.image_desktop,
                mobileImg: slide.image_mobile || slide.image_desktop,
                ctaLink: slide.button_link || "/products",
                title: slide.title || "",
                subtitle: slide.subtitle || "",
                buttonText: slide.button_text || "Shop Collection",
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load slides from Supabase CMS, using static fallback:", err);
      }
    }
    loadSlides();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, delay)
    return () => clearInterval(id)
  }, [paused, next, delay])

  const slide = slides[current] || STATIC_SLIDES[0]

  const firstWithTitle = slides.find(s => s.title);
  const firstWithSub = slides.find(s => s.subtitle);
  const heroTitle = firstWithTitle?.title || "More Than a Gift. A Memory in the Making";

  // Manual line breaks via "\n" — matches the reference image's 4-line wrap:
  //   Whether you're celebrating
  //   someone special or
  //   treating yourself, make it uniquely
  //   personal.
  //
  // NOTE: forced to always use this hardcoded string (ignoring any CMS
  // subtitle) so the manual line breaks are guaranteed to show. Once this
  // is confirmed working, you can switch back to `firstWithSub?.subtitle ||`
  // as long as your CMS text also contains literal "\n" characters.
  const heroSubtitle =
    "Whether you're celebrating someone\nspecial or treating yourself, make it\nuniquely personal.";

  return (
    <section
      className="relative w-full h-[90dvh] lg:min-h-[640px] lg:h-[80vh] lg:max-h-[850px] flex flex-col lg:flex-row lg:items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Desktop background — cross-fades per slide ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
        {slides.map((s, idx) => (
          <div
            key={`desktop-bg-${s.id}`}
            className={`absolute inset-0 bg-cover bg-right transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url('${s.desktopBg}')` }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          Mobile / Tablet layout  (< lg)
          Image is now the full-bleed BACKGROUND of the
          whole section, with content overlaid on top —
          matching the "for every moment" reference look.
      ══════════════════════════════════════════════ */}
      <div className="lg:hidden relative w-full h-[100svh] overflow-hidden">

        {/* Background images — cross-fade, sit behind everything */}
        {slides.map((s, idx) => (
          <div
            key={`mobile-bg-${s.id}`}
            className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 ease-in-out sm:hidden ${idx === current ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url('${s.mobileImg}')` }}
          />
        ))}
        {slides.map((s, idx) => (
          <div
            key={`tablet-bg-${s.id}`}
            className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ease-in-out hidden sm:block ${idx === current ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url('${s.tabletImg}')` }}
          />
        ))}

        {/* Soft gradient so the copy stays legible over any photo */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/70 via-white/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/40 via-transparent to-transparent pointer-events-none" />

        {/* Decorative sparkles */}
        <div className="absolute top-16 right-10 text-primary/40 text-2xl z-10 select-none">✦</div>
        <div className="absolute top-1/2 right-6 text-primary/30 text-lg z-10 select-none">✦</div>

        {/* Content — overlaid directly on the background image, pinned near the top-left */}
        <div className="relative z-20 w-full h-full flex flex-col px-5 pt-10 sm:px-10 sm:pt-20">
          <motion.div
            className="flex flex-col items-start space-y-4 w-full max-w-md"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase"
              variants={headingVariants}
            >
              <span>✦</span>
              <span>For Every Moment That Matters</span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-foreground text-left leading-tight tracking-tight max-w-full"
              variants={headingVariants}
            >
              {formatHeroTitle(heroTitle, false)}
            </motion.h1>

            <div className="w-10 h-[2px] bg-primary/50" />

            <motion.p
              className="text-[14px] text-muted-foreground text-left max-w-xs whitespace-pre-line leading-relaxed"
              variants={descVariants}
            >
              {formatDescription(heroSubtitle)}
            </motion.p>

            <motion.div className="pt-1 flex flex-col items-start gap-3 w-full" variants={btnVariants}>
              <Link href="/products">
                <Button size="lg" className="text-base h-10 px-4 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-md transition-all">
                  Shop Now
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dots — pinned to bottom-left, on top of the background image */}
          <div className="mt-auto pb-10 flex justify-start">
            <Dots total={slides.length} active={current} onChange={setCurrent} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          Desktop layout  (≥ lg)
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:block w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-5 z-20 relative">

            {/* Decorative hearts — unchanged */}
            <div className="absolute -top-3 left-[32%] w-5 h-5 text-pink-400 opacity-70 transform rotate-12 animate-pulse hidden md:block">
              <HeartIcon />
            </div>
            <div className="absolute top-[42%] -right-8 w-6 h-6 text-pink-400 opacity-70 transform -rotate-12 animate-pulse hidden md:block">
              <HeartIcon />
            </div>

            {/* Eyebrow tag — matches reference image */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
              <span>✦</span>
              <span>For Every Moment That Matters</span>
            </div>

            {/* Animated content block */}
            <motion.div
              className="space-y-5"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
                variants={headingVariants}
              >
                {formatHeroTitle(heroTitle, false)}
              </motion.h1>

              <div className="w-12 h-[2px] bg-primary/50" />

              <motion.p
                className="text-sm text-muted-foreground max-w-md whitespace-pre-line"
                variants={descVariants}
              >
                {formatDescription(heroSubtitle)}
              </motion.p>

              <motion.div
                className="flex items-center gap-6 pt-2"
                variants={btnVariants}
              >
                <Link href="/products">
                  <Button size="lg" className="text-base h-12 px-8 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-md transition-all">
                    Shop Now
                  </Button>
                </Link>
                {slide.buttonText && slide.ctaLink && (
                  <Link href={slide.ctaLink}>
                    <span className="text-primary font-semibold flex items-center gap-2 text-base py-2 cursor-pointer hover:underline transition-all">
                      {slide.buttonText} <span className="text-lg">→</span>
                    </span>
                  </Link>
                )}
              </motion.div>
            </motion.div>

            {/* Badge strip — static, removed to replace with floating bar */}

            {/* Dots */}
            <div className="pt-1">
              <Dots total={slides.length} active={current} onChange={setCurrent} />
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>
      
      {/* ══════════════════════════════════════════════
          Floating Feature Bar
      ══════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-[95%] max-w-5xl mx-auto">
        <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-5 md:py-5 px-2 sm:px-6 md:px-12 grid grid-cols-2 md:flex justify-between items-center border border-border/40 gap-y-5 md:gap-y-0 gap-x-2 md:gap-x-0">
           {/* Item 1 */}
           <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
             <GiftIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
             <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
                Personalized<br/>Just for You
             </div>
           </div>
           
           <div className="hidden md:block w-px h-10 bg-border/60"></div>
           
           {/* Item 2 */}
           <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
             <StarIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
             <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
                Premium<br/>Quality
             </div>
           </div>

           <div className="hidden md:block w-px h-10 bg-border/60"></div>

           {/* Item 3 */}
           <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
             <HeartIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
             <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
                Made<br/>with Love
             </div>
           </div>

           <div className="hidden md:block w-px h-10 bg-border/60"></div>

           {/* Item 4 */}
           <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
             <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
             <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
                Secure<br/>Checkout
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}