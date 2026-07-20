import { DynamicOccasionsGrid } from "@/components/sections/DynamicOccasionsGrid"

const defaultOccasions = [
  {
    id: "baby-shower",
    title: "Baby Shower Gifts",
    description: "Welcome the little one with a personalized touch.",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-[#9B59B6]",
    image: "/images/forKidsOccassion/scarlet-occassion1.png",
  },
  {
    id: "first-birthday",
    title: "First Birthday Gifts",
    description: "Celebrate their first big milestone in style.",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/forKidsOccassion/scarlet-occassion2.png",
  },
  {
    id: "naming-ceremony",
    title: "Naming Ceremony Gifts",
    description: "Make their special day even more memorable.",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/forKidsOccassion/scarlet-occassion3.png",
  },
  {
    id: "return-gifts",
    title: "Return Gifts",
    description: "Thank your loved ones with cute & useful gifts.",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/forKidsOccassion/scarlet-occassion4.png",
  },
]

export function OccasionsGridKids() {
  return (
    <DynamicOccasionsGrid 
      sectionKey="kids-babies" 
      fallbackSectionKey="kids-and-babies"
      defaultHeading={<>Gifts For Every <span className="text-primary">Occasion</span></>} 
      defaultOccasions={defaultOccasions}
    />
  )
}
