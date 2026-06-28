import { Truck, ShieldCheck, RefreshCcw, HeadphonesIcon } from "lucide-react"

export function BottomValuePropsKids() {
  const props = [
    {
      icon: <Truck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Fast Delivery",
      desc: "Quick & safe delivery across India"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Secure Payment",
      desc: "100% secure payment with trusted gateways"
    },
    {
      icon: <RefreshCcw className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Easy Returns",
      desc: "Hassle-free returns and exchanges"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Customer Support",
      desc: "We're here to help you at every step"
    }
  ]

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-border/40">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6">
          {props.map((prop, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-2 sm:gap-3 md:gap-4 group
                ${
                  index < props.length - 1
                    ? "md:border-r md:border-border/40 md:pr-6"
                    : ""
                }
              `}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF0F5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-primary/10">
                {prop.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#6E3B9B] mb-0.5 sm:mb-1">{prop.title}</h4>
                <p className="text-[10px] sm:text-[11px] leading-tight text-muted-foreground">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
