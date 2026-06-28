"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/use-products";
import { ProductForm, ProductFormValues } from "../product-form";
import { Loader2 } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const updateMutation = useUpdateProduct();

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, data: values });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  if (isProductLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading product parameters...</p>
      </div>
    );
  }

  return (
    <ProductForm
      title="Edit Product details"
      initialValues={product}
      onSubmit={onSubmit}
      isLoading={updateMutation.isPending}
    />
  );
}
