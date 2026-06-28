"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "@/hooks/use-categories";
import { useSubcategories } from "@/hooks/use-subcategories";
import { ImageUpload } from "@/components/admin/image-upload";
import { Loader2, ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  sku: z.string().optional().nullable(),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0.01, "Price must be greater than 0")
  ),
  compare_at_price: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().min(0).optional().nullable()
  ),
  category_id: z.string().min(1, "Please select a category"),
  sub_category_id: z.string().optional().nullable(),
  stock_quantity: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().min(0).default(0)
  ),
  low_stock_threshold: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 5;
      const num = Number(val);
      return isNaN(num) ? 5 : num;
    },
    z.number().min(0).default(5)
  ),
  track_inventory: z.boolean().default(true),
  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),
  best_seller: z.boolean().default(false),
  trending: z.boolean().default(false),
  new_arrival: z.boolean().default(false),
  is_personalized: z.boolean().default(false),
  personalization_price: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().min(0).default(0)
  ),
  whatsapp_instructions: z.string().optional().nullable(),
  production_time: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 2;
      const num = Number(val);
      return isNaN(num) ? 2 : num;
    },
    z.number().min(0).default(2)
  ),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  weight: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().min(0).default(0)
  ),
  images: z.array(z.string()).default([]),
  allowed_fields: z.array(z.string()).default([]),
  allowed_fonts: z.array(z.string()).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
  title: string;
}

const FONTS_LIST = [
  "Elegant Script",
  "Modern Sans",
  "Luxury Serif",
  "Kids Font",
  "Classic Cursive",
  "Block Print",
];

const FIELDS_LIST = [
  { id: "name", label: "Name / Text" },
  { id: "initials", label: "Initials Monogram" },
  { id: "logo", label: "Custom Logo / Artwork" },
  { id: "placement_notes", label: "Special Placement Notes" },
];

