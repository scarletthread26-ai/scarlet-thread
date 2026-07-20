"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { Plus, Edit, Trash2, Check, X, Loader2, FolderTree } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  useSubcategories as useSubs,
  useCreateSubcategory as useCreateSub,
  useUpdateSubcategory as useUpdateSub,
  useDeleteSubcategory as useDeleteSub,
} from "@/hooks/use-subcategories";

const subcategorySchema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  parent_id: z.string().min(1, "Main Category is required"),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

export function SubcategoriesView() {
  const { data: mainCategories = [], isLoading: categoriesLoading } = useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubs();
  
  const createMutation = useCreateSub();
  const updateMutation = useUpdateSub();
  const deleteMutation = useDeleteSub();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isOccasion, setIsOccasion] = useState(false);
  const [currentOccasionIds, setCurrentOccasionIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent_id: "",
      image_url: "",
      is_active: true,
    },
  });

  const selectedParentId = watch("parent_id");

  useEffect(() => {
    async function fetchOccasions() {
      if (!selectedParentId) {
        setCurrentOccasionIds([]);
        setIsOccasion(false);
        return;
      }
      const mainCat = mainCategories.find((c: any) => c.id === selectedParentId);
      if (mainCat) {
        const CMS_SECTION_KEYS: Record<string, string> = {
          "gift-for-him": "gifts-for-him",
          "gift-for-her": "gifts-for-her",
          "kids-babies": "kids-babies",
          "seasonal-gifts": "seasonal-gifts",
          "faith-based": "faith-based"
        };
        const sectionKey = CMS_SECTION_KEYS[mainCat.slug] || mainCat.slug;
        try {
          const res = await fetch(`/api/admin/cms/homepage-sections?key=${sectionKey}`);
          if (res.ok) {
            const section = await res.json();
            const subs = section?.content?.occasions?.subcategories || [];
            setCurrentOccasionIds(subs);
            if (editingId && subs.includes(editingId)) {
                setIsOccasion(true);
            } else if (!editingId) {
                setIsOccasion(false);
            }
          } else {
            setCurrentOccasionIds([]);
            setIsOccasion(false);
          }
        } catch (e) {
          setCurrentOccasionIds([]);
          setIsOccasion(false);
        }
      }
    }
    fetchOccasions();
  }, [selectedParentId, mainCategories, editingId]);

  const onSubmit = async (values: SubcategoryFormValues) => {
    let finalSlug = values.slug;
    const mainCat = mainCategories.find((c: any) => c.id === values.parent_id);
    
    if (!editingId) {
      const baseSlug = values.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      finalSlug = mainCat ? `${mainCat.slug}-${baseSlug}` : baseSlug;
    }

    const dataToSubmit = { ...values, image_url: imageUrl, slug: finalSlug };
    let subcategoryId = editingId;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: dataToSubmit });
    } else {
      const created = await createMutation.mutateAsync(dataToSubmit);
      subcategoryId = created.id;
    }

    // Now update occasion display
    const mainCatObj = mainCategories.find((c: any) => c.id === dataToSubmit.parent_id);
    if (mainCatObj && subcategoryId) {
       const CMS_SECTION_KEYS: Record<string, string> = {
         "gift-for-him": "gifts-for-him",
         "gift-for-her": "gifts-for-her",
         "kids-babies": "kids-babies",
         "seasonal-gifts": "seasonal-gifts",
         "faith-based": "faith-based"
       };
       const sectionKey = CMS_SECTION_KEYS[mainCatObj.slug] || mainCatObj.slug;
       try {
           const res = await fetch(`/api/admin/cms/homepage-sections?key=${sectionKey}`);
           let section = res.ok ? await res.json() : null;
           if (!section || !section.content) {
               section = { section_key: sectionKey, content: { occasions: { subcategories: [] } } };
           }
           let subs = section.content?.occasions?.subcategories || [];
           
           if (isOccasion) {
               if (!subs.includes(subcategoryId)) {
                   subs.push(subcategoryId);
               }
           } else {
               subs = subs.filter((id: string) => id !== subcategoryId);
           }
           
           section.content = {
               ...section.content,
               occasions: {
                   ...section.content.occasions,
                   subcategories: subs
               }
           };

           await fetch("/api/admin/cms/homepage-sections", {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(section)
           });
           
           setCurrentOccasionIds(subs);
       } catch (e) {
           console.error("Failed to update occasion status", e);
       }
    }

    setEditingId(null);
    reset();
    setImageUrl("");
    setIsOccasion(false);
  };

  const handleEdit = (subcategory: any) => {
    setEditingId(subcategory.id);
    setImageUrl(subcategory.image_url || "");
    reset({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      parent_id: subcategory.parent_id || "",
      image_url: subcategory.image_url || "",
      is_active: subcategory.is_active,
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    if (!editingId) {
      setValue(
        "slug",
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const isLoading = categoriesLoading || subcategoriesLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Left side: Add / Edit Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm h-fit space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
          <FolderTree className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="font-bold text-slate-800 dark:text-slate-200">
            {editingId ? "Edit Subcategory" : "Add New Subcategory"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Main Category
            </label>
            <select
              {...register("parent_id")}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 outline-none transition duration-200 text-sm shadow-sm"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.parent_id && (
              <span className="text-xs text-red-500 block mt-0.5">{errors.parent_id.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subcategory Image
            </label>
            <div className="w-full">
              <ImageUpload
                bucket="categories"
                value={imageUrl ? [imageUrl] : []}
                onChange={(urls) => setImageUrl(urls[0] || "")}
                onRemove={() => setImageUrl("")}
                maxFiles={1}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subcategory Title
            </label>
            <input
              {...register("name")}
              onChange={handleNameChange}
              placeholder="e.g., Couple Rings"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
            />
            {errors.name && (
              <span className="text-xs text-red-500 block mt-0.5">{errors.name.message}</span>
            )}
          </div>

          {/* Hidden Slug field, it is auto generated but we need it for db */}
          <input type="hidden" {...register("slug")} />

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subcategory Subtitle
            </label>
            <textarea
              {...register("description")}
              placeholder="e.g., Personalized matching rings"
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
            />
          </div>

          {selectedParentId && (
            <div className="flex items-center gap-3 mt-4 p-3.5 bg-purple-50/50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
              <input 
                type="checkbox" 
                id="isOccasion" 
                checked={isOccasion}
                onChange={(e) => setIsOccasion(e.target.checked)}
                disabled={!isOccasion && currentOccasionIds.length >= 4 && !currentOccasionIds.includes(editingId || "")}
                className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="isOccasion" className="text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer flex-1">
                Display as Occasion on Category Page
                {!isOccasion && currentOccasionIds.length >= 4 && !currentOccasionIds.includes(editingId || "") && (
                  <span className="text-rose-500 text-[11px] ml-2 font-bold uppercase tracking-wider">(Max 4 reached)</span>
                )}
              </label>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-1.5"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{editingId ? "Update Subcategory" : "Add Subcategory"}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  reset();
                  setImageUrl("");
                  setIsOccasion(false);
                }}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl transition text-sm cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Right side: Subcategories List */}
      <div className="lg:col-span-2 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : subcategories.length > 0 ? (
          <div className="space-y-8">
            {mainCategories.map((mainCat: any) => {
              const catSubs = subcategories.filter((s: any) => s.parent_id === mainCat.id);
              if (catSubs.length === 0) return null;

              return (
                <div key={mainCat.id} className="space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {mainCat.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catSubs.map((sub: any) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col relative group"
                      >
                        <div className="flex gap-4 pr-12">
                          <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {sub.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Img</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                              {sub.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-450 truncate mt-0.5">
                              {sub.description || "No subtitle"}
                            </p>
                          </div>
                        </div>

                        {/* Absolute positioning of control buttons on hover */}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(sub.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Orphaned subcategories */}
            {subcategories.filter((s: any) => !mainCategories.some((m: any) => m.id === s.parent_id)).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-rose-500 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Uncategorized / Unknown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subcategories
                    .filter((s: any) => !mainCategories.some((m: any) => m.id === s.parent_id))
                    .map((sub: any) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col relative group"
                      >
                        <div className="flex gap-4 pr-12">
                          <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {sub.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Img</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                              {sub.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-450 truncate mt-0.5">
                              {sub.description || "No subtitle"}
                            </p>
                          </div>
                        </div>

                        {/* Absolute positioning of control buttons on hover */}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(sub.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <p className="font-medium">No subcategories yet</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Delete Subcategory"
        description="Are you sure you want to delete this subcategory? This action will permanently remove it from the database."
      />
    </div>
  );
}
