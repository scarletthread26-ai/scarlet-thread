"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  ShoppingBag,
  Tag,
  Users,
  Settings,
  Plus,
  Moon,
  Sun,
  X,
  Sparkles,
} from "lucide-react";

interface CommandItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  category: string;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define commands
  const commands: CommandItem[] = [
    {
      icon: ShoppingBag,
      label: "Go to Products",
      category: "Navigation",
      action: () => router.push("/admin/products"),
    },
    {
      icon: Tag,
      label: "Go to Orders",
      category: "Navigation",
      action: () => router.push("/admin/orders"),
    },
    {
      icon: Users,
      label: "Go to Customers",
      category: "Navigation",
      action: () => router.push("/admin/customers"),
    },
    {
      icon: FileText,
      label: "Go to CMS Manager",
      category: "Navigation",
      action: () => router.push("/admin/cms"),
    },
    {
      icon: Settings,
      label: "Go to Settings",
      category: "Navigation",
      action: () => router.push("/admin/settings"),
    },
    {
      icon: Plus,
      label: "Add New Product",
      category: "Quick Actions",
      action: () => router.push("/admin/products/new"),
    },
    {
      icon: Moon,
      label: "Switch to Dark Mode",
      category: "Preferences",
      action: () => setTheme("dark"),
    },
    {
      icon: Sun,
      label: "Switch to Light Mode",
      category: "Preferences",
      action: () => setTheme("light"),
    },
  ];

  // Handle Ctrl+K shortcut to toggle open state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Handle arrow navigation & enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Visual Search Bar Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full max-w-[240px] bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-3 py-1.5 hover:border-purple-500/50 hover:bg-white dark:hover:bg-slate-950 transition duration-200 cursor-pointer outline-none text-slate-500 dark:text-slate-400 group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-500 transition duration-200" />
          <span className="text-xs font-medium">Quick search...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600 bg-slate-200/50 dark:bg-slate-850 px-1.5 py-0.5 rounded border border-slate-200/20 shadow-sm">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl relative z-10 overflow-hidden"
              ref={containerRef}
            >
              {/* Input Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-850">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or navigation page..."
                  className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none text-sm"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                {filteredCommands.length > 0 ? (
                  // Group items by category
                  Object.entries(
                    filteredCommands.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
                      if (!acc[cmd.category]) acc[cmd.category] = [];
                      acc[cmd.category].push(cmd);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {category}
                      </div>
                      {items.map((cmd) => {
                        const globalIdx = filteredCommands.indexOf(cmd);
                        const isSelected = globalIdx === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <div
                            key={cmd.label}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition duration-150 ${
                              isSelected
                                ? "bg-purple-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                              <span className="text-sm font-semibold">{cmd.label}</span>
                            </div>
                            <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${
                              isSelected
                                ? "bg-purple-700 text-purple-100"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}>
                              {cmd.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 dark:text-slate-500">
                    <Sparkles className="w-6 h-6 text-slate-350 dark:text-slate-650 mb-2 animate-pulse" />
                    <p className="text-xs font-semibold">No results match your search</p>
                  </div>
                )}
              </div>

              {/* Footer Guidelines */}
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850/40 text-[10px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <kbd className="font-sans font-bold bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200/10">↵</kbd> to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-sans font-bold bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200/10">↑↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-sans font-bold bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200/10">esc</kbd> to close
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
