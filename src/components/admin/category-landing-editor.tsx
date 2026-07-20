"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHomepageSection, useSaveHomepageSection } from "@/hooks/use-cms";
import { useCategories } from "@/hooks/use-categories";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface CategoryLandingEditorProps {
  sectionKey: string;
  pageTitle: string;
  pageDescription: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultDesktopImage: string;
  defaultMobileImage: string;
}

export function CategoryLandingEditor({
  sectionKey,
  pageTitle,
  pageDescription,
  defaultTitle,
  defaultSubtitle,
  defaultDesktopImage,
  defaultMobileImage,
}: CategoryLandingEditorProps) {
  const { data: section, isLoading } = useHomepageSection(sectionKey);
  const saveMutation = useSaveHomepageSection();
  const { data: allCategories, isLoading: isLoadingCategories } = useCategories();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [desktopImage, setDesktopImage] = useState<string[]>([]);
  const [mobileImage, setMobileImage] = useState<string[]>([]);
  
  // Occasions configuration state
  const [occasionsHeading, setOccasionsHeading] = useState("");
  const [occasionsSubcategories, setOccasionsSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (section) {
      setTitle(section.title || defaultTitle);
      setSubtitle(section.subtitle || defaultSubtitle);
      const content = section.content || {};
      setDesktopImage(content.image_desktop ? [content.image_desktop] : [defaultDesktopImage]);
      setMobileImage(content.image_mobile ? [content.image_mobile] : [defaultMobileImage]);
      setOccasionsHeading(content.occasions?.heading || "Gifts For Every Occasion");
      setOccasionsSubcategories(content.occasions?.subcategories || []);
    } else {
      setTitle(defaultTitle);
      setSubtitle(defaultSubtitle);
      setDesktopImage([defaultDesktopImage]);
      setMobileImage([defaultMobileImage]);
      setOccasionsHeading("Gifts For Every Occasion");
      setOccasionsSubcategories([]);
    }
  }, [section, defaultTitle, defaultSubtitle, defaultDesktopImage, defaultMobileImage]);

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading) return false;
    
    const originalTitle = (section?.title) || defaultTitle;
    const originalSubtitle = (section?.subtitle) || defaultSubtitle;
    const originalDesktop = (section?.content?.image_desktop) || defaultDesktopImage;
    const originalMobile = (section?.content?.image_mobile) || defaultMobileImage;
    const originalOccasionsHeading = (section?.content?.occasions?.heading) || "Gifts For Every Occasion";
    const originalOccasionsSubcategories = (section?.content?.occasions?.subcategories) || [];

    const currentDesktop = desktopImage[0] || "";
    const currentMobile = mobileImage[0] || "";

    const hasSubcategoriesChanged = 
      originalOccasionsSubcategories.length !== occasionsSubcategories.length || 
      !originalOccasionsSubcategories.every((id: string) => occasionsSubcategories.includes(id));

    return (
      title !== originalTitle ||
      subtitle !== originalSubtitle ||
      currentDesktop !== originalDesktop ||
      currentMobile !== originalMobile ||
      occasionsHeading !== originalOccasionsHeading ||
      hasSubcategoriesChanged
    );
  }, [title, subtitle, desktopImage, mobileImage, occasionsHeading, occasionsSubcategories, section, defaultTitle, defaultSubtitle, defaultDesktopImage, defaultMobileImage, isLoading]);

  const handleDiscard = () => {
    if (section) {
      setTitle(section.title || defaultTitle);
      setSubtitle(section.subtitle || defaultSubtitle);
      setDesktopImage(section.content?.image_desktop ? [section.content.image_desktop] : [defaultDesktopImage]);
      setMobileImage(section.content?.image_mobile ? [section.content.image_mobile] : [defaultMobileImage]);
      setOccasionsHeading(section.content?.occasions?.heading || "Gifts For Every Occasion");
      setOccasionsSubcategories(section.content?.occasions?.subcategories || []);
    } else {
      setTitle(defaultTitle);
      setSubtitle(defaultSubtitle);
      setDesktopImage([defaultDesktopImage]);
      setMobileImage([defaultMobileImage]);
      setOccasionsHeading("Gifts For Every Occasion");
      setOccasionsSubcategories([]);
    }
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      section_key: sectionKey,
      title,
      subtitle,
      content: {
        ...section?.content,
        image_desktop: desktopImage[0] || mobileImage[0] || defaultDesktopImage,
        image_mobile: mobileImage[0] || desktopImage[0] || defaultMobileImage,
        occasions: {
          heading: occasionsHeading,
          subcategories: occasionsSubcategories
        }
      },
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {pageDescription}
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

      {isLoading ? (
        <div className="h-64 w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 animate-pulse rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Left Panel: title, subtitle */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Hero Section Text
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder={defaultTitle}
                  />
                  <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    The last word of the title will automatically render in the page's primary highlight color.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition leading-relaxed"
                    placeholder={defaultSubtitle}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: banners */}
          <div className="space-y-6">
            {/* Desktop Banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Desktop Hero Image
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High-res horizontal landscape image (recommended 1600x900).
                </p>
              </div>

              <ImageUpload
                value={desktopImage.filter(Boolean)}
                onChange={(urls) => setDesktopImage(urls.slice(-1))}
                onRemove={() => setDesktopImage([])}
                maxFiles={1}
                bucket="cms"
              />
            </motion.div>

            {/* Mobile Banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Mobile Hero Image
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Portrait aspect image optimized for mobile devices (recommended 800x1200).
                </p>
              </div>

              <ImageUpload
                value={mobileImage.filter(Boolean)}
                onChange={(urls) => setMobileImage(urls.slice(-1))}
                onRemove={() => setMobileImage([])}
                maxFiles={1}
                bucket="cms"
              />
            </motion.div>
          </div>
          
          {/* Bottom Panel: Occasions Configuration */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Gift for Occasion Section
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure the occasions section shown on this page. Select up to 4 subcategories to feature.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={occasionsHeading}
                    onChange={(e) => setOccasionsHeading(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                    placeholder="Gifts For Every Occasion"
                  />
                  <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    The last word will automatically render in the page's primary highlight color.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Select Subcategories (Max 4)
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allCategories?.map((category) => {
                        const isSelected = occasionsSubcategories.includes(category.id);
                        const isDisabled = !isSelected && occasionsSubcategories.length >= 4;
                        
                        return (
                          <label
                            key={category.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer ${
                              isSelected
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500"
                                : isDisabled
                                ? "border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed"
                                : "border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-slate-50 dark:bg-slate-900/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (occasionsSubcategories.length < 4) {
                                    setOccasionsSubcategories([...occasionsSubcategories, category.id]);
                                  }
                                } else {
                                  setOccasionsSubcategories(occasionsSubcategories.filter(id => id !== category.id));
                                }
                              }}
                              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isSelected ? "text-purple-900 dark:text-purple-200" : "text-slate-700 dark:text-slate-300"}`}>
                                {category.name}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-450 mt-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    Selected subcategories must have an image and description to display properly on the storefront.
                  </p>
                </div>
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
