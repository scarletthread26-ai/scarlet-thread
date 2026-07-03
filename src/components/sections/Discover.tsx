"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const columnImages = [
  "/images/scarlet-about5.png",
  "/images/scarlet-about.png",
  "/images/scarlet-about1.png",
  "/images/scarlet-about2.png",
  "/images/scarlet-about3.png",
  "/images/scarlet-about4.png",
]

function ImageColumn({
  images,
  direction = "up",
  duration = 30,
}: {
  images: string[]
  direction?: "up" | "down"
  duration?: number
}) {
  const allImages = [...images, ...images]

  const animate =
    direction === "up"
      ? { y: ["0%", "-50%"] }
      : { y: ["-50%", "0%"] }

  return (
    <div className="flex-1 overflow-hidden relative h-[340px] sm:h-[420px] lg:h-[480px] rounded-[5px]">
      <div
        className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #fffafc, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #fffafc, transparent)" }}
      />

      <motion.div
        className="flex flex-col gap-2 sm:gap-3"
        animate={animate}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {allImages.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <img
              src={src}
              alt="Scarlet gift"
              className="w-full object-cover aspect-[3/4]"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function formatDiscoverTitle(titleStr: string, isDesktop: boolean) {
  if (!titleStr) return "";
  const lower = titleStr.toLowerCase();
  if (lower === "discover the scarlet thread") {
    return (
      <>
        Discover {isDesktop && <br className="hidden md:block" />} The Scarlet <span className="text-primary">Thread</span>
      </>
    );
  }
  // Fallback: split by space and highlight last word
  const words = titleStr.split(" ");
  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    const remaining = words.slice(0, -1).join(" ");
    return (
      <>
        {remaining} <span className="text-primary">{lastWord}</span>
      </>
    );
  }
  return titleStr;
}

export function Discover() {
  const [sectionData, setSectionData] = React.useState<any>(null);
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [aboutRes, galleryRes] = await Promise.all([
          fetch("/api/admin/cms/homepage-sections?key=about"),
          fetch("/api/gallery")
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
      } catch (err) {
        console.warn("Failed to load discover / gallery data:", err);
      }
    }
    loadData();
  }, []);

  const title = sectionData?.title || "Discover The Scarlet Thread";
  const subtitle = sectionData?.subtitle || "Bringing Your Gift Ideas To Life";
  const description = sectionData?.content?.description || "At Scarlet, we believe the most meaningful gifts are the ones created with love, thought and personal touch. Whether it's a heartfelt gift for him, a thoughtful gift for her, a precious keepsake for a new born, a surprise gift for a toddler or unforgettable baby shower gifts, we turn emotions into meaningful gifts that hold memories forever.";
  const buttonText = sectionData?.content?.button_text || "Read Our Story";
  const buttonLink = sectionData?.content?.button_link || "/about";
  const getActiveImages = () => {
    if (galleryImages.length === 0) {
      return columnImages;
    }
    if (galleryImages.length < 6) {
      const merged = [...galleryImages];
      const needed = 6 - galleryImages.length;
      for (let i = 0; i < needed; i++) {
        merged.push(columnImages[i % columnImages.length]);
      }
      return merged;
    }
    return galleryImages;
  };

  const activeImages = getActiveImages();

  const col1Images = activeImages;
  const col2Images = activeImages.length >= 3 
    ? [...activeImages.slice(Math.floor(activeImages.length / 3)), ...activeImages.slice(0, Math.floor(activeImages.length / 3))]
    : activeImages;
  const col3Images = activeImages.length >= 3
    ? [...activeImages.slice(Math.floor(activeImages.length * 2 / 3)), ...activeImages.slice(0, Math.floor(activeImages.length * 2 / 3))]
    : activeImages;

  return (
    <section className="pt-20 pb-8 md:py-24 bg-[#F9F5FF]">
      <div className="w-full max-w-[1400px] mx-auto  px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 lg:gap-20 items-center">

          {/* Mobile/Tab: subheading → heading → image → description */}
          {/* Desktop: content left, image right (natural order) */}

          {/* Subheading — always first */}
          <div className="text-primary font-medium tracking-wide flex items-center gap-2 order-1 lg:hidden">
            <HeartIcon className="w-4 h-4 fill-primary/20" />
            {subtitle}
          </div>

          {/* Heading — second on mobile/tab */}
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight order-2 lg:hidden">
            {formatDiscoverTitle(title, false)}
          </h2>

          {/* Image columns — third on mobile/tab, right side on desktop */}
          <div className="order-3 lg:order-2 flex gap-2 sm:gap-3 overflow-hidden lg:col-start-2 lg:row-start-1 lg:row-span-1">
            <ImageColumn images={col1Images} direction="up"   duration={28} />
            <ImageColumn images={col2Images} direction="down" duration={22} />
            <ImageColumn images={col3Images} direction="up"   duration={32} />
          </div>

          {/* Full content block — desktop only (left side) */}
          <div className="space-y-6 order-4 lg:order-1 lg:col-start-1 lg:row-start-1">
            {/* Subheading — desktop only */}
            <div className="text-primary font-medium tracking-wide items-center gap-2 hidden lg:flex">
              <HeartIcon className="w-4 h-4 fill-primary/20" />
              {subtitle}
            </div>

            {/* Heading — desktop only */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight hidden lg:block">
              {formatDiscoverTitle(title, true)}
            </h2>

            {/* Description — fourth on mobile/tab, part of left block on desktop */}
            <p className="text-sm text-muted-foreground leading-relaxed ">
              {description}
            </p>

            <div className="pt-2 lg:pt-4 flex justify-center md:justify-start">
              <Button
                nativeButton={false}
                render={<Link href={buttonLink} />}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[5px] px-8 h-12 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {buttonText}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}