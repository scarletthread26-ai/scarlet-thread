"use client";

import React, { useState } from "react";
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@/hooks/use-faqs";
import { Plus, Edit, Trash2, Loader2, MessageCircleQuestion } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

type FaqFormValues = z.infer<typeof faqSchema>;

const FAQ_CATEGORIES = [
  { value: "gifts-for-him", label: "Gifts For Him" },
  { value: "gifts-for-her", label: "Gifts For Her" },
  { value: "kids-babies", label: "Kids & Babies" },
  { value: "seasonal-gifts", label: "Seasonal Gifts" },
  { value: "faith-based-gifts", label: "Faith-Based Gifts" },
  { value: "personalization", label: "General - Personalization" },
  { value: "shipping", label: "General - Shipping" },
  { value: "payments", label: "General - Payments" },
  { value: "returns", label: "General - Returns" },
];

export default function FaqsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("gifts-for-him");
  
  const { data: faqs = [], isLoading } = useFaqs(selectedCategory);
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema) as any,
    defaultValues: {
      question: "",
      answer: "",
      display_order: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: FaqFormValues) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync({ ...values, category: selectedCategory });
    }
    reset({
      question: "",
      answer: "",
      display_order: faqs.length > 0 && !editingId ? faqs.length : 0,
      is_active: true,
    });
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    reset({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_active: faq.is_active,
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setEditingId(null);
    reset({
      question: "",
      answer: "",
      display_order: 0,
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            FAQ Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage FAQs for categories and general topics.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <label className="font-semibold text-sm text-slate-700 dark:text-slate-300">
          Select Category:
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 outline-none transition duration-200 text-sm shadow-sm min-w-[250px]"
        >
          {FAQ_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Add / Edit Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <MessageCircleQuestion className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {editingId ? "Edit FAQ" : "Add New FAQ"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Question
              </label>
              <input
                {...register("question")}
                placeholder="e.g., What personalization options do you offer?"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
              />
              {errors.question && (
                <span className="text-xs text-red-500 block mt-0.5">{errors.question.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Answer
              </label>
              <textarea
                {...register("answer")}
                placeholder="Answer goes here..."
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
              />
              {errors.answer && (
                <span className="text-xs text-red-500 block mt-0.5">{errors.answer.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Display Order
              </label>
              <input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="w-4 h-4 text-purple-600 bg-slate-100 border-slate-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Active (visible on site)
              </label>
            </div>

            <div className="flex gap-2.5 pt-4">
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
                <span>{editingId ? "Update FAQ" : "Add FAQ"}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    reset();
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Right side: FAQs List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : faqs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {faqs.map((faq: any) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 relative group ${!faq.is_active && 'opacity-60'}`}
                >
                  <div className="pr-12">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                        Order: {faq.display_order}
                      </span>
                      {!faq.is_active && (
                        <span className="text-xs font-semibold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(faq.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
              <MessageCircleQuestion className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-medium text-slate-600 dark:text-slate-400">No FAQs found for this category</p>
              <p className="text-sm mt-1">Use the form to add the first FAQ.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
}
