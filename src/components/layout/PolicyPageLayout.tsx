"use client";

import React, { useState, useEffect, useRef } from "react";
import { Shield, FileText, Truck, RotateCcw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PolicyPageLayoutProps {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export function PolicyPageLayout({ slug, title, description, content }: PolicyPageLayoutProps) {
  const [processedHtml, setProcessedHtml] = useState("");
  const [headings, setHeadings] = useState<{ text: string; id: string; level: string }[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine icon based on slug
  const getIcon = () => {
    switch (slug) {
      case "shipping":
        return <Truck className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
      case "returns":
        return <RotateCcw className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
      case "privacy":
        return <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
      case "terms":
        return <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
      default:
        return <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
    }
  };

  // Process HTML content to inject IDs to headings for the table of contents and scroll spying
  useEffect(() => {
    if (content) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const headingElements = doc.querySelectorAll("h1, h2, h3");
        const extractedHeadings: { text: string; id: string; level: string }[] = [];

        headingElements.forEach((h, i) => {
          const id = h.id || `section-${i}`;
          h.setAttribute("id", id);
          
          // Apply some custom typography margins and classes directly to the elements
          h.classList.add("scroll-mt-24"); // Offset for header navbar
          
          extractedHeadings.push({
            text: h.textContent || "",
            id,
            level: h.tagName.toLowerCase()
          });
        });

        setProcessedHtml(doc.body.innerHTML);
        setHeadings(extractedHeadings);
        if (extractedHeadings.length > 0) {
          setActiveSection(extractedHeadings[0].id);
        }
      } catch (err) {
        console.warn("Error parsing policy content HTML:", err);
        setProcessedHtml(content);
      }
    }
  }, [content]);

  // Scrollspy observer to highlight the active section in the table of contents
  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -75% 0px", // Triggers when heading is in the upper part of the viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings, processedHtml]);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F5FF] via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/30 flex items-center justify-center mx-auto mb-2 shadow-sm"
          >
            {getIcon()}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-50"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 64 }}
            transition={{ delay: 0.3 }}
            className="h-1 bg-purple-600 rounded-full mx-auto mt-4"
          />
        </div>

        {/* Layout Grid: Sidebar + Document */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Table of Contents */}
          {headings.length > 0 && (
            <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 block px-1">
                  On this page
                </h3>
                <nav className="flex flex-col gap-1">
                  {headings.map((heading) => {
                    const isActive = heading.id === activeSection;
                    return (
                      <button
                        key={heading.id}
                        onClick={() => handleScrollTo(heading.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-sm transition-all duration-200 select-none cursor-pointer ${
                          isActive
                            ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 pl-4 border-l-2 border-purple-600"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {isActive && <ArrowRight className="w-3.5 h-3.5" />}
                        <span className="truncate">{heading.text}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Right Column: Policy Document Body */}
          <div className={headings.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/40 dark:shadow-none min-h-[500px]"
              ref={containerRef}
            >
              {/* Dynamic Styled Rich-Text Output */}
              <div
                dangerouslySetInnerHTML={{ __html: processedHtml }}
                className="
                  text-slate-650 dark:text-slate-350 leading-relaxed text-sm md:text-base 
                  [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:font-heading [&_h1]:text-slate-900 [&_h1]:dark:text-slate-100 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:scroll-mt-24
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-heading [&_h2]:text-slate-800 [&_h2]:dark:text-slate-200 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:dark:border-slate-800/60 [&_h2]:pb-2
                  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:font-heading [&_h3]:text-slate-700 [&_h3]:dark:text-slate-300 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:scroll-mt-24
                  [&_p]:mb-5
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-1.5
                  [&_li]:mb-1
                  [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white
                  [&_a]:text-purple-600 [&_a]:dark:text-purple-400 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-purple-800
                "
              />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
