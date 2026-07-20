"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHeroSlides, useSaveHeroSlides } from "@/hooks/use-cms";
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Loader2, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function HeroSliderEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: initialSlides = [], isLoading } = useHeroSlides();
  const saveMutation = useSaveHeroSlides();
  const [slides, setSlides] = useState<any[]>([]);
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalSubtitle, setGlobalSubtitle] = useState("");

  useEffect(() => {
    if (initialSlides.length > 0) {
      setSlides(initialSlides);
      const firstWithTitle = initialSlides.find(s => s.title);
      const firstWithSub = initialSlides.find(s => s.subtitle);
      setGlobalTitle(firstWithTitle?.title || "More Than a Gift. A Memory in the Making");
      setGlobalSubtitle(firstWithSub?.subtitle || "Whether you're celebrating someone special or treating yourself, make it uniquely personal.");
    }
  }, [initialSlides]);

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading || !initialSlides.length) return false;
    
    // Compare global fields
    const firstWithTitle = initialSlides.find(s => s.title);
    const firstWithSub = initialSlides.find(s => s.subtitle);
    const initialGlobalTitle = firstWithTitle?.title || "More Than a Gift. A Memory in the Making";
    const initialGlobalSubtitle = firstWithSub?.subtitle || "Whether you're celebrating someone special or treating yourself, make it uniquely personal.";

    if (globalTitle !== initialGlobalTitle || globalSubtitle !== initialGlobalSubtitle) {
      return true;
    }

    // Compare slides length
    if (slides.length !== initialSlides.length) return true;

    // Compare slides content
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const initS = initialSlides[i];
      if (!initS) return true;
      if (
        s.image_desktop !== initS.image_desktop ||
        s.image_mobile !== initS.image_mobile ||
        s.button_text !== initS.button_text ||
        s.button_link !== initS.button_link ||
        s.is_active !== initS.is_active ||
        s.display_order !== initS.display_order
      ) {
        return true;
      }
    }

    return false;
  }, [slides, globalTitle, globalSubtitle, initialSlides, isLoading]);

  const handleDiscard = () => {
    if (initialSlides.length > 0) {
      setSlides(initialSlides);
      const firstWithTitle = initialSlides.find(s => s.title);
      const firstWithSub = initialSlides.find(s => s.subtitle);
      setGlobalTitle(firstWithTitle?.title || "More Than a Gift. A Memory in the Making");
      setGlobalSubtitle(firstWithSub?.subtitle || "Whether you're celebrating someone special or treating yourself, make it uniquely personal.");
    }
    toast.info("Changes discarded");
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `temp-${Date.now()}`,
      title: globalTitle || "New Promotional Banner",
      subtitle: globalSubtitle || "Bespoke handcrafted custom embroidery.",
      image_desktop: "",
      image_mobile: "",
      button_text: "Shop Collection",
      button_link: "/products",
      is_active: true,
      display_order: slides.length,
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (idx: number) => {
    setSlides(slides.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= slides.length) return;

    const copy = [...slides];
    const temp = copy[idx];
    copy[idx] = copy[newIdx];
    copy[newIdx] = temp;
    setSlides(copy);
  };

  const handleFieldChange = (idx: number, field: string, value: any) => {
    const updated = slides.map((slide, i) => {
      if (i === idx) {
        return { ...slide, [field]: value };
      }
      return slide;
    });
    setSlides(updated);
  };

  const handleSave = async () => {
    const updatedSlides = slides.map(slide => ({
      ...slide,
      title: globalTitle,
      subtitle: globalSubtitle
    }));
    await saveMutation.mutateAsync(updatedSlides);
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
                Hero Slider Settings
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Reorder or customize homepage promotional sliders.
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
        <div className="flex justify-end">
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
          {/* Global Heading & Subheading Settings */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-850 dark:text-slate-100">Global Hero Content</h2>
              <p className="text-xs text-slate-550 dark:text-slate-400">
                This text remains static on the homepage while the background images slide.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Global Heading Title</label>
                <input
                  value={globalTitle}
                  onChange={(e) => setGlobalTitle(e.target.value)}
                  placeholder="e.g. More Than a Gift. A Memory in the Making"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Global Sub-heading Details</label>
                <input
                  value={globalSubtitle}
                  onChange={(e) => setGlobalSubtitle(e.target.value)}
                  placeholder="e.g. Whether you're celebrating someone special or treating yourself..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>

          {slides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-50 to-purple-50/40 dark:from-slate-900 dark:to-purple-950/10 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-sm shadow-purple-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Slide #{idx + 1}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${slide.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${slide.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {slide.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === slides.length - 1}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                  <button
                    onClick={() => handleRemoveSlide(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col md:flex-row">
                {/* Left: Images panel */}
                <div className="w-full md:w-72 shrink-0 p-5 space-y-4 bg-slate-50/60 dark:bg-slate-950/20 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/50">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Desktop Banner Image
                      </label>
                    </div>
                    <ImageUpload
                      bucket="cms"
                      value={slide.image_desktop ? [slide.image_desktop] : []}
                      onChange={(urls) => handleFieldChange(idx, "image_desktop", urls[0] || "")}
                      onRemove={() => handleFieldChange(idx, "image_desktop", "")}
                      maxFiles={1}
                      gridClassName="grid grid-cols-1"
                      previewClassName="aspect-video w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Mobile Banner Image
                      </label>
                    </div>
                    <ImageUpload
                      bucket="cms"
                      value={slide.image_mobile ? [slide.image_mobile] : []}
                      onChange={(urls) => handleFieldChange(idx, "image_mobile", urls[0] || "")}
                      onRemove={() => handleFieldChange(idx, "image_mobile", "")}
                      maxFiles={1}
                      gridClassName="grid grid-cols-1"
                      previewClassName="aspect-video w-full"
                    />
                  </div>
                </div>

                {/* Right: Settings panel */}
                <div className="flex-1 p-5 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Button Label
                    </label>
                    <input
                      value={slide.button_text || ""}
                      onChange={(e) => handleFieldChange(idx, "button_text", e.target.value)}
                      placeholder="e.g., Shop Now"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Action Redirect Link
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        🔒 Fixed
                      </span>
                    </div>
                    <input
                      value={slide.button_link || ""}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-400 dark:text-slate-500 outline-none text-sm cursor-not-allowed select-none"
                    />
                    <p className="text-[10px] text-slate-400">This link is fixed and cannot be changed from the CMS.</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <label className="flex items-center gap-3 cursor-pointer w-fit">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`active-${idx}`}
                          checked={slide.is_active}
                          onChange={(e) => handleFieldChange(idx, "is_active", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-checked:bg-purple-600 rounded-full transition duration-200" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition duration-200 peer-checked:translate-x-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                        Show in homepage slider carousel
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {slides.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <ImageIcon className="w-10 h-10 text-slate-350 dark:text-slate-650 mb-3" />
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">No slides created yet</p>
            </div>
          )}

          <button
            onClick={handleAddSlide}
            className="w-full border-2 border-dashed border-slate-200 hover:border-purple-500 dark:border-slate-800 dark:hover:border-purple-500 hover:bg-purple-50/10 dark:hover:bg-purple-950/5 text-slate-650 hover:text-purple-600 py-3 rounded-xl transition duration-200 text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
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
