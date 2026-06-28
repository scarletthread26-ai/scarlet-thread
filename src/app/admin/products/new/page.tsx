"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/use-products";
import { ProductForm, ProductFormValues } from "../product-form";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      router.push("/admin/products");
    } catch (err) {
      // toast is already handled inside the hook
      console.error(err);
    }
  };

  return (
    <ProductForm
      title="Create New Product"
      onSubmit={onSubmit}
      isLoading={createMutation.isPending}
    />
  );
}
