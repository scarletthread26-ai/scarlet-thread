'use client'

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  // If it's not a Cloudinary image, return it as-is
  if (!src || !src.includes("cloudinary.com")) {
    return src;
  }

  // Find where the upload path starts
  const uploadIdx = src.indexOf("/image/upload/");
  if (uploadIdx === -1) {
    return src;
  }

  const baseUrl = src.substring(0, uploadIdx + "/image/upload/".length);
  let restUrl = src.substring(uploadIdx + "/image/upload/".length);

  // If there are existing transformation parameters in the URL, strip them
  const firstSlashIdx = restUrl.indexOf("/");
  if (firstSlashIdx !== -1) {
    const firstSegment = restUrl.substring(0, firstSlashIdx);
    if (firstSegment.includes(",") || firstSegment === "f_auto" || firstSegment === "q_auto") {
      restUrl = restUrl.substring(firstSlashIdx + 1);
    }
  }

  // Format transformations: automatic format, automatic quality, and dynamic resizing
  const params = [
    "f_auto",
    `q_auto:${quality || "auto"}`,
    `w_${width}`
  ].join(",");

  return `${baseUrl}${params}/${restUrl}`;
}
