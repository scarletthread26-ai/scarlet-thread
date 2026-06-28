"use client";

import React, { useEffect, useState } from "react";
import { useCMSPages, useUpdateCMSPage, useCMSPage } from "@/hooks/use-cms";
import { FileText, Save, ArrowLeft, Loader2, Globe, Eye } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CMSPagesPage() {
  const { data: pages = [], isLoading: isListLoading } = useCMSPages();
  const updateMutation = useUpdateCMSPage();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { data: pageDetails, isLoading: isDetailsLoading } = useCMSPage(selectedSlug || "");

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Auto-select first page once loaded
  useEffect(() => {
    if (pages.length > 0 && !selectedSlug) {
      setSelectedSlug(pages[0].slug);
    }
  }, [pages, selectedSlug]);

  // Load selected page details
  useEffect(() => {
    if (pageDetails) {
      setTitle(pageDetails.title);
      setContent(pageDetails.content);
      setMetaTitle(pageDetails.meta_title || "");
      setMetaDescription(pageDetails.meta_description || "");
      setIsActive(pageDetails.is_active);
    }
  }, [pageDetails]);

  const handleSave = async () => {
    if (!selectedSlug) return;
    
    await updateMutation.mutateAsync({
      slug: selectedSlug,
      data: {
        title,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_active: isActive,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
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
              Static Pages & Policies
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Edit About, Privacy, Shipping details with our Rich Text editor.
            </p>
          </div>
        </div>

        {selectedSlug && (
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending || isDetailsLoading}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Page</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Pages Directory List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Static Pages Index
          </h2>
          {isListLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-11 rounded-xl bg-white dark:bg-slate-900 border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {pages.map((p) => {
                const isSelected = p.slug === selectedSlug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setSelectedSlug(p.slug)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-left cursor-pointer transition text-sm font-semibold select-none ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/10"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                      <span className="truncate">{p.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: TipTap Editor details */}
        <div className="lg:col-span-3">
          {isDetailsLoading ? (
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm min-h-[450px] flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading editor environment...</p>
            </div>
          ) : selectedSlug ? (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Header Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page Title..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO Meta Title</label>
                  <input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Meta Title..."
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Meta Description..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Rich Text Editor Body</label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <input
                  type="checkbox"
                  id="page_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="page_active" className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
                  Page is published and accessible in storefront footer links
                </label>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm min-h-[450px] flex flex-col items-center justify-center text-center text-slate-400">
              <FileText className="w-10 h-10 mb-3" />
              <p className="font-semibold text-sm">Please select a page to edit from the directory list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
