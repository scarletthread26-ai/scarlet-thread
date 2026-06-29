"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function KidsBabiesCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="kids-babies"
      pageTitle="Kids & Babies settings"
      pageDescription="Customize Hero texts, headings, and background images on the Children's collection catalog."
      defaultTitle="Little Moments, Made Personal"
      defaultSubtitle="Adorable embroidered gifts for your little ones, stitched with love and care."
      defaultDesktopImage="/images/scrlet-babiesbanne.png"
      defaultMobileImage="/images/scrlet-babiesbanne.png"
    />
  );
}
