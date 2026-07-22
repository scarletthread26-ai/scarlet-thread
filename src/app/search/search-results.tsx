"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";
import { 
  Search, 
  X, 
  Loader2, 
  SlidersHorizontal, 
  ChevronDown, 
  Check, 
  ShoppingBag,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get active query from URL parameter 'q'
  const urlQuery = searchParams.get("q") || "";
  
  // Local input state for the search bar
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Synchronize local input state with URL parameter updates
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Fetch all products using existing react-query hook
  const { data: products = [], isLoading } = useProducts();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) {
      router.push("/search");
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/search");
  };

  // Filter active products by the query match
  const searchFilteredProducts = useMemo(() => {
    const activeProducts = products.filter((p) => p.is_active);
    
    if (!urlQuery.trim()) {
      return [];
    }

    const q = urlQuery.toLowerCase().trim();
    let results = activeProducts.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const catMatch = p.categories?.name?.toLowerCase().includes(q);
      return nameMatch || descMatch || skuMatch || catMatch;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results = [...results].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured
        results = [...results].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return results;
  }, [products, urlQuery, sortBy]);

  // Extract featured products for empty state recommendation
  const recommendedProducts = useMemo(() => {
    return products
      .filter((p) => p.is_active && p.featured)
      .slice(0, 4);
  }, [products]);

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-16">
      
      {/* Search Bar Header Component */}
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-10 md:mb-16">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3 h-3" /> Search Store
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Find the Perfect <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-650">Gifts</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">
          Search custom embroidered sweatshirts, towels, keepsake baby gifts, pouches and more.
        </p>

        {/* Input Bar Form */}
        <form onSubmit={handleSearchSubmit} className="w-full relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by product name, category, SKU, details..."
              className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-10 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-semibold tracking-wide px-6 rounded-xl transition duration-200 shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Main Results Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[30vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <span className="text-sm font-semibold text-slate-400">Searching inventory...</span>
        </div>
      ) : urlQuery.trim() ? (
        <div className="space-y-6">
          {/* Header Controls Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 gap-3 shadow-sm">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Showing <span className="text-slate-800 dark:text-slate-100 font-bold">{searchFilteredProducts.length}</span> results for &ldquo;<span className="text-primary font-bold">{urlQuery}</span>&rdquo;
            </div>

            {/* Sorting Widget */}
            {searchFilteredProducts.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sort by: {sortOptions.find((o) => o.value === sortBy)?.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                              className={`w-full text-left text-xs px-3 py-2 rounded-lg font-bold flex items-center justify-between transition ${
                                isSelected
                                  ? "bg-primary/5 text-primary"
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
            )}
          </div>

          {/* Search Grid Layout */}
          {searchFilteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm p-6 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">No products found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                We couldn&rsquo;t find anything matching &ldquo;{urlQuery}&rdquo;. Try checking the spelling or using broader search terms.
              </p>
              <button
                onClick={handleClearSearch}
                className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl transition hover:opacity-95 shadow-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-4 md:gap-6 max-sm:border-t max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 max-sm:bg-white dark:max-sm:bg-slate-900">
              {searchFilteredProducts.map((product, idx) => {
                const formattedProduct = {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  compare_at_price: product.compare_at_price,
                  image: product.images?.[0]?.url || "",
                  imagePlaceholder: product.name ? product.name.split(" ")[0] : "Custom",
                  rating: product.rating || 0,
                  reviews: product.reviews || 0,
                  category: product.categories?.name || "",
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
                    className={`max-sm:border-b max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 ${idx % 2 === 0 ? "max-sm:border-r" : ""}`}
                  >
                    <ProductCard 
                      product={formattedProduct} 
                      className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Query Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm p-6 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Start Searching</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Type keywords above to discover personalized embroidered items, gifts, hoodies and more.
          </p>
        </div>
      )}

      {/* Recommended Products Showcase (Shown when search has no results, or when no query is typed) */}
      {(searchFilteredProducts.length === 0 || !urlQuery.trim()) && recommendedProducts.length > 0 && (
        <div className="mt-16 md:mt-24 space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Popular Embroidered <span className="text-primary">Gifts</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-4 md:gap-6 max-sm:border-t max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 max-sm:bg-white dark:max-sm:bg-slate-900">
            {recommendedProducts.map((product, idx) => {
              const formattedProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                compare_at_price: product.compare_at_price,
                image: product.images?.[0]?.url || "",
                imagePlaceholder: product.name ? product.name.split(" ")[0] : "Custom",
                rating: product.rating || 0,
                reviews: product.reviews || 0,
                category: product.categories?.name || "",
                slug: product.slug,
                bestSeller: product.best_seller
              };

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`max-sm:border-b max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 ${idx % 2 === 0 ? "max-sm:border-r" : ""}`}
                >
                  <ProductCard 
                    product={formattedProduct} 
                    className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
