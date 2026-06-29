"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useHomepageSection, useSaveHomepageSection } from "@/hooks/use-cms";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface StepItem {
  number: string;
  title: string;
  description: string;
  image: string;
}

const defaultSteps: StepItem[] = [
  {
    number: "1",
    title: "Choose Your Product",
    description: "Find your favorite base product and complete secure payment to lock in your order.",
    image: "/images/heropage/scarlet-heartbag.png"
  },
  {
    number: "2",
    title: "WhatsApp Us Details",
    description: "Check your email confirmation for your order details and share your design idea with us on WhatsApp.",
    image: "/images/heropage/scarlet-phone.png"
  },
  {
    number: "3",
    title: "Mockup & Approval",
    description: "We create a realistic digital mockup for your review. Give us your final thumbs up before we craft!",
    image: "/images/heropage/scarlet-laptop.png"
  },
  {
    number: "4",
    title: "We Craft & Ship",
    description: "Once approved, our team creates your unique gift with care and ships it straight to your doorstep.",
    image: "/images/heropage/scarlet-delivery.png"
  }
];

export default function HowItWorksEditorPage({ isTabbed = false }: { isTabbed?: boolean }) {
  const { data: section, isLoading } = useHomepageSection("how-it-works");
  const saveMutation = useSaveHomepageSection();

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<StepItem[]>([]);

  useEffect(() => {
    if (section) {
      setTitle(section.title || "Creating Your Perfect Custom Gift");
      const content = section.content || {};
      // Map to ensure description is mapped from desc if description is missing
      const rawSteps = content.steps || defaultSteps;
      setSteps(
        rawSteps.map((s: any) => ({
          number: s.number || "1",
          title: s.title || "",
          description: s.description || s.desc || "",
          image: s.image || ""
        }))
      );
    }
  }, [section]);

  const updateStep = (index: number, field: keyof StepItem, value: string) => {
    setSteps((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  // Compute dirtiness
  const isDirty = useMemo(() => {
    if (isLoading || !section) return false;

    const originalTitle = section.title || "Creating Your Perfect Custom Gift";
    const content = section.content || {};
    const originalSteps = content.steps || defaultSteps;

    if (title !== originalTitle) return true;
    if (steps.length !== originalSteps.length) return true;

    for (let i = 0; i < steps.length; i++) {
      const s1 = steps[i];
      const s2 = originalSteps[i] || {};
      const desc2 = s2.description || s2.desc || "";
      if (
        s1.title !== s2.title ||
        s1.description !== desc2 ||
        s1.image !== s2.image ||
        s1.number !== s2.number
      ) {
        return true;
      }
    }

    return false;
  }, [title, steps, section, isLoading]);

  const handleDiscard = () => {
    if (section) {
      setTitle(section.title || "Creating Your Perfect Custom Gift");
      const content = section.content || {};
      const rawSteps = content.steps || defaultSteps;
      setSteps(
        rawSteps.map((s: any) => ({
          number: s.number || "1",
          title: s.title || "",
          description: s.description || s.desc || "",
          image: s.image || ""
        }))
      );
    }
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      section_key: "how-it-works",
      title,
      subtitle: "The simple path to personalized gifting excellence",
      content: {
        steps,
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
                How It Works Section
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Edit the titles, descriptions, and icon images for each step of the ordering workflow.
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
            Manage storefront ordering workflow workflow settings.
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
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-6"
          >
            {/* Header config */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Section Main Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition font-semibold"
                placeholder="Creating Your Perfect Custom Gift"
              />
            </div>

            {/* Steps configuration */}
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-805">
              <h2 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wide">
                Workflow Steps configuration
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 border border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-805 pb-2">
                      <span className="text-xs font-bold text-purple-650 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400 px-3 py-1 rounded-full">
                        Step {step.number}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Step Title
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(idx, "title", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                          placeholder="e.g., Choose Your Product"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Step Description
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => updateStep(idx, "description", e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition leading-relaxed"
                          placeholder="Describe this step..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
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
