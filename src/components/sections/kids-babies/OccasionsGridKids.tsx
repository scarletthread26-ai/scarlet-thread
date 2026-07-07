"use client"

import { OccasionsGrid } from "@/components/sections/OccasionsGrid"

const occasions = [
  {
    id: "baby-shower",
    title: "Baby Shower Gifts",
    description: "Welcome the little one with a personalized touch.",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-[#9B59B6]",
    image: "/images/scarlet-occassion1.png",
  },
  {
    id: "first-birthday",
    title: "First Birthday Gifts",
    description: "Celebrate their first big milestone in style.",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/scarlet-occassion2.png",
  },
  {
    id: "naming-ceremony",
    title: "Naming Ceremony Gifts",
    description: "Make their special day even more memorable.",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/scarlet-occassion3.png",
  },
  {
    id: "return-gifts",
    title: "Return Gifts",
    description: "Thank your loved ones with cute & useful gifts.",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/scarlet-occassion4.png",
  },
]

export function OccasionsGridKids() {
  return <OccasionsGrid occasions={occasions} heading="Gifts For Every Occasion" />
}
