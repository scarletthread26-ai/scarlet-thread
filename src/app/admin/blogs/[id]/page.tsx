"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        if (!res.ok) {
          throw new Error("Blog post not found.");
        }
        const data = await res.json();
        setBlog(data);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load blog post details.");
        router.push("/admin/blogs");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="text-sm text-slate-500 font-medium">Loading blog details...</span>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="py-2">
      <BlogForm initialData={blog} isEdit={true} />
    </div>
  );
}
