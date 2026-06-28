import { Gift, Sparkles, Smile, Heart, Clock, HeartHandshake } from "lucide-react"

export function ProductFeaturesRow() {
  const features = [
    { icon: <Gift strokeWidth={1.5} className="w-8 h-8 text-primary group-hover:text-white" />, title: "Personalized\nJust For Him" },
    { icon: <Sparkles strokeWidth={1.5} className="w-8 h-8 text-primary group-hover:text-white" />, title: "Premium\nEmbroidery" },
    { icon: <HeartHandshake strokeWidth={1.5} className="w-8 h-8 text-primary group-hover:text-white" />, title: "Comfortable\n& Soft" },
    { icon: <Heart strokeWidth={1.5} className="w-8 h-8 text-primary group-hover:text-white" />, title: "Perfect For Every\nOccasion" },
    { icon: <Clock strokeWidth={1.5} className="w-8 h-8 text-primary group-hover:text-white" />, title: "Memories That\nLast Forever" },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Why You'll Love It <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-[120px] group">
              <div className="w-16 h-16 rounded-full bg-[#FDF8FF] flex items-center justify-center text-primary mb-4 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <p className="text-xs font-bold text-foreground leading-snug whitespace-pre-line group-hover:text-primary transition-colors">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
