import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  slug: string;
  stockStatus: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: (isAuthenticated: boolean) => Promise<void>;
  toggleItem: (product: WishlistItem, isAuthenticated: boolean) => Promise<void>;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      fetchWishlist: async (isAuthenticated) => {
        if (!isAuthenticated) return;
        set({ isLoading: true });
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data = await res.json();
            // Map DB wishlist items containing product join to frontend items
            const dbItems = data.map((item: any) => ({
              productId: item.product_id,
              name: item.products?.name || "Product",
              price: item.products?.price || 0,
              compareAtPrice: item.products?.compare_at_price || null,
              image: item.products?.images?.[0]?.url || item.products?.image_url || "",
              slug: item.products?.slug || "",
              stockStatus: item.products?.stock_status || "in_stock"
            }));
            set({ items: dbItems });
          }
        } catch (err) {
          console.error("Failed to fetch wishlist from DB", err);
        } finally {
          set({ isLoading: false });
        }
      },

      toggleItem: async (product, isAuthenticated) => {
        const items = get().items;
        const exists = items.some((item) => item.productId === product.productId);
        
        let newItems;
        if (exists) {
          newItems = items.filter((item) => item.productId !== product.productId);
          toast.success("Removed from wishlist");
        } else {
          newItems = [...items, product];
          toast.success("Added to wishlist");
        }
        
        set({ items: newItems });

        if (isAuthenticated) {
          try {
            const res = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product.productId }),
            });
            if (!res.ok) {
              console.warn("DB wishlist sync failed");
            }
          } catch (err) {
            console.error("Failed to sync wishlist toggle to DB", err);
          }
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "scarlet-thread-wishlist",
    }
  )
);
