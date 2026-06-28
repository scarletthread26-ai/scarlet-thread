"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-200/40 dark:bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-200/40 dark:bg-indigo-900/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/30 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md relative z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to shop</span>
        </Link>
        <Link href="/" className="font-semibold text-lg tracking-wide text-slate-900 dark:text-slate-100">
          Scarlet <span className="text-purple-600 dark:text-purple-400">Thread</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 my-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/40 dark:border-slate-800/20 relative z-10">
        &copy; {new Date().getFullYear()} Scarlet Thread. All rights reserved.
      </footer>
    </div>
  );
}
