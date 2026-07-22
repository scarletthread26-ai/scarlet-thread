"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, MessageCircle, ChevronDown, HelpCircle, X, Sparkles, Loader2 } from "lucide-react";
import { useFaqs } from "@/hooks/use-faqs";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "personalization", label: "Personalization" },
  { id: "shipping", label: "Shipping & Pickup" },
  { id: "payments", label: "Ordering & Payments" },
  { id: "returns", label: "Returns & Exchanges" }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: faqs = [], isLoading } = useFaqs();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F5FF] via-white to-white py-5">
      <div className="max-w-[850px] mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight"
          >
            Frequently Asked <span className="text-primary">Questions</span> 
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-sm max-w-lg mx-auto"
          >
            Find answers to common questions about our custom embroidery process, delivery timelines, and order configurations.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-xl mx-auto mb-10"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition duration-200 text-sm shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setExpandedId(null);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold select-none cursor-pointer transition duration-300 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                    : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Accordions */}
        <div className="space-y-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-500" />
              <p>Loading questions...</p>
            </div>
          ) : filteredFaqs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layoutId={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none select-none"
                    >
                      <span className="font-semibold text-slate-800 text-sm sm:text-base pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 text-slate-650 text-sm sm:text-base leading-relaxed border-t border-slate-50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm"
            >
              <div className="text-slate-400 mb-3 text-4xl">🔍</div>
              <h3 className="font-bold text-slate-700">No results found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-normal">
                We couldn't find any questions matching "{searchQuery}". Try searching for other keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-650 text-xs font-bold rounded-lg transition"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 translate-y-12 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Still Have Questions?</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
              Can't Find What You're Looking For?
            </h3>
            
            <p className="text-white/70 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              If your question isn't listed here, reach out to us! We are happy to help you with custom designs, gift sets, or bulk order requests.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <a
                href="https://wa.me/971501872337"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold px-5 py-3 rounded-xl transition duration-200 text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat via WhatsApp</span>
              </a>
              <a
                href="mailto:support@thescarletthread.in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 text-white font-bold px-5 py-3 rounded-xl transition duration-200 text-sm shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Email Our Support</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
