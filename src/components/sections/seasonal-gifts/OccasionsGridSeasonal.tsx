import { DynamicOccasionsGrid } from "@/components/sections/DynamicOccasionsGrid"

const defaultOccasions = [
  {
    id: "christmas",
    title: "Christmas & New Year",
    description: "Spread warmth with holiday cheer",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/occassion/scarlet-occasionbox2.png",
  },
  {
    id: "eid",
    title: "Eid Celebrations",
    description: "Thoughtful gifts for family & friends",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/occassion/scarlet-occasionbox3.png",
  },
  {
    id: "diwali",
    title: "Diwali & Festivals",
    description: "Bring light and joy to your festive season",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/occassion/scarlet-occasionbox.png",
  },
  {
    id: "national-day",
    title: "UAE National Day",
    description: "Show your pride with custom items",
    bgColor: "bg-[#E6F4EA]",
    titleColor: "text-green-600",
    image: "/images/occassion/scarlet-occasionbox4.png",
  },
]

export function OccasionsGridSeasonal() {
  return (
    <DynamicOccasionsGrid 
      sectionKey="seasonal-gifts" 
      defaultHeading={<>Gifts For Every <span className="text-primary">Celebration</span></>} 
      defaultOccasions={defaultOccasions}
    />
  )
}
