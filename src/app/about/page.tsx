"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Loader2, 
  Heart, 
  Sparkles, 
  Award, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  Laptop, 
  Gift, 
  Users, 
  Star, 
  CheckSquare, 
  ChevronRight, 
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

const placeholderImages = [
  "/images/scarlet-about5.png",
  "/images/scarlet-about.png",
  "/images/scarlet-about1.png",
  "/images/scarlet-about2.png",
  "/images/scarlet-about3.png",
  "/images/scarlet-about4.png"
];

export default function AboutPage() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [aboutRes, galleryRes, settingsRes] = await Promise.all([
          fetch("/api/admin/cms/homepage-sections?key=about"),
          fetch("/api/gallery"),
          fetch("/api/admin/settings")
        ]);

        if (aboutRes.ok) {
          const aboutJson = await aboutRes.json();
          if (aboutJson) {
            setSectionData(aboutJson);
          }
        }

        if (galleryRes.ok) {
          const galleryJson = await galleryRes.json();
          if (Array.isArray(galleryJson)) {
            const images = galleryJson
              .filter((item: any) => item.media_type === "image" && item.media_url)
              .map((item: any) => item.media_url);
            setGalleryImages(images);
          }
        }

        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson) {
            setSettings(settingsJson);
          }
        }
      } catch (err) {
        console.warn("Failed to load about / gallery / settings data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Fallbacks with dynamic SEO keyword placement
  const title = "Discover The Scarlet Thread";
  const subtitle = "Bringing Your Gift Ideas To Life";
  const description = "At Scarlet Thread, we believe every gift should tell a story. We create beautifully personalized gifts UAE residents adore, celebrating life's most meaningful moments—from birthdays and anniversaries to newborn arrivals, weddings, and special milestones. Every product is crafted with love, attention to detail, and a personal touch that makes every gift unforgettable.";

  const getActiveImages = () => {
    if (galleryImages.length === 0) {
      return placeholderImages;
    }
    if (galleryImages.length < 6) {
      const merged = [...galleryImages];
      const needed = 6 - galleryImages.length;
      for (let i = 0; i < needed; i++) {
        merged.push(placeholderImages[i % placeholderImages.length]);
      }
      return merged;
    }
    return galleryImages;
  };

  const images = getActiveImages();
  
  // Format WhatsApp Link dynamically
  const whatsappNum = settings?.whatsapp_number || "971501872337";
  const cleanedNum = whatsappNum.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanedNum}?text=${encodeURIComponent(
    "Hello Scarlet Thread, I am looking to create a personalized gift and would like to share my details!"
  )}`;

  return (
    <div className="bg-[#FAF8FF] dark:bg-slate-950 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-24 bg-gradient-to-b from-[#F3EBFF] via-[#FAF8FF] to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold text-xs tracking-wide select-none"
              >
                <Heart className="w-3.5 h-3.5 fill-purple-500/20 text-purple-650" />
                <span>{subtitle}</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 dark:text-slate-55 leading-tight"
              >
                {title}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-1.5 w-24 bg-purple-600 rounded-full origin-left"
              />

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-slate-600 dark:text-slate-350 text-sm md:text-base leading-relaxed whitespace-pre-line"
              >
                {description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link 
                  href="/products" 
                  className={buttonVariants({ 
                    variant: "default", 
                    className: "rounded-xl shadow-lg shadow-purple-600/10 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-5 h-auto text-sm" 
                  })}
                >
                  Shop Collections
                </Link>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={buttonVariants({ 
                    variant: "outline", 
                    className: "rounded-xl border-purple-200 dark:border-slate-800 font-bold hover:bg-purple-50/50 cursor-pointer bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 px-8 py-5 h-auto text-sm" 
                  })}
                >
                  Discuss on WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Lookbook Gallery Column */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {images.slice(0, 6).map((src: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(107,70,193,0.06)] border border-purple-100/40 dark:border-slate-800 aspect-[3/4] bg-slate-100 dark:bg-slate-900 group"
                  >
                    <img
                      src={src}
                      alt={`Lookbook ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-t border-slate-100/40 dark:border-slate-900/40">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Image Card */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 shadow-purple-950/5 aspect-[4/5] bg-slate-100 dark:bg-slate-900"
              >
                <img
                  src={images[1] || "/images/scarlet-about.png"}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent" />
              </motion.div>
            </div>

            {/* Story Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase block">Our Roots</span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 dark:text-slate-55">
                  Our Story
                </h2>
              </div>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-350 text-sm md:text-base leading-relaxed font-normal">
                <p className="font-semibold text-slate-850 dark:text-slate-100 text-base md:text-lg">
                  Scarlet Thread was created with one simple idea—to make gifting more personal across the emirates, establishing our brand as a trusted <strong className="text-purple-600 dark:text-purple-400 font-extrabold">gift shop UAE</strong> locals love.
                </p>
                <p>
                  In a world filled with ordinary presents, we wanted to design <strong className="text-purple-600 dark:text-purple-400 font-extrabold">unique gifts UAE</strong> families will cherish forever, carrying true emotions, memories, and meaning.
                </p>
                <p>
                  Whether it's one of our cozy <strong className="text-purple-600 dark:text-purple-400 font-extrabold">embroidered hoodies UAE</strong> collections, custom <strong className="text-purple-600 dark:text-purple-400 font-extrabold">personalized towels UAE</strong> sets, a personalized baby towel, a custom cushion, or <strong className="text-purple-600 dark:text-purple-400 font-extrabold">personalized keepsakes</strong> that capture love, every item is carefully crafted with <strong className="text-purple-600 dark:text-purple-400 font-extrabold">custom embroidery UAE</strong> techniques to celebrate relationships and special occasions.
                </p>
                <p>
                  Today, Scarlet Thread proudly serves customers as a premier destination for <strong className="text-purple-600 dark:text-purple-400 font-extrabold">customized gifts Dubai</strong> and UAE-wide, helping families, friends, and loved ones create lasting memories through personalized gifts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-[#FAF8FF] dark:bg-slate-900/50">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">What Sets Us Apart</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">
              Why Choose Scarlet Thread
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              Why Choose Scarlet Thread for <strong className="text-slate-700 dark:text-slate-350 font-bold">custom gifts UAE</strong>? We combine premium craftsmanship, custom design mockups, and stress-free shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_25px_rgba(107,70,193,0.04)] border border-purple-100/30 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-50">Premium Personalization</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Every product is customized specifically for your order, turning your ideas into tangible keepsakes.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_25px_rgba(107,70,193,0.04)] border border-purple-100/30 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-50">Quality Materials</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                We use carefully selected, premium materials to ensure every gift looks beautiful and lasts for years.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_25px_rgba(107,70,193,0.04)] border border-purple-100/30 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-50">Design Approval</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Before production begins, you'll receive a digital mockup for approval, ensuring your gift is exactly how you imagined it.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_25px_rgba(107,70,193,0.04)] border border-purple-100/30 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-50">UAE-Wide Delivery</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Fast and reliable delivery across the UAE with secure packaging and gift-ready presentation.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. Our Process Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">Step-By-Step Guide</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">
              How Your Personalized Gift Comes To Life
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              We guide you through a fully collaborative customization process, keeping you in charge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md z-10 select-none relative group-hover:scale-105 transition-transform duration-300">
                1
                <div className="absolute -inset-1 rounded-full bg-purple-600/10 -z-10 animate-ping opacity-30" />
              </div>
              <div className="bg-[#FAF8FF] dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 shadow-xs w-full min-h-[170px] flex flex-col justify-center">
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-50 mb-2">Select & Prepay</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Find your favorite base product (hoodie, tee, cap, etc.) and complete secure payment to lock in your order slot.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md z-10 select-none relative group-hover:scale-105 transition-transform duration-300">
                2
              </div>
              <div className="bg-[#FAF8FF] dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 shadow-xs w-full min-h-[170px] flex flex-col justify-center">
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-50 mb-2">Share Details on WhatsApp</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Check your email confirmation for your Order # and a direct link to chat with us on WhatsApp. Share your design idea!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md z-10 select-none relative group-hover:scale-105 transition-transform duration-300">
                3
              </div>
              <div className="bg-[#FAF8FF] dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 shadow-xs w-full min-h-[170px] flex flex-col justify-center">
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-50 mb-2">Mockup & Approval</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  We create a realistic digital mockup for your review. Give us your final "Thumbs Up" before we craft!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md z-10 select-none relative group-hover:scale-105 transition-transform duration-300">
                4
              </div>
              <div className="bg-[#FAF8FF] dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 shadow-xs w-full min-h-[170px] flex flex-col justify-center">
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-50 mb-2">We Craft & Ship</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Once approved, our team produces your unique gift with care and ships it straight to your door!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Our Promise Section */}
      <section className="py-10 max-w-[1280px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 md:p-14 text-center overflow-hidden shadow-xl"
        >
          {/* Subtle background glow graphics */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <div className="relative max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <Heart className="w-12 h-12 text-pink-400 fill-pink-400/20 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight">Our Promise</h2>
            <div className="h-0.5 w-16 bg-pink-400 rounded-full" />
            <p className="text-base md:text-xl font-medium leading-relaxed italic text-purple-100">
              "Every personalized gift we create represents someone's special moment. That's why we focus on quality craftsmanship, thoughtful design, clear communication, and customer satisfaction from the moment you place your order until your gift reaches its destination."
            </p>
            <p className="text-sm text-purple-200/90 font-bold uppercase tracking-wider">
              We're committed to creating gifts that people will cherish for years to come.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 6. Product Categories Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">Curated Collections</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">
              Personalized Gifts For Every Occasion
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Find the perfect keepsake for your loved ones. Discover premium <strong className="text-slate-700 dark:text-slate-355">personalized gifts UAE</strong> shoppers adore, including <strong className="text-slate-700 dark:text-slate-355">baby gift ideas UAE</strong> recommends, custom <strong className="text-slate-700 dark:text-slate-355">birthday gifts UAE</strong> selections, and <strong className="text-slate-700 dark:text-slate-355">anniversary gifts UAE</strong> bundles.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {[
              { title: "Gifts For Him", link: "/gifts-for-him", desc: "For husbands, fathers & friends" },
              { title: "Gifts For Her", link: "/gifts-for-her", desc: "For wives, mothers & daughters" },
              { title: "Kids & Babies", link: "/kids-babies", desc: "Delicate & adorable essentials" },
              { title: "Birthday Gifts", link: "/products?category=birthday", desc: "Celebrate milestones in style" },
              { title: "Anniversary Gifts", link: "/products?category=anniversary", desc: "Thoughtful couples' keepsakes" },
              { title: "Wedding Gifts", link: "/products?category=wedding", desc: "Cherished gifts for newlyweds" },
              { title: "Baby Shower Gifts", link: "/products?category=baby-shower", desc: "Cute personalized baby gifts" },
              { title: "Corporate Gifts", link: "/products?category=corporate", desc: "Premium custom embroidered logos" },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-[#FAF8FF] dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 hover:border-purple-650 dark:hover:border-purple-500 transition-all duration-300 flex flex-col justify-between group h-32 md:h-36 shadow-xs hover:shadow-md"
              >
                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1">
                    {cat.desc}
                  </p>
                </div>
                <Link href={cat.link} className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-purple-650 dark:text-purple-400 select-none cursor-pointer mt-2 w-fit">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* 7. Our Numbers Section */}
      <section className="py-16 md:py-24 bg-[#FAF8FF] dark:bg-slate-900/50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">Our Milestones</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">
              Our Story in Numbers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We pride ourselves on delivery excellence, customer smiles, and premium products.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            
            {[
              { num: "300+", label: "Happy Customers", icon: Users },
              { num: "100+", label: "Five-Star Reviews", icon: Star },
              { num: "500+", label: "Gifts Delivered", icon: Gift },
              { num: "UAE-Wide", label: "Reliable Shipping", icon: Truck },
              { num: "Premium", label: "Quality Materials", icon: Award },
              { num: "Secure", label: "Online Payments", icon: CreditCard },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-purple-100/40 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center space-y-2 shadow-xs hover:shadow-sm transition-shadow">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-450 block tracking-tight">
                    {stat.num}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="bg-white dark:bg-slate-950 py-24 md:py-32 w-full border-t border-purple-100/30 dark:border-slate-900/40">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">Get Started Today</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
                Ready To Create Something Special?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Create a personalized gift that will be remembered forever. We specialize in custom embroidery UAE residents love, crafting memorable, timeless gifts for all.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link 
                href="/products" 
                className={buttonVariants({ 
                  variant: "default", 
                  className: "w-full sm:w-auto rounded-[18px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 h-[56px] text-base text-center shadow-lg shadow-purple-600/10 cursor-pointer flex items-center justify-center" 
                })}
              >
                Shop Now
              </Link>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={buttonVariants({ 
                  variant: "outline", 
                  className: "w-full sm:w-auto rounded-[18px] border border-emerald-500 hover:bg-emerald-50/15 text-emerald-600 dark:text-emerald-400 font-bold px-8 h-[56px] text-base cursor-pointer gap-2 bg-transparent inline-flex items-center justify-center" 
                })}
              >
                <MessageSquare className="w-5 h-5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                <span>Contact Us on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
