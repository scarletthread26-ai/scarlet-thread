"use client"

import React, { useMemo } from "react"
import { useHomepageSection } from "@/hooks/use-cms"
import { useSubcategories } from "@/hooks/use-subcategories"
import { OccasionsGrid, OccasionsGridSkeleton } from "@/components/sections/OccasionsGrid"

// Sequence of background and text colors to use for dynamic occasions
const COLOR_SCHEMES = [
  { bgColor: "bg-[#FAFAFA]", titleColor: "text-foreground" },
  { bgColor: "bg-[#FFF5F5]", titleColor: "text-red-500" },
  { bgColor: "bg-[#FDF8EB]", titleColor: "text-foreground" },
  { bgColor: "bg-[#F5F3FF]", titleColor: "text-primary" },
]

interface DynamicOccasionsGridProps {
  sectionKey: string
  fallbackSectionKey?: string
  defaultHeading: React.ReactNode
  defaultOccasions: any[]
  accentColor?: string
}

export function DynamicOccasionsGrid({ sectionKey, fallbackSectionKey, defaultHeading, defaultOccasions, accentColor = "text-primary" }: DynamicOccasionsGridProps) {
  const { data: mainSectionData, isLoading: isLoadingSection } = useHomepageSection(sectionKey)
  const { data: fallbackData, isLoading: isLoadingFallback } = useHomepageSection(fallbackSectionKey || "none")
  const { data: allCategories, isLoading: isLoadingCategories } = useSubcategories()

  const { occasions, heading } = useMemo(() => {
    // Prefer main section data, fall back to legacy section data if empty
    let sectionData = mainSectionData
    if (fallbackSectionKey && (!mainSectionData?.content?.occasions?.subcategories?.length) && fallbackData?.content?.occasions?.subcategories?.length) {
      sectionData = fallbackData
    }

    const rawHeading = sectionData?.content?.occasions?.heading
    const formattedHeading = rawHeading ? (
      <>
        {rawHeading.split(" ").slice(0, -1).join(" ")}{" "}
        <span className={accentColor}>{rawHeading.split(" ").slice(-1)}</span>
      </>
    ) : defaultHeading

    const selectedCategoryIds: string[] = sectionData?.content?.occasions?.subcategories || []

    if (selectedCategoryIds.length === 0) {
      return { occasions: [], heading: formattedHeading }
    }

    const mappedOccasions = selectedCategoryIds.map((id, index) => {
      const category = allCategories?.find(c => c.id === id)
      
      // Use the color scheme from the old hardcoded layout based on index to preserve page-specific styles
      const fallbackItem = defaultOccasions[index] || COLOR_SCHEMES[index % COLOR_SCHEMES.length]

      if (!category) return null

      return {
        id: category.id,
        title: category.name,
        description: category.description || "Discover more",
        bgColor: fallbackItem.bgColor,
        titleColor: fallbackItem.titleColor,
        image: category.image_url || "/images/placeholder.png",
        href: `/products?category=${category.slug}`
      }
    }).filter(Boolean) as any[]

    return { occasions: mappedOccasions, heading: formattedHeading }
  }, [mainSectionData, fallbackData, fallbackSectionKey, allCategories, defaultHeading, defaultOccasions, accentColor])

  if (isLoadingSection || isLoadingFallback || isLoadingCategories) {
    return <OccasionsGridSkeleton />
  }

  if (occasions.length === 0) {
    return null
  }

  return <OccasionsGrid occasions={occasions} heading={heading} />
}
