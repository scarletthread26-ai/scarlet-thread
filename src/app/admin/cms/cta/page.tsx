"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHomepageSection, useSaveHomepageSection } from "@/hooks/use-cms";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CTASectionEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: section, isLoading } = useHomepageSection("cta");
  const saveMutation = useSaveHomepageSection();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (section) {
      setTitle(section.title || "Ready to Make Someone Smile?");
      setSubtitle(section.subtitle || "Create a gift that will be remembered forever");
      const content = section.content || {};
      setButtonText(content.button_text || "Start Personalizing Now");
      setButtonLink(content.button_link || "/products");
      setImageUrl(content.image_url || "/images/scarlet-couple.png");
    }
  }, [section]);

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading || !section) return false;

    const originalTitle = section.title || "Ready to Make Someone Smile?";
    const originalSubtitle = section.subtitle || "Create a gift that will be remembered forever";
    const content = section.content || {};
    const originalButtonText = content.button_text || "Start Personalizing Now";
    const originalButtonLink = content.button_link || "/products";
    const originalImageUrl = content.image_url || "/images/scarlet-couple.png";

    return (
      title !== originalTitle ||
      subtitle !== originalSubtitle ||
      buttonText !== originalButtonText ||
      buttonLink !== originalButtonLink ||
      imageUrl !== originalImageUrl
    );
  }, [title, subtitle, buttonText, buttonLink, imageUrl, section, isLoading]);

  const handleDiscard = () => {
    if (section) {
      setTitle(section.title || "Ready to Make Someone Smile?");
      setSubtitle(section.subtitle || "Create a gift that will be remembered forever");
      const content = section.content || {};
      setButtonText(content.button_text || "Start Personalizing Now");
      setButtonLink(content.button_link || "/products");
      setImageUrl(content.image_url || "/images/scarlet-couple.png");
    }
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      section_key: "cta",
      title,
      subtitle,
      content: {
        button_text: buttonText,
        button_link: buttonLink,
        image_url: imageUrl,
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
                CTA Section Settings
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Edit title, subtitle, button text, and CTA background image.
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
            Manage main storefront bottom Call-To-Action (CTA) texts, links and background.
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
          {/* Main content forms */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Text & Button configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder="Ready to Make Someone Smile?"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    CTA Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder="Create a gift that will be remembered forever"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                      placeholder="Start Personalizing Now"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Button Link (URL)
                    </label>
                    <input
                      type="text"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                      placeholder="/products"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right sidebar: Background Image */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  CTA Banner Image
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload a premium background image (recommended 1400x450).
                </p>
              </div>

              <div className="space-y-4">
                <ImageUpload
                  value={imageUrl ? [imageUrl] : []}
                  onChange={(urls) => setImageUrl(urls[0] || "")}
                  onRemove={() => setImageUrl("")}
                  maxFiles={1}
                  bucket="cms"
                />
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
