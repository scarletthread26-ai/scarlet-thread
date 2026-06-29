import Link from "next/link";
import { Grip, UserRound, Sparkles, Baby, Gift, Package, Home } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GalleryFilterProps {
  categories: Category[];
  activeCategory: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  all: <Grip className="w-4 h-4" />,
  him: <UserRound className="w-4 h-4" />,
  her: <Sparkles className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
  occasions: <Gift className="w-4 h-4" />,
  hampers: <Package className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
};

export function GalleryFilter({ categories, activeCategory }: GalleryFilterProps) {
  const tabs = [
    { id: "all", label: "All Creations", icon: ICON_MAP.all, active: activeCategory === "all" || !activeCategory },
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      icon: ICON_MAP[cat.slug] || <Grip className="w-4 h-4" />,
      active: activeCategory === cat.slug,
    })),
  ];

  return (
    <section className="py-8 bg-white sticky top-20 z-40 border-b border-border/50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar justify-start xl:justify-center">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/gallery?category=${tab.id}`}
              scroll={false}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                tab.active
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-foreground/70 border-border hover:border-primary/50 hover:text-primary"
              }`}
            >
              <span className={tab.active ? "text-white" : "text-[#8059BB]"}>{tab.icon}</span>
              {tab.label}
            </Link>
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
  );
}
