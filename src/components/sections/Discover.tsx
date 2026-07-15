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

      />
      <div
        className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"

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
  const description = sectionData?.content?.description || "At Scarlet, we create meaningful, personalized gifts made with love—from gifts for him and her to keepsakes for newborns, toddlers, and baby showers.";
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
    <section className="pt-24  pb-8 bg-white  ">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* MOBILE VIEW (up to lg) */}
        <div className="flex flex-col gap-6 lg:hidden">
          {/* 1. Subtitle badge */}
          <div className="flex text-primary font-medium text-sm tracking-wide items-center gap-2">
            <HeartIcon className="w-4 h-4 fill-primary/20" />
            {subtitle}
          </div>

          {/* 2. Heading */}
          <h2 className="text-[32px] sm:text-4xl font-heading font-bold text-foreground leading-tight -mt-3">
            {formatDiscoverTitle(title, true)}
          </h2>

          {/* 3. Description */}
          <p className="text-sm text-muted-foreground leading-relaxed -mt-2">
            {description}
          </p>

          {/* 4. Button */}
          <div className="flex justify-start">
            <Button
              nativeButton={false}
              render={<Link href={buttonLink} />}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[10px] px-8 h-12 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {buttonText}
            </Button>
          </div>

          {/* 5. 2-column image grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {activeImages.slice(0, 8).map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm aspect-[4/3]">
                <img
                  src={src}
                  alt="Scarlet gift"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Content Left */}
          <div className="space-y-6">
            <div className="text-primary font-medium tracking-wide flex items-center gap-2">
              <HeartIcon className="w-4 h-4 fill-primary/20" />
              {subtitle}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {formatDiscoverTitle(title, true)}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed ">
              {description}
            </p>
            <div className="pt-4 flex justify-start">
              <Button
                nativeButton={false}
                render={<Link href={buttonLink} />}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[10px] px-8 h-12 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {buttonText}
              </Button>
            </div>
          </div>

          {/* Image Right */}
          <div className="flex gap-3 overflow-hidden">
            <ImageColumn images={col1Images} direction="up" duration={28} />
            <ImageColumn images={col2Images} direction="down" duration={22} />
            <ImageColumn images={col3Images} direction="up" duration={32} />
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