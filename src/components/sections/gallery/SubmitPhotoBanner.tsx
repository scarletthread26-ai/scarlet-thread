import { Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SubmitPhotoBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-[#FDF8FF] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center border border-primary/10 shadow-sm relative p-8 md:p-12 gap-8">
          {/* Left: Camera Icon Graphic */}
          <div className="md:w-1/4 flex justify-center relative">
            <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center relative z-10 border border-primary/5">
              <Camera className="w-12 h-12 text-primary" strokeWidth={1.5} />

              {/* Decorative sparkles */}
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-primary/40" />
              <Sparkles className="absolute -bottom-2 -left-4 w-6 h-6 text-primary/40" />
            </div>
            {/* Background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
          </div>

          {/* Center: Text Content */}
          <div className="md:w-2/4 text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
              See Your Gift in Our Next Gallery!
            </h2>
            <p className="text-sm text-foreground/80 mb-6">
              Share a photo of your personalized gift and get featured.
              <br className="hidden md:block" />
              Tag us on Instagram or use{" "}
              <span className="font-bold text-primary">#TheScarletThread</span>
            </p>
            <Button className="rounded-[5px] px-6 py-2 bg-primary hover:bg-primary/90">
              Share Your Creation <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Right: Polaroid Mockups hanging */}
          <div className="md:w-1/4 flex justify-center md:justify-end relative h-48 w-full overflow-visible z-10 mt-8 md:mt-0">
            {/* Polaroids */}
            <div className="md:w-1/4 relative flex justify-center md:justify-end">
              <Image
                src="/images/line.png"
                alt="Customer photo"
                width={280}
                height={220}
                className="
                w-auto
                h-auto
                max-w-[280px]
                object-contain
                -rotate-3
                md:translate-y-[-20px]
                md:shadow-lg
                md:border border-[#8059BB]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
