"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, X, Check, FolderTree, ArrowRight } from "lucide-react";
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from "@/hooks/use-subcategories";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { motion, AnimatePresence } from "framer-motion";

interface SubcategoryManagerProps {
  categoryId: string;
}

export function SubcategoryManager({ categoryId }: SubcategoryManagerProps) {
  const { data: allSubcategories = [], isLoading } = useSubcategories();
  const createMutation = useCreateSubcategory();
  const updateMutation = useUpdateSubcategory();
  const deleteMutation = useDeleteSubcategory();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const subcategories = allSubcategories.filter((sub: any) => sub.parent_id === categoryId);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) return;

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: { name, slug, image_url: imageUrl },
      });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync({
        name,
        slug,
        image_url: imageUrl,
        parent_id: categoryId,
        is_active: true,
      });
      setIsAdding(false);
    }
    setName("");
    setSlug("");
  };

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setName(sub.name);
    setSlug(sub.slug);
    setImageUrl(sub.image_url || "");
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setName("");
    setSlug("");
    setImageUrl("");
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full mt-4" />;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FolderTree className="w-3.5 h-3.5" />
          Subcategories ({subcategories.length})
        </h4>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition"
          >
            <Plus className="w-3 h-3" />
            Add New
          </button>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {subcategories.map((sub: any) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {editingId === sub.id ? (
                <div className="flex flex-col gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/30 mt-2 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-16 shrink-0">
                      <ImageUpload
                        bucket="categories"
                        value={imageUrl ? [imageUrl] : []}
                        onChange={(urls) => setImageUrl(urls[0] || "")}
                        onRemove={() => setImageUrl("")}
                        maxFiles={1}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                    <input
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Name"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-lg py-1 px-2 text-sm outline-none"
                    />
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="Slug"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-lg py-1 px-2 text-sm outline-none font-mono text-[10px]"
                    />
                  </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                      {sub.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={sub.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        "IMG"
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {sub.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">/{sub.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => startEdit(sub)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/30 mt-2"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 shrink-0">
                <ImageUpload
                  bucket="categories"
                  value={imageUrl ? [imageUrl] : []}
                  onChange={(urls) => setImageUrl(urls[0] || "")}
                  onRemove={() => setImageUrl("")}
                  maxFiles={1}
                />
              </div>
              <div className="flex-1 space-y-2">
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Subcategory Name"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-lg py-1 px-2 text-sm outline-none"
                autoFocus
              />
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-lg py-1 px-2 text-sm outline-none font-mono text-[10px]"
              />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending}
                className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Add Subcategory
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Delete Subcategory"
        description="Are you sure you want to delete this subcategory?"
      />
    </div>
  );
}
