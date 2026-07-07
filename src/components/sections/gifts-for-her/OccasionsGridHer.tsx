"use client"

import { OccasionsGrid } from "@/components/sections/OccasionsGrid"

const occasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make her birthday extra special",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/occassion/scarlet-occasionbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your beautiful journey",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/occassion/scarlet-occasionbox2.png",
  },
  {
    id: "mothers-day",
    title: "Mother's Day Gifts",
    description: "Thank her for everything",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/occassion/scarlet-occasionbox3.png",
  },
  {
    id: "valentines",
    title: "Valentine's Gifts",
    description: "Send her love in the most special way",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-pink-600",
    image: "/images/occassion/scarlet-occasionbox4.png",
  },
]

export function OccasionsGridHer() {
  return <OccasionsGrid occasions={occasions} heading="Gifts For Every Occasion" />
}