import { HeroGallery } from "@/components/sections/gallery/HeroGallery";
import { GalleryFilter } from "@/components/sections/gallery/GalleryFilter";
import { MasonryGrid } from "@/components/sections/gallery/MasonryGrid";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Always fetch fresh data — categories & items update immediately

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "all" } = await searchParams;
  const supabase = await createClient();

  // Fetch active gallery categories
  const { data: categories = [] } = await supabase
    .from("gallery_categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // Fetch gallery items joining categories
  let query = supabase
    .from("gallery_items")
    .select("*, category:gallery_categories(id, name, slug)")
    .eq("is_active", true);

  if (category && category !== "all") {
    const targetCat = categories?.find((c) => c.slug === category);
    if (targetCat) {
      query = query.eq("category_id", targetCat.id);
    } else {
      // Invalid category slug, return empty
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  }

  const { data: items = [] } = await query.order("display_order", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen">
      <HeroGallery />
      <GalleryFilter categories={categories || []} activeCategory={category} />
      <MasonryGrid items={items || []} activeCategory={category} />
    </div>
  );
}
