
interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  // If it's not a Cloudinary image, append width and quality query parameters to avoid Next.js warnings
  if (!src || !src.includes("cloudinary.com")) {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}${quality ? `&q=${quality}` : ""}`;
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

  // Format transformations: automatic format, automatic/numeric quality, and dynamic resizing
  const params = [
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
    `w_${width}`
  ].join(",");

  return `${baseUrl}${params}/${restUrl}`;
}

/**
 * Takes a full Cloudinary secure URL and dynamically injects '/f_auto,q_auto/' to
 * automatically compress quality and convert format to modern formats like WebP/AVIF.
 * Falls back to the original URL if not from Cloudinary or already formatted.
 */
export function getOptimizedImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;
  
  // Skip if it already contains optimization flags
  if (url.includes("/f_auto,q_auto/")) return url;
  
  // Find "/upload/" segment in the URL
  const uploadSegment = "/upload/";
  const uploadIdx = url.indexOf(uploadSegment);
  if (uploadIdx === -1) return url;
  
  // Insert "f_auto,q_auto/" right after "/upload/"
  const insertPosition = uploadIdx + uploadSegment.length;
  return (
    url.substring(0, insertPosition) +
    "f_auto,q_auto/" +
    url.substring(insertPosition)
  );
}
