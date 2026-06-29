"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHomepageSection, useSaveHomepageSection } from "@/hooks/use-cms";
import { useProducts } from "@/hooks/use-products";
import {
  ArrowLeft,
  Save,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Loader2,
  Check,
  Package,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function FeaturedProductsEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: section, isLoading: sectionLoading } = useHomepageSection("featured-products");
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const saveMutation = useSaveHomepageSection();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (section) {
      setTitle(section.title || "Our Most Loved Gifts");
      setSubtitle(section.subtitle || "Carefully selected and thoughtfully crafted to bring joy...");
      setSelectedIds(section.content?.product_ids || []);
    }
  }, [section]);

  const isLoading = sectionLoading || productsLoading;

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading || !section) return false;

    const originalTitle = section.title || "Our Most Loved Gifts";
    const originalSubtitle = section.subtitle || "Carefully selected and thoughtfully crafted to bring joy...";
    const originalIds = section.content?.product_ids || [];

    const idsChanged = selectedIds.length !== originalIds.length || 
      selectedIds.some((id, idx) => id !== originalIds[idx]);

    return (
      title !== originalTitle ||
      subtitle !== originalSubtitle ||
      idsChanged
    );
  }, [title, subtitle, selectedIds, section, isLoading]);

  const handleDiscard = () => {
    if (section) {
      setTitle(section.title || "Our Most Loved Gifts");
      setSubtitle(section.subtitle || "Carefully selected and thoughtfully crafted to bring joy...");
      setSelectedIds(section.content?.product_ids || []);
    }
    toast.info("Changes discarded");
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.filter((p) => p.is_active);
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.is_active &&
        (p.name?.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  // Map selected IDs back to complete product objects
  const selectedProducts = useMemo(() => {
    return selectedIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as any[];
  }, [selectedIds, products]);

  const handleSelectProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      // Toggle off / remove
      setSelectedIds(selectedIds.filter((id) => id !== productId));
      return;
    }

    if (selectedIds.length >= 4) {
      toast.error("You can select a maximum of 4 featured products.");
      return;
    }

    setSelectedIds([...selectedIds, productId]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedIds(selectedIds.filter((id) => id !== productId));
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= selectedIds.length) return;

    const copy = [...selectedIds];
    const temp = copy[idx];
    copy[idx] = copy[newIdx];
    copy[newIdx] = temp;
    setSelectedIds(copy);
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      section_key: "featured-products",
      title,
      subtitle,
      content: {
        product_ids: selectedIds,
      },
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isTabbed ? (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/cms"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg outline-none transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Featured Products Selector
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Select and order exactly 4 products to feature on the homepage.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || !isDirty}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Search, select and arrange exactly 4 products for the homepage best-sellers grid.
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || !isDirty}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="h-64 w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 animate-pulse rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: configure title/subtitle and show chosen products */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Section Headers
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder="Our Most Loved Gifts"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Section Subtitle
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder="Describe these products..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Selected products in order */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Selected products ({selectedProducts.length} / 4)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Re-order products to change how they show up on the grid.
                  </p>
                </div>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-450 dark:text-slate-550 flex flex-col items-center justify-center gap-2">
                  <Package className="w-8 h-8 text-slate-350" />
                  <p className="text-sm font-medium">No products selected yet</p>
                  <p className="text-xs">Search and select products from the sidebar on the right.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {selectedProducts.map((prod, idx) => {
                      const image = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80";
                      return (
                        <motion.div
                          key={prod.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 rounded-xl group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-250/20 bg-white dark:bg-slate-900">
                              <img src={image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-850 dark:text-slate-150 leading-tight">
                                {prod.name}
                              </h4>
                              <p className="text-xs text-slate-450 mt-0.5">
                                {prod.categories?.name || "Apparel"} • AED {prod.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === selectedProducts.length - 1}
                              className="p-1.5 rounded-lg text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveProduct(prod.id)}
                              className="p-1.5 rounded-lg text-slate-450 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 cursor-pointer ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right sidebar: Search and select all products */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Search Products
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select up to 4 items from the available products catalog.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name or sku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                />
              </div>

              {/* Products list */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredProducts.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-450 dark:text-slate-550">
                    No products found
                  </p>
                ) : (
                  filteredProducts.map((prod) => {
                    const isSelected = selectedIds.includes(prod.id);
                    const image = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80";
                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? "bg-purple-50/40 dark:bg-purple-950/15 border-purple-200 dark:border-purple-900/60"
                            : "bg-white dark:bg-slate-900 border-slate-200/50 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200/40 bg-slate-50">
                            <img src={image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="max-w-[130px] sm:max-w-none">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">
                              AED {prod.price}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 ml-2">
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850">
                              <Plus className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Shopify style unsaved changes bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-800/80 backdrop-blur-md"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
              You have unsaved changes
            </span>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDiscard}
                className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition duration-150 cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/10"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
