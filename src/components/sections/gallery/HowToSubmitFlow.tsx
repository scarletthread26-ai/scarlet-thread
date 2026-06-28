import { Camera, Send, Heart, Star, ArrowRight } from "lucide-react"

export function HowToSubmitFlow() {
  const steps = [
    { icon: <Camera strokeWidth={1.5} className="w-6 h-6" />, title: "Step 1", desc: "Take a clear photo of your gift." },
    { icon: <Send strokeWidth={1.5} className="w-6 h-6" />, title: "Step 2", desc: "Share it with us on Instagram or Email." },
    { icon: <Heart strokeWidth={1.5} className="w-6 h-6" />, title: "Step 3", desc: "We review & select the best ones." },
    { icon: <Star strokeWidth={1.5} className="w-6 h-6" />, title: "Step 4", desc: "Get featured in our gallery & stories." },
  ]

  return (
    <section className="py-12 bg-white pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-heading font-bold flex items-center justify-center gap-2">
            How to Submit Your Photos
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10 max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex md:flex-col items-center md:text-center gap-4 md:gap-0 flex-1 relative w-full md:w-auto">
              
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary/20 md:mb-4 z-10 relative shrink-0">
                {step.icon}
              </div>
              
              <div className="text-left md:text-center">
                <h4 className="font-bold text-xs text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
              </div>
              
              {/* Horizontal Dashed Line / Arrow for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-7 left-1/2 w-full pl-7 items-center justify-center -mt-2 pointer-events-none z-0">
                   <div className="w-full border-t border-dashed border-primary/30"></div>
                   <ArrowRight className="text-primary/30 w-4 h-4 -ml-2" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info Footer */}
        <div className="text-center text-xs text-foreground/80 font-medium">
          <p>
            Email: <a href="mailto:hello@thescarletthread.com" className="text-primary hover:underline">hello@thescarletthread.com</a>
            <span className="mx-4 text-muted-foreground">|</span>
            Instagram: <a href="https://instagram.com/thescarletthread_official" className="hover:text-primary transition-colors">@thescarletthread_official</a>
          </p>
        </div>

      </div>
    </section>
  )
}
