"use client";

import React, { useEffect, useState } from "react";
import { useHeroSlides, useSaveHeroSlides } from "@/hooks/use-cms";
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Loader2, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSliderEditorPage() {
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
          disabled={saveMutation.isPending}
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
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm relative group flex flex-col md:flex-row gap-6"
            >
              {/* Left Column: Reordering and Image uploads */}
              <div className="w-full md:w-64 space-y-4 shrink-0">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Slide #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-purple-650 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === slides.length - 1}
                      className="p-1 text-slate-500 hover:text-purple-650 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSlide(idx)}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Desktop Background Image
                  </label>
                  <ImageUpload
                    bucket="cms"
                    value={slide.image_desktop ? [slide.image_desktop] : []}
                    onChange={(urls) => handleFieldChange(idx, "image_desktop", urls[0] || "")}
                    onRemove={() => handleFieldChange(idx, "image_desktop", "")}
                    maxFiles={1}
                  />
                </div>
              </div>

              {/* Right Column: Inputs */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Button Label</label>
                    <input
                      value={slide.button_text || ""}
                      onChange={(e) => handleFieldChange(idx, "button_text", e.target.value)}
                      placeholder="e.g., Shop Now"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Action Redirect Link</label>
                    <input
                      value={slide.button_link || ""}
                      onChange={(e) => handleFieldChange(idx, "button_link", e.target.value)}
                      placeholder="e.g., /products"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id={`active-${idx}`}
                    checked={slide.is_active}
                    onChange={(e) => handleFieldChange(idx, "is_active", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor={`active-${idx}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    Show in homepage slider carousel
                  </label>
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
    </div>
  );
}
