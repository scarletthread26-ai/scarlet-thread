"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function GalleryCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="gallery"
      pageTitle="Gallery Page settings"
      pageDescription="Customize Hero texts, headings, and background images on the Gallery showcase."
      defaultTitle="Real Gifts, Real Smiles, Real Memories."
      defaultSubtitle="Every gift has a story, and every stitch holds a memory. Here's a glimpse of the love we've helped create."
      defaultDesktopImage="/images/gallery-hero.png"
      defaultMobileImage="/images/galler-mobile-banner.png"
    />
  );
}
