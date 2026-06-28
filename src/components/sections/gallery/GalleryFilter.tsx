import { Grip, UserRound, Sparkles, Baby, Gift, Package, Home } from "lucide-react"

export function GalleryFilter() {
  const tabs = [
    { id: "all", label: "All Creations", icon: <Grip className="w-0 h-0" />, active: true },
    { id: "him", label: "For Him", icon: <UserRound className="w-4 h-4" />, active: false },
    { id: "her", label: "For Her", icon: <Sparkles className="w-4 h-4" />, active: false },
    { id: "kids", label: "Kids & Babies", icon: <Baby className="w-4 h-4" />, active: false },
    { id: "occasions", label: "Special Occasions", icon: <Gift className="w-4 h-4" />, active: false },
    { id: "hampers", label: "Hampers & Boxes", icon: <Package className="w-4 h-4" />, active: false },
    { id: "home", label: "Home & Living", icon: <Home className="w-4 h-4" />, active: false },
  ]

  return (
    <section className="py-8 bg-white sticky top-20 z-40 border-b border-border/50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar justify-start xl:justify-center">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                tab.active 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-white text-foreground/70 border-border hover:border-primary/50 hover:text-primary"
              }`}
            >
              <span className="text-[#8059BB]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}
