"use client";

import React from "react";
import { useProduct } from "@/hooks/use-products";
import { ProductBreadcrumbs } from "@/components/product/ProductBreadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { ProductDetailsReviewsSplit } from "@/components/product/ProductDetailsReviewsSplit";
import { RelatedProductsCarousel } from "@/components/product/RelatedProductsCarousel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const { data: product, isLoading } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-sm font-semibold text-slate-400">Loading product details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <ProductBreadcrumbs product={product} />
        
        {/* Top Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4 mb-16">
          
          {/* Left: Gallery */}
          <div className="flex-1 lg:w-1/2">
             <ProductGallery product={product} />
          </div>

          {/* Right: Configurator */}
          <div className="flex-1 lg:w-1/2">
             <ProductConfigurator product={product} />
          </div>
          
        </div>
      </div>

      <ProductDetailsReviewsSplit product={product} />
      <RelatedProductsCarousel />
    </div>
  );
}
