"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id?: string;
  productId: string;
  quantity: number;
};

type CartActionResult = {
  ok: boolean;
  requiresAuth?: boolean;
  message?: string;
};

type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  authenticated: boolean;
  addItem: (productId: string, quantity?: number) => Promise<CartActionResult>;
  removeItem: (productId: string) => Promise<CartActionResult>;
  updateQuantity: (productId: string, quantity: number) => Promise<CartActionResult>;
  clearCart: () => Promise<CartActionResult>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function parseResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    items?: CartItem[];
    message?: string;
  };

  return payload;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  async function refreshCart() {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      const payload = await parseResponse(response);
      
      if (response.status === 401) {
        // Fallback to local storage for guests
        const local = localStorage.getItem("dhyan_guest_cart");
        if (local) {
          try {
            setItems(JSON.parse(local));
          } catch {
            setItems([]);
          }
        } else {
          setItems([]);
        }
        setAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load cart.");
      }

      setItems(payload.items ?? []);
      setAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCart();
  }, []);

  // Sync Guest Cart to Supabase when user signs in
  useEffect(() => {
    if (!authenticated || loading) return;

    const syncLocalCart = async () => {
      const local = localStorage.getItem("dhyan_guest_cart");
      if (!local) return;

      try {
        const guestItems = JSON.parse(local) as CartItem[];
        if (guestItems.length === 0) return;

        // Sync each item to the server
        for (const item of guestItems) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity })
          });
        }

        // Clear local storage and refresh the official cart
        localStorage.removeItem("dhyan_guest_cart");
        await refreshCart();
      } catch {
        // Guest cart merge failed; user can retry by refreshing after sign-in.
      }
    };

    void syncLocalCart();
  }, [authenticated, loading]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      loading,
      authenticated,
      async addItem(productId, quantity = 1) {
        if (!authenticated) {
          const newItems = [...items];
          const existing = newItems.find(i => i.productId === productId);
          if (existing) {
            existing.quantity += quantity;
          } else {
            newItems.push({ productId, quantity });
          }
          setItems(newItems);
          localStorage.setItem("dhyan_guest_cart", JSON.stringify(newItems));
          return { ok: true };
        }

        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity })
        });
        const payload = await parseResponse(response);
        if (response.status === 401) {
          setAuthenticated(false);
          return { ok: false, requiresAuth: true, message: payload.message };
        }
        if (!response.ok) {
          return { ok: false, message: payload.message || "Unable to add to cart." };
        }
        setItems(payload.items ?? []);
        setAuthenticated(true);
        return { ok: true };
      },
      async removeItem(productId) {
        if (!authenticated) {
          const newItems = items.filter(i => i.productId !== productId);
          setItems(newItems);
          localStorage.setItem("dhyan_guest_cart", JSON.stringify(newItems));
          return { ok: true };
        }

        const response = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId })
        });
        const payload = await parseResponse(response);
        if (!response.ok) {
          return { ok: false, message: payload.message || "Unable to remove this item." };
        }
        setItems(payload.items ?? []);
        return { ok: true };
      },
      async updateQuantity(productId, quantity) {
        if (!authenticated) {
          const newItems = items.map(i => i.productId === productId ? { ...i, quantity } : i);
          setItems(newItems);
          localStorage.setItem("dhyan_guest_cart", JSON.stringify(newItems));
          return { ok: true };
        }

        const response = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity })
        });
        const payload = await parseResponse(response);
        if (!response.ok) {
          return { ok: false, message: payload.message || "Unable to update cart." };
        }
        setItems(payload.items ?? []);
        return { ok: true };
      },
      async clearCart() {
        if (!authenticated) {
          setItems([]);
          localStorage.removeItem("dhyan_guest_cart");
          return { ok: true };
        }

        const response = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        if (!response.ok) {
          return { ok: false, message: "Unable to clear cart." };
        }
        setItems([]);
        return { ok: true };
      },
      refreshCart
    }),
    [authenticated, items, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }
  return context;
}
