import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MasonryGrid() {
  const galleryItems = [
    {
      text: "Aditya",
      desc: "Navy Hoodie",
      height: "h-[320px]",
      image: "/images/aditya.png",
      textCol: "text-white",
    },
    {
      text: "Ananya",
      desc: "Pink Pouch",
      height: "h-[260px]",
      image: "/images/ananya.png",
      textCol: "text-[#880E4F]",
    },
    {
      text: "Good things take time",
      desc: "Tote Bag",
      height: "h-[380px]",
      image: "/images/goodthings.png",
      textCol: "text-[#5D4037]",
    },
    {
      text: "Little Princess",
      desc: "Onesie",
      height: "h-[280px]",
      image: "/images/litleprinces.png",
      textCol: "text-[#FF69B4]",
    },

    {
      text: "Mr. Perfect",
      desc: "White Towel",
      height: "h-[340px]",
      image: "/images/mrperfect.png",
      textCol: "text-black",
    },
    {
      text: "Eid Mubarak",
      desc: "Green Cushion",
      height: "h-[280px]",
      image: "/images/eid.png",
      textCol: "text-yellow-400",
    },
    {
      text: "Be You",
      desc: "Purple Hoodie",
      height: "h-[280px]",
      image: "/images/beyou.png",
      textCol: "text-[#4A148C]",
    },
    {
      text: "Rohan",
      desc: "Black Pouch",
      height: "h-[240px]",
      image: "/images/rohan.png",
      textCol: "text-white",
    },

    {
      text: "Diya",
      desc: "Cream Towel",
      height: "h-[280px]",
      image: "/images/diya.png",
      textCol: "text-[#D84315]",
    },
    {
      text: "Papa Box",
      desc: "Black Hamper",
      height: "h-[340px]",
      image: "/images/papa.png",
      textCol: "text-white",
    },
    {
      text: "My World My Love",
      desc: "Teddy Bear",
      height: "h-[300px]",
      image: "/images/mylovemyworld.png",
      textCol: "text-[#4E342E]",
    },
    {
      text: "Myra",
      desc: "Purple Towel",
      height: "h-[320px]",
      image: "/images/myra.png",
      textCol: "text-white",
    },

    {
      text: "Sunshine",
      desc: "Peach Hoodie",
      height: "h-[280px]",
      image: "/images/sunshine.png",
      textCol: "text-[#BF360C]",
    },
    {
      text: "A ♥",
      desc: "White Pouch",
      height: "h-[240px]",
      image: "/images/a.png",
      textCol: "text-black",
    },
    {
      text: "King",
      desc: "Black Cap",
      height: "h-[260px]",
      image: "/images/king.png",
      textCol: "text-white",
    },
    {
      text: "Best Brother Ever",
      desc: "Mug Hamper",
      height: "h-[300px]",
      image: "/images/brother.png",
      textCol: "text-white",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`w-full ${item.height} rounded-2xl break-inside-avoid relative overflow-hidden group cursor-pointer border border-black/5 shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.desc}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Texture Overlay */}
              <div className="absolute inset-0 bg-[url('/placeholder-texture.png')] opacity-20 mix-blend-overlay" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                {/* Reveal description on hover */}
                <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                  <span className="text-xs font-bold text-foreground uppercase tracking-widest">
                    {item.desc}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 font-bold border-primary/20 text-primary hover:bg-primary/5 hover:border-primary"
          >
            Load More Creations
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}