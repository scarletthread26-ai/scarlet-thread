import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Uploads a file. Attempts to upload to Cloudinary via the backend upload API first.
 * If that fails or isn't configured, falls back to Supabase storage.
 * 
 * @param file The file object to upload
 * @param bucket The storage bucket name fallback (e.g., 'products', 'categories', 'cms')
 * @returns Public URL of the uploaded image
 */
export async function uploadFile(file: File, bucket: string): Promise<string> {
  try {
    // 1. Try uploading to Cloudinary first via our server API endpoint
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cloudinary server upload request failed");
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("No URL returned from Cloudinary upload endpoint");
    }

    return data.url;
  } catch (error: any) {
    console.warn(`Cloudinary upload failed: ${error.message || error}. Falling back to Supabase storage.`);

    // 2. Fallback to Supabase Storage if Cloudinary fails
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: sbError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (sbError) {
        throw sbError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (sbError2: any) {
      console.error(`Supabase Storage fallback upload failed for bucket "${bucket}":`, sbError2.message || sbError2);
      throw sbError2;
    }
  }
}

/**
 * Deletes a file. If it's a Cloudinary URL, deletes it via the backend upload API.
 * Otherwise, attempts to delete it from Supabase storage.
 * 
 * @param url The full public URL of the file to delete
 * @param bucket The storage bucket name
 */
export async function deleteFile(url: string, bucket: string): Promise<void> {
  try {
    if (!url) return;

    // 1. If it's a Cloudinary URL, delete from Cloudinary
    if (url.includes("cloudinary.com")) {
      console.log(`Deleting image from Cloudinary: ${url}`);
      const response = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file from Cloudinary");
      }
      return;
    }

    // 2. Otherwise, attempt to delete from Supabase storage
    const urlParts = url.split(`/public/${bucket}/`);
    if (urlParts.length < 2) {
      console.warn("Invalid file URL or not a Supabase Storage URL. Skipping deletion.");
      return;
    }
    
    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(`Failed to delete file:`, error.message || error);
  }
}
