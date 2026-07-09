"use client";

import React from "react";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div className="py-2">
      <BlogForm isEdit={false} />
    </div>
  );
}
