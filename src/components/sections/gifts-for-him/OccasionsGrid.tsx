"use client"

import { OccasionsGrid } from "@/components/sections/OccasionsGrid"

const occasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make his birthday extra special",
    bgColor: "bg-[#FAFAFA]",
    titleColor: "text-foreground",
    image: "/images/forhimpage/scarlet-blackbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your special bond",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/forhimpage/scarlet-redbox2.png",
  },
  {
    id: "fathers-day",
    title: "Father's Day Gifts",
    description: "Thank him for being your hero",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-foreground",
    image: "/images/forhimpage/scarlet-superdeal.png",
  },
  {
    id: "boyfriend",
    title: "Gifts For Boyfriend",
    description: "Because he deserves the best",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/forhimpage/scarlet-hubbyhoodie.png",
  },
]

export function OccasionsGridHim() {
  return <OccasionsGrid occasions={occasions} heading={<>Gifts For Every <span className="text-primary">Occasion</span></>} />
}
