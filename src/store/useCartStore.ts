import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string; // Unique ID for the cart line item
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  personalization?: {
    name?: string;
    customText?: string;
    fontStyle?: string;
    fontColor?: string;
    photoUrl?: string | null;
  } | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  discount_value: number;
  min_purchase_amount: number;
  is_active: boolean;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  isLoading: boolean;
  
  addItem: (item: Omit<CartItem, "id">, isAuthenticated: boolean) => Promise<void>;
  removeItem: (id: string, isAuthenticated: boolean) => Promise<void>;
  updateQuantity: (id: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
  clearCart: (isAuthenticated: boolean) => Promise<void>;
  
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  
  getTotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  
  fetchCart: (isAuthenticated: boolean) => Promise<void>;
  syncCart: (isAuthenticated: boolean) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      // Helper function to sync with DB
      const dbSync = async (items: CartItem[], isAuthenticated: boolean) => {
        if (!isAuthenticated) return;
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });
        } catch (err) {
          console.error("Failed to sync cart to database:", err);
        }
      };

      return {
        items: [],
        coupon: null,
        isLoading: false,

        addItem: async (item, isAuthenticated) => {
          const id = Math.random().toString(36).substring(2, 9);
          const currentItems = get().items;
          
          // Check if item with same productId and personalization already exists to increment quantity
          const sameIndex = currentItems.findIndex(i => 
            i.productId === item.productId && 
            JSON.stringify(i.personalization) === JSON.stringify(item.personalization)
          );

          let newItems;
          if (sameIndex !== -1) {
            newItems = currentItems.map((i, idx) => 
              idx === sameIndex ? { ...i, quantity: i.quantity + item.quantity } : i
            );
          } else {
            newItems = [...currentItems, { ...item, id }];
          }

          set({ items: newItems });
          toast.success("Added to cart");
          await dbSync(newItems, isAuthenticated);
        },

        removeItem: async (id, isAuthenticated) => {
          const newItems = get().items.filter((item) => item.id !== id);
          set({ items: newItems });
          toast.success("Removed from cart");
          
          // If subtotal drops below coupon threshold, remove coupon
          const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          const coupon = get().coupon;
          if (coupon && subtotal < coupon.min_purchase_amount) {
            set({ coupon: null });
            toast.error("Coupon removed: subtotal fell below minimum purchase requirement");
          }

          await dbSync(newItems, isAuthenticated);
        },

        updateQuantity: async (id, quantity, isAuthenticated) => {
          const newItems = get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          set({ items: newItems });

          // If subtotal drops below coupon threshold, remove coupon
          const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          const coupon = get().coupon;
          if (coupon && subtotal < coupon.min_purchase_amount) {
            set({ coupon: null });
            toast.error("Coupon removed: subtotal fell below minimum purchase requirement");
          }

          await dbSync(newItems, isAuthenticated);
        },

        clearCart: async (isAuthenticated) => {
          set({ items: [], coupon: null });
          await dbSync([], isAuthenticated);
        },

        applyCoupon: (coupon) => {
          const subtotal = get().getTotal();
          if (subtotal < coupon.min_purchase_amount) {
            toast.error(`Minimum purchase of ${coupon.min_purchase_amount} AED required.`);
            return;
          }
          set({ coupon });
          toast.success(`Coupon ${coupon.code} applied!`);
        },

        removeCoupon: () => {
          set({ coupon: null });
          toast.success("Coupon removed");
        },

        getTotal: () => {
          return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
        },

        getDiscountAmount: () => {
          const coupon = get().coupon;
          if (!coupon) return 0;

          const subtotal = get().getTotal();
          if (coupon.discount_type === "percentage") {
            return Number(((subtotal * coupon.discount_value) / 100).toFixed(2));
          } else if (coupon.discount_type === "fixed_amount") {
            return Math.min(coupon.discount_value, subtotal);
          }
          return 0; // free shipping discount is 0 on product subtotal
        },

        getShippingFee: () => {
          const subtotal = get().getTotal();
          if (subtotal === 0) return 0;

          const coupon = get().coupon;
          if (coupon && coupon.discount_type === "free_shipping") return 0;

          // Free shipping above 150 AED, else 15 AED
          return subtotal > 150 ? 0 : 15;
        },

        getGrandTotal: () => {
          const subtotal = get().getTotal();
          const discount = get().getDiscountAmount();
          const shipping = get().getShippingFee();
          return Math.max(0, subtotal - discount + shipping);
        },

        fetchCart: async (isAuthenticated) => {
          if (!isAuthenticated) return;
          set({ isLoading: true });
          try {
            const res = await fetch("/api/cart");
            if (res.ok) {
              const dbItems = await res.json();
              
              // Merge local items with DB items (keep unique items)
              const localItems = get().items;
              const merged = [...dbItems];

              localItems.forEach((localItem) => {
                const exists = merged.some(
                  (dbItem) =>
                    dbItem.productId === localItem.productId &&
                    JSON.stringify(dbItem.personalization) === JSON.stringify(localItem.personalization)
                );
                if (!exists) {
                  merged.push(localItem);
                }
              });

              set({ items: merged });
              
              // If we merged new local items to DB, sync back
              if (localItems.length > 0) {
                await dbSync(merged, isAuthenticated);
              }
            }
          } catch (err) {
            console.error("Failed to fetch cart from DB", err);
          } finally {
            set({ isLoading: false });
          }
        },

        syncCart: async (isAuthenticated) => {
          if (!isAuthenticated) return;
          await dbSync(get().items, isAuthenticated);
        }
      };
    },
    {
      name: "scarlet-thread-cart-v2", // changed name to avoid version collision
    }
  )
);
