import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * Extracts the Cloudinary public ID from a full secure URL.
 * 
 * Example URL:
 * https://res.cloudinary.com/drfklf0je/image/upload/v1782546288/scarlet_thread_products/cpuxwpqvnuoiah5wtwfb.jpg
 * Returns: "scarlet_thread_products/cpuxwpqvnuoiah5wtwfb"
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const uploadIdx = url.indexOf("/image/upload/");
    if (uploadIdx === -1) return null;
    
    // Get everything after "/image/upload/"
    let pathAfterUpload = url.substring(uploadIdx + "/image/upload/".length);
    
    // Remove query parameters
    const queryIdx = pathAfterUpload.indexOf("?");
    if (queryIdx !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, queryIdx);
    }
    
    const parts = pathAfterUpload.split("/");
    // Shift off version parameters or transform options if they are the first folder segment
    // E.g., "v1782546288" or "f_auto,q_auto"
    if (parts[0] && (parts[0].match(/^v\d+$/) || parts[0].includes(","))) {
      parts.shift();
    }
    
    const remainingPath = parts.join("/");
    // Remove file extension
    const dotIdx = remainingPath.lastIndexOf(".");
    if (dotIdx !== -1) {
      return remainingPath.substring(0, dotIdx);
    }
    return remainingPath;
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return null;
  }
}

/**
 * Deletes an image from Cloudinary using its secure URL.
 */
export async function deleteFromCloudinary(url: string): Promise<any> {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) {
    console.warn(`Could not extract Cloudinary public ID from URL: ${url}`);
    return null;
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion result for public ID "${publicId}":`, result);
    return result;
  } catch (error) {
    console.error(`Failed to delete asset "${publicId}" from Cloudinary:`, error);
    throw error;
  }
}

export { cloudinary };
