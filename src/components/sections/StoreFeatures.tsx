import { ShieldCheck, Sparkles, Truck, CreditCard } from "lucide-react"

export function StoreFeatures() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Premium Quality",
      description: "Finest materials & attention to detail",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Customization",
      description: "Personalized just for you",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Fast Delivery",
      description: "Safe & quick delivery across India",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Secure Payment",
      description: "100% secure payment guaranteed",
    },
  ]

  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-10 bg-[#F9F5FF]">
      <div className="bg-[#FAF6FC] border border-primary/5 rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-primary/10 shrink-0">
                {feature.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-sans font-bold text-primary text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
