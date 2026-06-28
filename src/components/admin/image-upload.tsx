"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/services/storage";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  maxFiles?: number;
  disabled?: boolean;
  bucket?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  maxFiles = 5,
  disabled = false,
  bucket = "products",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;
      if (value.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      setIsUploading(true);
      const uploadedUrls: string[] = [];

      try {
        for (const file of acceptedFiles) {
          const url = await uploadFile(file, bucket);
          uploadedUrls.push(url);
        }

        onChange([...value, ...uploadedUrls]);
        toast.success("Images uploaded successfully!");
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error("Failed to upload images. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles, disabled, bucket]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxFiles - value.length,
    disabled: disabled || isUploading,
  });

  return (
    <div className="space-y-3 w-full">
      {/* Uploaded Image Previews — displayed ABOVE the dropzone */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200/60 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Uploaded image"
                className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full-Width Upload Dropzone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer transition duration-200 bg-slate-50/50 dark:bg-slate-900/30 ${
            isDragActive
              ? "border-purple-500 bg-purple-50/20 dark:bg-purple-950/10 text-purple-600"
              : "border-slate-300 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/10 dark:hover:bg-purple-950/5 text-slate-500 dark:text-slate-400"
          } ${disabled || isUploading ? "opacity-60 cursor-not-allowed border-slate-200" : ""}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center mb-1">
                <Upload className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isDragActive ? "Drop files here" : "Click or drag to upload"}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                JPG, PNG, WEBP — Max 5MB{maxFiles > 1 ? ` — Up to ${maxFiles} images` : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
