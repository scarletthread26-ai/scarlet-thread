import { Heart } from "lucide-react"
import Image from "next/image"

export function ProductOccasionsGrid() {
  const occasions = [
    { title: "Birthday",       image: "/images/productpage/scarlet-cake.png"    },
    { title: "Father's Day",   image: "/images/productpage/scarlet-fathersday.png"  },
    { title: "Anniversary",    image: "/images/productpage/scarlet-anniversary.png" },
    { title: "Thank You Gift", image: "/images/productpage/scarlet-thankyou.png"},
    { title: "Eid Special",    image: "/images/productpage/scarlet-eid.png"},
    { title: "Just Because",   image: "/images/productpage/scarlet-justbecause.png"},
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Perfect For Every Occasion <Heart className="w-5 h-5 text-primary fill-primary" />
          </h2>
        </div>

        <div className="bg-[#FAFAFA] border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occ, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="w-full aspect-[4/3] rounded-2xl bg-white border border-border overflow-hidden mb-3 shadow-sm relative group-hover:border-primary/50 transition-all group-hover:shadow-md group-hover:scale-[1.03]">
                  <Image
                    src={occ.image}
                    alt={occ.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors text-center">
                  {occ.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
