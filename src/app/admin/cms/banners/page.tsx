"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useBanners, useSaveBanners } from "@/hooks/use-cms";
import { ArrowLeft, Save, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function BannersEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: initialBanners = [], isLoading } = useBanners();
  const saveMutation = useSaveBanners();
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    if (initialBanners.length > 0) {
      setBanners(initialBanners);
    }
  }, [initialBanners]);

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading || !initialBanners.length) return false;

    if (banners.length !== initialBanners.length) return true;

    for (let i = 0; i < banners.length; i++) {
      const b = banners[i];
      const initB = initialBanners[i];
      if (!initB) return true;
      if (
        b.title !== initB.title ||
        b.subtitle !== initB.subtitle ||
        b.image_url !== initB.image_url ||
        b.image_mobile_url !== initB.image_mobile_url ||
        b.link_url !== initB.link_url ||
        b.banner_type !== initB.banner_type ||
        b.is_active !== initB.is_active ||
        b.display_order !== initB.display_order
      ) {
        return true;
      }
    }

    return false;
  }, [banners, initialBanners, isLoading]);

  const handleDiscard = () => {
    if (initialBanners.length > 0) {
      setBanners(initialBanners);
    }
    toast.info("Changes discarded");
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: `temp-${Date.now()}`,
      title: "New Promotional Banner",
      subtitle: "Bespoke handcrafted custom embroidery.",
      image_url: "",
      image_mobile_url: "",
      link_url: "/products",
      banner_type: "featured_banner",
      is_active: true,
      display_order: banners.length,
    };
    setBanners([...banners, newBanner]);
  };

  const handleRemoveBanner = (idx: number) => {
    setBanners(banners.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx: number, field: string, value: any) => {
    const updated = banners.map((banner, i) => {
      if (i === idx) {
        return { ...banner, [field]: value };
      }
      return banner;
    });
    setBanners(updated);
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync(banners);
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
                Promotional Banners
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Configure grid promo cards and collections headers.
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
            Manage grid promo banners and collections hero placements.
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
        <div className="h-64 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {banners.map((banner, idx) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm relative group flex flex-col md:flex-row gap-6"
            >
              {/* Left Column: Reordering and Image uploads */}
              <div className="w-full md:w-80 space-y-4 shrink-0">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Banner #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRemoveBanner(idx)}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition cursor-pointer animate-fade-in"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Desktop Banner Image
                    </label>
                    <ImageUpload
                      bucket="cms"
                      value={banner.image_url ? [banner.image_url] : []}
                      onChange={(urls) => handleFieldChange(idx, "image_url", urls[0] || "")}
                      onRemove={() => handleFieldChange(idx, "image_url", "")}
                      maxFiles={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mobile Banner Image
                    </label>
                    <ImageUpload
                      bucket="cms"
                      value={banner.image_mobile_url ? [banner.image_mobile_url] : []}
                      onChange={(urls) => handleFieldChange(idx, "image_mobile_url", urls[0] || "")}
                      onRemove={() => handleFieldChange(idx, "image_mobile_url", "")}
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Inputs */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Banner Heading Title</label>
                    <input
                      value={banner.title || ""}
                      onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                      placeholder="Title details..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Sub-heading Details</label>
                    <input
                      value={banner.subtitle || ""}
                      onChange={(e) => handleFieldChange(idx, "subtitle", e.target.value)}
                      placeholder="Subtitle details..."
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Placement Block Type</label>
                    <select
                      value={banner.banner_type || "featured_banner"}
                      onChange={(e) => handleFieldChange(idx, "banner_type", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-300 outline-none transition duration-200 text-sm shadow-sm cursor-pointer"
                    >
                      <option value="featured_banner">Main Featured Section Banner</option>
                      <option value="bottom">Footer / Pre-footer Banner</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Redirect Link URL</label>
                    <input
                      value={banner.link_url || ""}
                      onChange={(e) => handleFieldChange(idx, "link_url", e.target.value)}
                      placeholder="e.g., /products/mama-heart-hoodie"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id={`active-${idx}`}
                    checked={banner.is_active}
                    onChange={(e) => handleFieldChange(idx, "is_active", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor={`active-${idx}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    Show this banner on storefront pages
                  </label>
                </div>
              </div>
            </motion.div>
          ))}

          {banners.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <ImageIcon className="w-10 h-10 text-slate-350 dark:text-slate-650 mb-3" />
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-450">No promotional banners created yet</p>
            </div>
          )}

          <button
            onClick={handleAddBanner}
            className="w-full border-2 border-dashed border-slate-200 hover:border-purple-500 dark:border-slate-800 dark:hover:border-purple-500 hover:bg-purple-50/10 dark:hover:bg-purple-955/5 text-slate-650 hover:text-purple-600 py-3 rounded-xl transition duration-200 text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
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
