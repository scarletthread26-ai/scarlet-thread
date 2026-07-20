import { DynamicOccasionsGrid } from "@/components/sections/DynamicOccasionsGrid"

const defaultOccasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make her birthday extra special",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/forherOccassion/scarlet-occasionbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your beautiful journey",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/forherOccassion/scarlet-occasionbox2.png",
  },
  {
    id: "mothers-day",
    title: "Mother's Day Gifts",
    description: "Thank her for everything",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/forherOccassion/scarlet-occasionbox3.png",
  },
  {
    id: "valentines",
    title: "Valentine's Gifts",
    description: "Send her love in the most special way",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-pink-600",
    image: "/images/forherOccassion/scarlet-occasionbox4.png",
  },
]

export function OccasionsGridHer() {
  return (
    <DynamicOccasionsGrid 
      sectionKey="gifts-for-her" 
      fallbackSectionKey="gift-for-her"
      defaultHeading={<>Gifts For Every <span className="text-primary">Occasion</span></>}
      defaultOccasions={defaultOccasions}
    />
  )
}