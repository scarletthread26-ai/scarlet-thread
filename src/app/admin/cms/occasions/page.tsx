"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHomepageSection, useSaveHomepageSection } from "@/hooks/use-cms";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface OccasionCard {
  id: string;
  cursiveText: string;
  mainText: string;
  image: string;
  href: string;
}

const defaultCards: OccasionCard[] = [];

export default function OccasionsEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: section, isLoading } = useHomepageSection("occasions");
  const saveMutation = useSaveHomepageSection();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState<OccasionCard[]>([]);

  useEffect(() => {
    if (section) {
      const content = section.content || {};
      setHeading(content.heading || "For Every Occasion");
      setDescription(
        content.description ||
          "Discover thoughtfully curated gifts perfect for every celebration and milestone, making your special moments even more memorable."
      );
      setCards(content.cards || defaultCards);
    }
  }, [section]);

  const updateCard = (index: number, field: keyof OccasionCard, value: string) => {
    setCards((prev) =>
      prev.map((card, idx) => {
        if (idx === index) {
          const updatedCard = { ...card, [field]: value };
          if (field === "cursiveText") {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            updatedCard.href = `/products?category=${slug}`;
          }
          return updatedCard;
        }
        return card;
      })
    );
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        id: `occasion-${Date.now()}`,
        cursiveText: "",
        mainText: "",
        image: "",
        href: "/products",
      },
    ]);
  };

  const removeCard = (index: number) => {
    setCards((prev) => prev.filter((_, idx) => idx !== index));
  };

  const isDirty = useMemo(() => {
    if (isLoading || !section) return false;
    const content = section.content || {};
    const originalHeading = content.heading || "For Every Occasion";
    const originalDescription =
      content.description ||
      "Discover thoughtfully curated gifts perfect for every celebration and milestone, making your special moments even more memorable.";
    const originalCards: OccasionCard[] = content.cards || defaultCards;

    if (heading !== originalHeading || description !== originalDescription) return true;
    if (cards.length !== originalCards.length) return true;
    for (let i = 0; i < cards.length; i++) {
      const c1 = cards[i];
      const c2 = originalCards[i] || {};
      if (
        c1.cursiveText !== (c2.cursiveText || "") ||
        c1.mainText !== (c2.mainText || "") ||
        c1.image !== (c2.image || "") ||
        c1.href !== (c2.href || "")
      ) {
        return true;
      }
    }
    return false;
  }, [heading, description, cards, section, isLoading]);

  const handleDiscard = () => {
    if (section) {
      const content = section.content || {};
      setHeading(content.heading || "For Every Occasion");
      setDescription(
        content.description ||
          "Discover thoughtfully curated gifts perfect for every celebration and milestone, making your special moments even more memorable."
      );
      setCards(content.cards || defaultCards);
    }
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      section_key: "occasions",
      content: {
        heading,
        description,
        cards,
      },
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
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
                Occasions Section
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage heading, description, and occasion category cards.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || !isDirty}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage the For Every Occasion section heading and category cards.
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || !isDirty}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="h-64 w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 animate-pulse rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4"
          >
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Section Header</h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition font-semibold"
                placeholder="For Every Occasion"
              />
              <p className="text-[10px] text-slate-400 mt-1">The last word will be highlighted in the brand accent color.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition leading-relaxed"
                placeholder="Discover thoughtfully curated gifts perfect for every celebration..."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Occasion Cards</h2>
              <button
                onClick={addCard}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-purple-950/50 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cards.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                  No occasion cards yet. Click &ldquo;Add Card&rdquo; to get started.
                </p>
              )}

              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="p-5 border border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-805 pb-2">
                    <span className="text-xs font-bold text-purple-650 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400 px-3 py-1 rounded-full">
                      Card {idx + 1}
                    </span>
                    <button
                      onClick={() => removeCard(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Cursive Text
                      </label>
                      <input
                        type="text"
                        value={card.cursiveText}
                        onChange={(e) => updateCard(idx, "cursiveText", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                        placeholder="e.g., Anniversary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Bold Text
                      </label>
                      <input
                        type="text"
                        value={card.mainText}
                        onChange={(e) => updateCard(idx, "mainText", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                        placeholder="e.g., Gifts"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Link (href)
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          🔒 Auto-generated
                        </span>
                      </div>
                      <input
                        type="text"
                        value={card.href}
                        disabled
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed select-none"
                        placeholder="e.g., /products?category=anniversary"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">This link is automatically generated from the Cursive Text.</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Card Image
                      </label>
                      <ImageUpload
                        value={card.image ? [card.image] : []}
                        onChange={(urls) => updateCard(idx, "image", urls[0] || "")}
                        onRemove={() => updateCard(idx, "image", "")}
                        maxFiles={1}
                        bucket="cms"
                        gridClassName="grid grid-cols-1"
                        previewClassName="aspect-video w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

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
                {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
