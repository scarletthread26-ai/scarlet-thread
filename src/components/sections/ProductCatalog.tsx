"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, SlidersHorizontal, ArrowRight, Loader2, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/ProductCard";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "@/hooks/use-realtime";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [sortBy, setSortBy] = useState("featured");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const queryClient = useQueryClient();

  // Listen to realtime changes on products table
  useRealtime({
    table: "products",
    onPayload: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Listen to realtime changes on product_variants table
  useRealtime({
    table: "product_variants",
    onPayload: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const matchedCat = categories.find(
        (c) =>
          c.slug?.toLowerCase() === categoryParam.toLowerCase() ||
          c.name?.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchedCat) {
        setSelectedCategoryId(matchedCat.id);
      }
    }
  }, [categoryParam, categories]);

  // Filter active products
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.is_active);
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    let result = selectedCategoryId === "All"
      ? activeProducts
      : activeProducts.filter((p) => p.category_id === selectedCategoryId);

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - default sorting
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [activeProducts, selectedCategoryId, sortBy]);

  const activeCategories = useMemo(() => {
    return categories.filter((c) => c.is_active);
  }, [categories]);

  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-sm font-semibold text-slate-400">Loading catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          All <span className="text-purple-600">Gifts</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
          Browse our complete collection of beautiful, custom embroidered gifts crafted to order.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                Filter by Category
              </h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategoryId("All")}
                  className={`text-left text-xs px-3 py-2.5 rounded-xl font-bold transition-all duration-200 block cursor-pointer ${
                    selectedCategoryId === "All"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                      : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600"
                  }`}
                >
                  All Products
                </button>
                {activeCategories.map((cat) => {
                  const isActive = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`text-left text-xs px-3 py-2.5 rounded-xl font-bold transition-all duration-200 block cursor-pointer ${
                        isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                          : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <div className="flex-1 space-y-6">
          {/* Controls row */}
          <div className="flex flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredProducts.length} results
            </span>

            {/* Sorting Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span>Sort by: {sortOptions.find((o) => o.value === sortBy)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {sortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setSortDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-30 space-y-0.5"
                    >
                      {sortOptions.map((opt) => {
                        const isSelected = opt.value === sortBy;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg font-bold flex items-center justify-between ${
                              isSelected
                                ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE CATEGORY LIST */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setSelectedCategoryId("All")}
              className={`shrink-0 text-xs px-4 py-2 rounded-full font-bold transition ${
                selectedCategoryId === "All"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              All Products
            </button>
            {activeCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`shrink-0 text-xs px-4 py-2 rounded-full font-bold transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Grid Layout */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3">
              <span className="text-slate-400 font-bold text-sm">No products found in this category.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product, idx) => {
                const formattedProduct = {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  compare_at_price: product.compare_at_price,
                  image: product.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
                  imagePlaceholder: product.name ? product.name.split(" ")[0] : "Custom",
                  rating: product.rating || 0,
                  reviews: product.reviews || 0,
                  category: product.categories?.name || "Custom apparel",
                  slug: product.slug,
                  bestSeller: product.best_seller
                };

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                  >
                    <ProductCard 
                      product={formattedProduct} 
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
