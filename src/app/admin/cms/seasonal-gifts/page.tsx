"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function SeasonalGiftsCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="seasonal-gifts"
      pageTitle="Seasonal Gifts Settings"
      pageDescription="Customize Hero texts, headings, and background images on the Seasonal collection catalog."
      defaultTitle="Celebrate Every Season"
      defaultSubtitle="Personalized embroidered gifts for holidays, festivals, and special seasonal celebrations."
      defaultDesktopImage="/images/seasonal-banner.png"
      defaultMobileImage="/images/seasonal-banner-mobile.png"
    />
  );
}
