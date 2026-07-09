"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Trash2, Copy, Search, Loader2, Link2, Calendar, FileType } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);

  // Fetch images from the Media API
  const { data = { resources: [] }, isLoading, error } = useQuery<any>({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed to fetch media files");
      return res.json();
    },
  });

  const mediaFiles = data.resources || [];

  // Mutation to delete file from Cloudinary via the backend upload DELETE API
  const deleteMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to delete media asset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      toast.success("Media asset permanently deleted!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete media asset");
    },
  });

  const handleDeleteConfirm = async () => {
    if (deleteUrl) {
      const toastId = toast.loading("Deleting file permanently...");
      try {
        await deleteMutation.mutateAsync(deleteUrl);
      } finally {
        toast.dismiss(toastId);
        setDeleteUrl(null);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image link copied to clipboard!");
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Filter media items by public_id / name
  const filteredFiles = mediaFiles.filter((file: any) => {
    const filename = file.public_id.split("/").pop() || "";
    return filename.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Cloud Media Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View all uploaded assets in Cloudinary. Copy URLs for use in the blog editor, or delete them to clear space.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 pl-10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition shadow-sm"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="aspect-square rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-4 animate-pulse p-4">
              <div className="w-full h-2/3 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="space-y-1">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-red-500 text-sm font-semibold">Failed to load media items.</p>
          <p className="text-slate-400 text-xs mt-1">Please check your network connection or API config.</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl max-w-lg mx-auto flex flex-col items-center justify-center p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-purple-550/10 border border-purple-100/55 dark:border-purple-900/40 rounded-full flex items-center justify-center text-purple-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Media Files Found</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {searchQuery
                ? "We couldn't find any uploaded media files matching your search term."
                : "Your Cloudinary storage is currently empty. Upload images via products, categories, or the blog editor to list them here."}
            </p>
          </div>
        </div>
      ) : (
        /* Media Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredFiles.map((file: any) => {
              const filename = file.public_id.split("/").pop() || "image";
              const formattedDate = new Date(file.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <motion.div
                  key={file.public_id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative border border-slate-200/65 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-800 transition duration-200 flex flex-col justify-between"
                >
                  {/* Thumbnail Image Container */}
                  <div className="aspect-square w-full relative bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={file.secure_url}
                      alt={filename}
                      className="object-cover w-full h-full group-hover:scale-102 transition duration-300 select-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(file.secure_url)}
                        className="p-2 rounded-xl bg-white text-slate-800 hover:bg-purple-600 hover:text-white transition duration-200 cursor-pointer shadow-md"
                        title="Copy Link URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteUrl(file.secure_url)}
                        className="p-2 rounded-xl bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition duration-200 cursor-pointer shadow-md"
                        title="Permanently Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata display */}
                  <div className="p-3.5 space-y-2 border-t border-slate-100 dark:border-slate-850/50 flex-1 flex flex-col justify-between">
                    <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate select-all" title={filename}>
                      {filename}
                    </h2>
                    <div className="flex flex-col gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold font-mono">
                      <span className="flex items-center gap-1">
                        <FileType className="w-3 h-3 text-slate-350 shrink-0" />
                        {file.format ? file.format.toUpperCase() : "JPG"} • {formatBytes(file.bytes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-350 shrink-0" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Permanent delete warning ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!deleteUrl}
        onClose={() => setDeleteUrl(null)}
        onConfirm={handleDeleteConfirm}
        isDestructive={true}
        title="Permanently Delete Media Asset"
        description="Are you absolutely sure you want to permanently delete this image from Cloudinary? This action is irreversible and will break any blog posts or products referencing this image URL."
        confirmLabel="Delete Permanently"
      />
    </div>
  );
}
