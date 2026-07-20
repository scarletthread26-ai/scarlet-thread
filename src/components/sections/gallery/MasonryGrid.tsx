import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: string;
  display_order: number;
}

interface MasonryGridProps {
  items: GalleryItem[];
  activeCategory?: string;
}

const HEIGHT_CLASSES = ["h-[320px]", "h-[260px]", "h-[380px]", "h-[280px]", "h-[340px]"];


export function MasonryGrid({ items, activeCategory = "all" }: MasonryGridProps) {


  // If database and fallbacks have no custom items, we can show a nice empty message or prompt
  if (items.length === 0) {
    return (
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 flex items-center justify-center rounded-full mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800">No creations uploaded yet</h3>
          <p className="text-sm text-slate-500 mt-1.5">
            Log in to the Admin Dashboard and add lookbook items to populate this showcase.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery-grid" className="py-12 bg-white scroll-mt-[190px]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {items.map((item, idx) => {
            const height = HEIGHT_CLASSES[idx % HEIGHT_CLASSES.length];
            return (
              <div
                key={item.id}
                className={`w-full ${height} rounded-2xl break-inside-avoid relative overflow-hidden group cursor-pointer border border-black/5 shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Overlay (Fades in on hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content (Bottom-centered, fades and slides up on hover) */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 p-5 z-10 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                  <h4 className="text-white font-bold text-base leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}