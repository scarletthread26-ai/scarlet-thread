import { DynamicOccasionsGrid } from "@/components/sections/DynamicOccasionsGrid"

const defaultOccasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make his birthday extra special",
    bgColor: "bg-[#FAFAFA]",
    titleColor: "text-foreground",
    image: "/images/forhimOccassion/scarlet-blackbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your special bond",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    image: "/images/forhimOccassion/scarlet-redbox2.png",
  },
  {
    id: "fathers-day",
    title: "Father's Day Gifts",
    description: "Thank him for being your hero",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-foreground",
    image: "/images/forhimOccassion/scarlet-superdeal.png",
  },
  {
    id: "boyfriend",
    title: "Gifts For Boyfriend",
    description: "Because he deserves the best",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/forhimOccassion/scarlet-hubbyhoodie.png",
  },
]

export function OccasionsGridHim() {
  return (
    <DynamicOccasionsGrid 
      sectionKey="gifts-for-him" 
      fallbackSectionKey="gift-for-him"
      defaultHeading={<>Gifts For Every <span className="text-primary">Occasion</span></>} 
      defaultOccasions={defaultOccasions}
    />
  )
}
