"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function GiftsForHimCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="gifts-for-him"
      pageTitle="Gifts For Him settings"
      pageDescription="Customize Hero texts, headings, and background images on the Men's collection catalog."
      defaultTitle="Make Every Gift Personal"
      defaultSubtitle="Thoughtfully embroidered gifts for husbands, boyfriends, fathers, brothers and best friends."
      defaultDesktopImage="/images/forhimpage/scarlet-forhimbanner.png"
      defaultMobileImage="/images/forhimpage/scarlet-mobilebanner.png"
    />
  );
}
