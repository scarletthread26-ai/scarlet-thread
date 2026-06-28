import { Heart } from "lucide-react"

export function ProductLivePreview() {
  return (
    <section className="py-16 bg-white border-t border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Preview Your Personalization <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
          <p className="text-muted-foreground mt-2">See how your gift will look</p>
        </div>

        <div className="bg-[#FDF8FF] rounded-[32px] p-8 md:p-12 border border-primary/10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            
            {/* Left: Full Mockup */}
            <div className="flex-1 w-full flex items-center justify-center relative">
               {/* Visual representation of the hoodie from the design */}
              <div className="w-full max-w-[300px] aspect-square bg-[#1A237E] rounded-[30%_30%_10%_10%] relative flex items-center justify-center shadow-2xl">
                 <div className="text-center scale-75">
                    <div className="text-yellow-400 text-3xl mb-2">👑</div>
                    <div className="text-white font-heading italic text-5xl font-bold mb-1">King</div>
                    <div className="text-white font-heading text-4xl font-bold tracking-widest uppercase">
                      DAD <span className="text-red-500">❤</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: Zoomed Detail */}
            <div className="flex-[1.2] w-full">
              <div className="bg-[#1A237E] rounded-2xl w-full aspect-[16/9] flex items-center justify-center shadow-xl border-4 border-white/10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('/placeholder-texture.png')] opacity-20 mix-blend-overlay"></div>
                 
                 <div className="text-center z-10 scale-125">
                    <div className="text-yellow-400 text-4xl mb-2 drop-shadow-md">👑</div>
                    <div className="text-white font-heading italic text-7xl font-bold mb-1 drop-shadow-md">King</div>
                    <div className="text-white font-heading text-6xl font-bold tracking-widest uppercase drop-shadow-md">
                      DAD <span className="text-red-500">❤</span>
                    </div>
                 </div>
              </div>
            </div>
            
          </div>
          
          <p className="text-center text-xs text-primary/60 mt-8 relative z-10 italic">
            Please note: Colors may slightly vary from the actual product due to screen settings and lighting.
          </p>
          
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        </div>
      </div>
    </section>
  )
}
