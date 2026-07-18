"use client";

import React from "react";
import { CategoryLandingEditor } from "@/components/admin/category-landing-editor";

export default function FaithBasedCmsPage() {
  return (
    <CategoryLandingEditor
      sectionKey="faith-based"
      pageTitle="Faith Based Gifts Settings"
      pageDescription="Customize Hero texts, headings, and background images on the Faith Based collection catalog."
      defaultTitle="Gifts of Faith & Love"
      defaultSubtitle="Beautifully embroidered spiritual and faith-based gifts that carry deep meaning."
      defaultDesktopImage="/images/faith-banner.png"
      defaultMobileImage="/images/faith-banner-mobile.png"
    />
  );
}
