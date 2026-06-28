import { HeroGallery } from "@/components/sections/gallery/HeroGallery"
import { GalleryFilter } from "@/components/sections/gallery/GalleryFilter"
import { MasonryGrid } from "@/components/sections/gallery/MasonryGrid"
import { SubmitPhotoBanner } from "@/components/sections/gallery/SubmitPhotoBanner"
import { HowToSubmitFlow } from "@/components/sections/gallery/HowToSubmitFlow"

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroGallery />
      <GalleryFilter />
      <MasonryGrid />
    </div>
  )
}
