import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchResults from "./search-results";

export const metadata: Metadata = {
  title: "Search Gifts | The Scarlet Thread",
  description: "Search our beautiful, custom embroidered gifts.",
};

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-650" />
            <span className="text-sm font-semibold text-slate-400">Loading search...</span>
          </div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
