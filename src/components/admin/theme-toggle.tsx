"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-1 rounded-full shadow-inner">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition outline-none cursor-pointer ${
          theme === "light"
            ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm border border-slate-200/20"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition outline-none cursor-pointer ${
          theme === "dark"
            ? "bg-slate-800 text-purple-400 shadow-sm border border-slate-700/50"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition outline-none cursor-pointer ${
          theme === "system"
            ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/20 dark:border-slate-700/50"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
        }`}
        title="System Preference"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
