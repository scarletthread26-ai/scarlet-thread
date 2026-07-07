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

const FALLBACK_IMAGES: Record<string, GalleryItem[]> = {
  kids: [
    { id: 'kids-1', title: "Myra", description: null, media_url: "/images/scarlet-babie1.png", media_type: "image", display_order: 1 },
    { id: 'kids-2', title: "Aarav", description: null, media_url: "/images/scarlet-gift.png", media_type: "image", display_order: 2 },
    { id: 'kids-3', title: "Teddy", description: null, media_url: "/images/scarlet-babie3.png", media_type: "image", display_order: 3 },
    { id: 'kids-4', title: "Little Princess", description: null, media_url: "/images/scarlet-loved4.png", media_type: "image", display_order: 4 },
    { id: 'kids-5', title: "Princess", description: null, media_url: "/images/scarlet-loved5.png", media_type: "image", display_order: 5 },
    { id: 'kids-6', title: "Siya", description: null, media_url: "/images/scarlet-loved6.png", media_type: "image", display_order: 6 },
  ],
  him: [
    { id: 'him-1', title: "Papa Hoodie", description: null, media_url: "/images/forhimpage/scarlet-papahoodie.png", media_type: "image", display_order: 1 },
    { id: 'him-2', title: "Mr Perfect", description: null, media_url: "/images/forhimpage/scarlet-mrperfect.png", media_type: "image", display_order: 2 },
    { id: 'him-3', title: "Papa Pouch", description: null, media_url: "/images/forhimpage/scarlet-papapouch.png", media_type: "image", display_order: 3 },
    { id: 'him-4', title: "Amazing Hoodie", description: null, media_url: "/images/forhimpage/scarlet-amazinghoodie.png", media_type: "image", display_order: 4 },
    { id: 'him-5', title: "King Hoodie", description: null, media_url: "/images/forhimpage/scarlet-kinghoodie.png", media_type: "image", display_order: 5 },
    { id: 'him-6', title: "Mannat", description: null, media_url: "/images/forhimpage/scarlet-mannat.png", media_type: "image", display_order: 6 },
    { id: 'him-7', title: "Dad Hero", description: null, media_url: "/images/forhimpage/scarlet-dadhero.png", media_type: "image", display_order: 7 },
  ],
  her: [
    { id: 'her-1', title: "Girl Boss", description: null, media_url: "/images/occassion/scarlet-girlboss.png", media_type: "image", display_order: 1 },
    { id: 'her-2', title: "Be You", description: null, media_url: "/images/occassion/scarlet-beyou.png", media_type: "image", display_order: 2 },
    { id: 'her-3', title: "Happy Soul", description: null, media_url: "/images/occassion/scarlet-happysoul.png", media_type: "image", display_order: 3 },
    { id: 'her-4', title: "Stay Positive", description: null, media_url: "/images/occassion/scarlet-staypositive.png", media_type: "image", display_order: 4 },
    { id: 'her-5', title: "Gift Box", description: null, media_url: "/images/occassion/scarlet-box.png", media_type: "image", display_order: 5 },
    { id: 'her-6', title: "Proud", description: null, media_url: "/images/occassion/scarlet-proud.png", media_type: "image", display_order: 6 },
  ]
};

export function MasonryGrid({ items, activeCategory = "all" }: MasonryGridProps) {
  let displayItems = items;

  if (displayItems.length === 0) {
    if (activeCategory === "all") {
      displayItems = [
        ...(FALLBACK_IMAGES.kids || []),
        ...(FALLBACK_IMAGES.him || []),
        ...(FALLBACK_IMAGES.her || [])
      ];
    } else if (FALLBACK_IMAGES[activeCategory]) {
      displayItems = FALLBACK_IMAGES[activeCategory];
    }
  }

  // If database and fallbacks have no custom items, we can show a nice empty message or prompt
  if (displayItems.length === 0) {
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
          {displayItems.map((item, idx) => {
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