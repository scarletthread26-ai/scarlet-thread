import { Info, Ruler, Sparkles, Truck, ShieldCheck, ThumbsUp, RefreshCcw, HandHeart } from "lucide-react"

export function ProductInfoAccordion() {
  const tabs = [
    { id: "details", label: "Product Details", icon: <Info className="w-4 h-4" /> },
    { id: "size", label: "Size & Fit", icon: <Ruler className="w-4 h-4" /> },
    { id: "care", label: "Care Instructions", icon: <Sparkles className="w-4 h-4" /> },
    { id: "delivery", label: "Delivery Info", icon: <Truck className="w-4 h-4" /> },
  ]

  const detailsList = [
    { icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "Premium quality soft cotton fleece" },
    { icon: <ThumbsUp className="w-4 h-4 text-primary" />, text: "High durability embroidery" },
    { icon: <RefreshCcw className="w-4 h-4 text-primary" />, text: "Unisex regular fit" },
    { icon: <Ruler className="w-4 h-4 text-primary" />, text: "Available in multiple sizes" },
    { icon: <HandHeart className="w-4 h-4 text-primary" />, text: "Proudly Made in India 🇮🇳" },
  ]

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, idx) => (
          <button 
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
              idx === 0 
                ? "bg-[#FDF8FF] text-primary border-primary/20" 
                : "bg-white text-muted-foreground border-border hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-border/50">
        <ul className="space-y-4">
          {detailsList.map((item, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-foreground/80">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
