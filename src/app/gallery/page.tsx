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
  const { data: categoriesData } = await supabase
    .from("gallery_categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const galleryCategories = categoriesData || [];
  const galleryCatIds = galleryCategories.map((c) => c.id);

  // Fetch actual categories to get parent info
  const { data: actualCategories } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .in("id", galleryCatIds.length ? galleryCatIds : ["00000000-0000-0000-0000-000000000000"]);

  // Fetch gallery items joining categories
  let query = supabase
    .from("gallery_items")
    .select("*, category:gallery_categories(id, name, slug)")
    .eq("is_active", true);

  if (category && category !== "all") {
    // category here is the main category ID
    // Find all subcategories that belong to this main category
    const subcatIds = actualCategories?.filter(c => c.parent_id === category).map(c => c.id) || [];
    query = query.in("category_id", subcatIds.length ? subcatIds : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data: items = [] } = await query.order("display_order", { ascending: true });



  const parentIds = actualCategories?.map((c) => c.parent_id).filter(Boolean) || [];

  const { data: parentCategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .in("id", parentIds.length ? parentIds : ["00000000-0000-0000-0000-000000000000"]);

  // Format parent categories for the filter tabs
  const filterCategories = parentCategories?.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  })).sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroGallery />
      <GalleryFilter categories={filterCategories} activeCategory={category} />
      <MasonryGrid items={items || []} activeCategory={category} />
    </div>
  );
}
