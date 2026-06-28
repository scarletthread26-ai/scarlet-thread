"use client";

import React, { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Plus, Edit, Trash2, ShoppingBag, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.images || [];
        const primaryImage = images.find((img: any) => img.is_primary) || images[0];
        const imageUrl = primaryImage?.url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80";

        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={row.original.name} className="w-full h-full object-cover" />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
            {row.original.name}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            /{row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-450">
          {row.original.sku || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "categories.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {row.original.categories?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price (AED)",
      cell: ({ row }) => {
        const price = Number(row.original.price);
        return <span className="font-bold text-slate-800 dark:text-slate-200">{price.toFixed(2)} AED</span>;
      },
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => {
        if (!row.original.track_inventory) {
          return <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800">Not Tracked</span>;
        }
        const qty = row.original.stock_quantity;
        const threshold = row.original.low_stock_threshold ?? 5;
        let colorClass = "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20";
        if (qty <= 0) {
          colorClass = "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20";
        } else if (qty <= threshold) {
          colorClass = "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20";
        }
        return (
          <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${colorClass}`}>
            {qty} left
          </span>
        );
      },
    },
    {
      id: "flags",
      header: "Flags",
      cell: ({ row }) => {
        const { featured, best_seller, trending, new_arrival } = row.original;
        const flags = [];
        if (featured) flags.push("Featured");
        if (best_seller) flags.push("Best Seller");
        if (trending) flags.push("Trending");
        if (new_arrival) flags.push("New");
        
        if (flags.length === 0) return <span className="text-xs text-slate-400">-</span>;
        
        return (
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {flags.map(f => (
              <span key={f} className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/50">
                {f}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.is_active;
        return (
          <span
            className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${
              active
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border border-emerald-250/10"
                : "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 border border-slate-200/10"
            }`}
          >
            {active ? "Active" : "Archived"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/product/${row.original.slug || row.original.id}`}
            target="_blank"
            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition"
            title="Preview on Storefront"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/products/${row.original.id}`}
            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteId(row.original.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Products Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Products List
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all product listings, stock counts, and customization templates.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-md shadow-purple-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 w-full bg-white dark:bg-slate-900 animate-pulse rounded-xl" />
          <div className="h-64 w-full bg-white dark:bg-slate-900 animate-pulse rounded-2xl" />
        </div>
      ) : products.length > 0 ? (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Search products by name..."
        />
      ) : (
        <EmptyState
          title="No products found"
          description="It looks like you haven't uploaded any products yet. Click below to add your first embroidered gift!"
          icon={ShoppingBag}
          actionLabel="Add Product"
          onAction={() => router.push("/admin/products/new")}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action will permanently remove the product description and all uploaded asset images."
      />
    </div>
  );
}