export function ProductForm({
  initialValues,
  onSubmit,
  isLoading = false,
  title,
}: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "custom" | "seo">("basic");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      price: 0,
      compare_at_price: null,
      category_id: "",
      sub_category_id: "",
      stock_quantity: 0,
      low_stock_threshold: 5,
      track_inventory: true,
      is_active: true,
      featured: false,
      best_seller: false,
      trending: false,
      new_arrival: false,
      is_personalized: false,
      personalization_price: 0,
      whatsapp_instructions: "",
      production_time: 2,
      meta_title: "",
      meta_description: "",
      weight: 0,
      images: [],
      allowed_fields: [],
      allowed_fonts: [],
    },
  });

  const isPersonalized = watch("is_personalized");
  const images = watch("images");
  const currentCategoryId = watch("category_id");
  const filteredSubcategories = subcategories.filter(sc => sc.parent_id === currentCategoryId);
  const allowedFields = watch("allowed_fields");
  const allowedFonts = watch("allowed_fonts");

  const onInvalidSubmit = (formErrors: typeof errors) => {
    const errorFields: string[] = [];
    if (formErrors.name) errorFields.push("Product Title");
    if (formErrors.slug) errorFields.push("URL Slug");
    if (formErrors.category_id) errorFields.push("Category Department");
    if (formErrors.price) errorFields.push("Standard Unit Price");

    // Add any other fields that fail validation but aren't explicitly mapped
    Object.keys(formErrors).forEach((key) => {
      if (!["name", "slug", "category_id", "price"].includes(key)) {
        const humanName = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        errorFields.push(humanName);
      }
    });

    if (errorFields.length > 0) {
      toast.error(`Please correct the following fields: ${errorFields.join(", ")}`);
    } else {
      toast.error("Form validation failed. Please check all fields.");
    }
  };

  const hasBasicErrors = !!(errors.name || errors.slug || errors.category_id || errors.sub_category_id || errors.description);
  const hasMediaErrors = !!(errors.price || errors.compare_at_price || errors.weight || errors.images);
  const hasCustomErrors = !!(errors.is_personalized || errors.personalization_price || errors.production_time || errors.whatsapp_instructions || errors.allowed_fields || errors.allowed_fonts);
  const hasSeoErrors = !!(errors.stock_quantity || errors.low_stock_threshold || errors.is_active || errors.featured || errors.best_seller || errors.trending || errors.new_arrival || errors.meta_title || errors.meta_description);

  // Load initial values if updating
  useEffect(() => {
    if (initialValues) {
      // Map templates allowed fields/fonts if present
      const template = initialValues.templates?.[0] || {};
      
      setValue("name", initialValues.name);
      setValue("slug", initialValues.slug);
      setValue("sku", initialValues.sku || "");
      setValue("description", initialValues.description || "");
      setValue("price", Number(initialValues.price) || 0);
      setValue("compare_at_price", initialValues.compare_at_price ? Number(initialValues.compare_at_price) : null);
      setValue("category_id", initialValues.category_id || "");
      setValue("sub_category_id", initialValues.sub_category_id || "");
      setValue("stock_quantity", initialValues.stock_quantity || 0);
      setValue("low_stock_threshold", initialValues.low_stock_threshold ?? 5);
      setValue("track_inventory", initialValues.track_inventory ?? true);
      setValue("is_active", initialValues.is_active ?? true);
      setValue("featured", initialValues.featured ?? false);
      setValue("best_seller", initialValues.best_seller ?? false);
      setValue("trending", initialValues.trending ?? false);
      setValue("new_arrival", initialValues.new_arrival ?? false);
      setValue("is_personalized", initialValues.is_personalized ?? false);
      setValue("personalization_price", Number(initialValues.personalization_price) || 0);
      setValue("whatsapp_instructions", initialValues.whatsapp_instructions || "");
      setValue("production_time", initialValues.production_time || 2);
      setValue("meta_title", initialValues.meta_title || "");
      setValue("meta_description", initialValues.meta_description || "");
      setValue("weight", Number(initialValues.weight) || 0);
      
      if (initialValues.images) {
        setValue("images", initialValues.images.map((img: any) => img.url));
      }
      
      // allowed fields & fonts from personalization template table joins
      if (template.allowed_fields) {
        setValue("allowed_fields", template.allowed_fields);
      }
      if (template.allowed_fonts) {
        setValue("allowed_fonts", template.allowed_fonts);
      }
    }
  }, [initialValues, setValue]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    if (!initialValues) {
      setValue(
        "slug",
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };



  const handleFieldToggle = (fieldId: string) => {
    if (allowedFields.includes(fieldId)) {
      setValue("allowed_fields", allowedFields.filter((id) => id !== fieldId));
    } else {
      setValue("allowed_fields", [...allowedFields, fieldId]);
    }
  };

  const handleFontToggle = (fontName: string) => {
    if (allowedFonts.includes(fontName)) {
      setValue("allowed_fonts", allowedFonts.filter((f) => f !== fontName));
    } else {
      setValue("allowed_fonts", [...allowedFonts, fontName]);
    }
  };

  const onFormSubmit = async (values: ProductFormValues) => {
    const formattedValues = {
      ...values,
      sku: values.sku === "" ? null : values.sku,
    };
    await onSubmit(formattedValues);
  };

  return (
    <div className="space-y-6">
      {/* Header and Go Back */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg outline-none transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Specify product parameters, pricing tags, and embroidery template fonts.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit(onFormSubmit, onInvalidSubmit)}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(["basic", "media", "custom", "seo"] as const).map((tab) => {
          const labels = {
            basic: "Basic Details",
            media: "Media & Pricing",
            custom: "Embroidery/Customization",
            seo: "SEO & Status",
          };
          const isActive = activeTab === tab;
          const tabHasErrors =
            (tab === "basic" && hasBasicErrors) ||
            (tab === "media" && hasMediaErrors) ||
            (tab === "custom" && hasCustomErrors) ||
            (tab === "seo" && hasSeoErrors);

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold relative outline-none cursor-pointer transition ${
                isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {labels[tab]}
                {tabHasErrors && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                )}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onFormSubmit, onInvalidSubmit)} className="space-y-6">
          {/* Tab 1: Basic Details */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product Title
                  </label>
                  <input
                    {...register("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Personalized Hooded Towel"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm ${
                      errors.name
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/5"
                        : "border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-0.5 block">{errors.name.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    URL Slug
                  </label>
                  <input
                    {...register("slug")}
                    placeholder="e.g., personalized-hooded-towel"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm ${
                      errors.slug
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/5"
                        : "border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    }`}
                  />
                  {errors.slug && (
                    <span className="text-xs text-red-505 mt-0.5 block">{errors.slug.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    SKU Code
                  </label>
                  <input
                    {...register("sku")}
                    placeholder="e.g., TW-HD-001"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category Department
                  </label>
                  <select
                    {...register("category_id")}
                    className={`w-full bg-slate-50 dark:bg-slate-955 border rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-300 outline-none transition duration-200 text-sm shadow-sm cursor-pointer ${
                      errors.category_id
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/5"
                        : "border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    }`}
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <span className="text-xs text-red-505 mt-0.5 block">{errors.category_id.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Tell the product's story, dimensions, care details..."
                  rows={6}
                  className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subcategory (Optional)
                  </label>
                  <select
                    {...register("sub_category_id")}
                    className={`w-full bg-slate-50 dark:bg-slate-955 border rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-300 outline-none transition duration-200 text-sm shadow-sm cursor-pointer ${
                      errors.sub_category_id
                        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/5"
                        : "border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    }`}
                    disabled={!currentCategoryId || filteredSubcategories.length === 0}
                  >
                    <option value="">Select subcategory...</option>
                    {filteredSubcategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.sub_category_id && (
                    <span className="text-xs text-red-505 mt-0.5 block">{errors.sub_category_id.message}</span>
                  )}
                  {currentCategoryId && filteredSubcategories.length === 0 && (
                    <span className="text-[10px] text-slate-400 mt-1 block">No subcategories found for selected category.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Media and Pricing */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing Fields */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Pricing Schema (AED)
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Standard Unit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="e.g., 99.00"
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm ${
                        errors.price
                          ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/5"
                          : "border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      }`}
                    />
                    {errors.price && (
                      <span className="text-xs text-red-505 mt-0.5 block">{errors.price.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Compare at Price (MSRP)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("compare_at_price", { valueAsNumber: true })}
                      placeholder="e.g., 149.00"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Estimated Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("weight", { valueAsNumber: true })}
                      placeholder="e.g., 0.5"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>
                </div>

                {/* Media Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Media Management
                  </h3>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product Gallery Images
                  </label>
                  <ImageUpload
                    bucket="products"
                    value={images}
                    onChange={(urls) => setValue("images", urls)}
                    onRemove={(url) => setValue("images", images.filter((u) => u !== url))}
                    maxFiles={5}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Customization Embroidery */}
          {activeTab === "custom" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/30 dark:border-purple-900/10">
                <Sparkles className="w-5 h-5 text-purple-650 dark:text-purple-400 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  Configure customizable embroidery settings. Once enabled, customer-facing purchase screens will offer name/monogram typing, font pickers, and color selections automatically.
                </p>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="is_personalized"
                  {...register("is_personalized")}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="is_personalized" className="text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                  Enable custom embroidery options on this product
                </label>
              </div>

              {isPersonalized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-850/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Embroidery Surcharge Price (AED)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("personalization_price", { valueAsNumber: true })}
                        placeholder="e.g., 25.00"
                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Production Time Delay (Days)
                      </label>
                      <input
                        type="number"
                        {...register("production_time", { valueAsNumber: true })}
                        placeholder="e.g., 2"
                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      WhatsApp Instructions Guidance
                    </label>
                    <textarea
                      {...register("whatsapp_instructions")}
                      placeholder="e.g., Please enter name to engrave. You can also send a logo photo to us via WhatsApp if choosing custom logo."
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fields List */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                        Allowed Customization Input Fields
                      </label>
                      <div className="space-y-1.5">
                        {FIELDS_LIST.map((field) => {
                          const isChecked = allowedFields.includes(field.id);
                          return (
                            <div
                              key={field.id}
                              onClick={() => handleFieldToggle(field.id)}
                              className={`p-3.5 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none ${
                                isChecked
                                  ? "border-purple-650 bg-purple-50/20 dark:bg-purple-950/10 text-purple-700 dark:text-purple-400"
                                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50/50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-purple-600 border-slate-300"
                              />
                              <span className="text-xs font-semibold">{field.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fonts List */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                        Allowed Embroidery Calligraphy Fonts
                      </label>
                      <div className="space-y-1.5">
                        {FONTS_LIST.map((font) => {
                          const isChecked = allowedFonts.includes(font);
                          return (
                            <div
                              key={font}
                              onClick={() => handleFontToggle(font)}
                              className={`p-3.5 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none ${
                                isChecked
                                  ? "border-purple-650 bg-purple-50/20 dark:bg-purple-950/10 text-purple-700 dark:text-purple-400"
                                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50/50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-purple-600 border-slate-300"
                              />
                              <span className="text-xs font-semibold">{font}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Tab 4: SEO & Status */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inventory Status */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Inventory & Status
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Available Stock
                    </label>
                    <input
                      type="number"
                      {...register("stock_quantity", { valueAsNumber: true })}
                      placeholder="e.g., 50"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      {...register("low_stock_threshold", { valueAsNumber: true })}
                      placeholder="e.g., 5"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="track_inventory"
                        {...register("track_inventory")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="track_inventory" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Track inventory quantity
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        {...register("is_active")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Publish and display in catalog
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Flags */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Product Flags (Homepage Sections)
                  </h3>
                  
                  <div className="flex flex-col gap-2.5 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        {...register("featured")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Featured Product
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="best_seller"
                        {...register("best_seller")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="best_seller" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Best Seller
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="trending"
                        {...register("trending")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="trending" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Trending
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="new_arrival"
                        {...register("new_arrival")}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="new_arrival" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        New Arrival
                      </label>
                    </div>
                  </div>
                </div>

                {/* SEO Metadata */}
                <div className="space-y-4 md:col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Search Engine Optimization (SEO)
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      SEO Meta Title
                    </label>
                    <input
                      {...register("meta_title")}
                      placeholder="e.g., Personalized Hooded Towel - The Scarlet Thread"
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      SEO Meta Description
                    </label>
                    <textarea
                      {...register("meta_description")}
                      placeholder="Enter a brief, keyword-rich description for Google results..."
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
