"use client"

import { OccasionsGrid } from "@/components/sections/OccasionsGrid"

const occasions = [
  {
    id: "calligraphy",
    title: "Islamic Calligraphy",
    description: "Elegant calligraphic embroidery on linens",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-amber-600",
    image: "/images/occassion/scarlet-occasionbox3.png",
  },
  {
    id: "prayer",
    title: "Prayer & Blessings",
    description: "Blessings for homes, friends, and family",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/occassion/scarlet-occasionbox.png",
  },
  {
    id: "verses",
    title: "Quranic Verses",
    description: "Inspiring verses stitched with high devotion",
    bgColor: "bg-[#E6F4EA]",
    titleColor: "text-green-600",
    image: "/images/occassion/scarlet-occasionbox4.png",
  },
  {
    id: "spiritual",
    title: "Spiritual Keepsakes",
    description: "Celebrate milestones & spiritual journeys",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/occassion/scarlet-occasionbox2.png",
  },
]

export function OccasionsGridFaith() {
  return <OccasionsGrid occasions={occasions} heading={<>Gifts of <span className="text-primary">Devotion</span> & Blessings</>} />
}
