import { ShieldCheck, Star, Heart, Gift } from "lucide-react"

export function StoreFeatures() {
  const features = [
    {
      icon: <Gift className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
      line1: "Personalized",
      line2: "Just for You",
    },
    {
      icon: <Star className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
      line1: "Premium",
      line2: "Quality",
    },
    {
      icon: <Heart className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
      line1: "Made",
      line2: "with Love",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
      line1: "Secure",
      line2: "Checkout",
    },
  ]

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-6 md:py-10">
      <div className="bg-white border border-gray-100 rounded-[24px] p-5 md:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 lg:gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 md:gap-4">
              <div className="shrink-0 text-[#4a0b70]">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-[#4a0b70] text-[12px] md:text-sm leading-tight">
                  {feature.line1}
                </span>
                <span className="font-sans font-bold text-[#4a0b70] text-[12px] md:text-sm leading-tight">
                  {feature.line2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
