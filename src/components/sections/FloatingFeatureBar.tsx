import { GiftIcon, HeartIcon, StarIcon, ShieldCheck } from "lucide-react"

interface FloatingFeatureBarProps {
  className?: string
}

export function FloatingFeatureBar({ className }: FloatingFeatureBarProps) {
  return (
    <div className={className || "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-[95%] max-w-5xl mx-auto"}>
      <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-5 md:py-5 px-2 sm:px-6 md:px-12 grid grid-cols-2 md:flex justify-between items-center border border-border/40 gap-y-5 md:gap-y-0 gap-x-2 md:gap-x-0">
        {/* Item 1 */}
        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
          <GiftIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
          <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
            Personalized<br />Just for You
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border/60"></div>

        {/* Item 2 */}
        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
          <StarIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
          <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
            Premium<br />Quality
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border/60"></div>

        {/* Item 3 */}
        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
          <HeartIcon className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
          <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
            Made<br />with Love
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border/60"></div>

        {/* Item 4 */}
        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
          <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-[#4a148c]" strokeWidth={1.5} />
          <div className="text-[#4a148c] text-[11px] md:text-[13px] font-semibold leading-tight text-left">
            Secure<br />Checkout
          </div>
        </div>
      </div>
    </div>
  )
}
