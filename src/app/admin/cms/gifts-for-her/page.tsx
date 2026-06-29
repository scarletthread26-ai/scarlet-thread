"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function GiftsForHerCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="gifts-for-her"
      pageTitle="Gifts For Her settings"
      pageDescription="Customize Hero texts, headings, and background images on the Women's collection catalog."
      defaultTitle="Made for Her, Personalized with Love"
      defaultSubtitle="Thoughtful, personalized & embroidered gifts that celebrate the most special women in your life."
      defaultDesktopImage="/images/forher/scarlet-forherbanner-image.png"
      defaultMobileImage="/images/forher/scarlet-forhermobile.png"
    />
  );
}
