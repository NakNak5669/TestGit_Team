import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "nakshop_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // ✅ Restore cart once on first load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
  }, []);

  // ✅ Save cart whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
    setItems((prev) => {
      const found = prev.find((x) => x.product.id === product.id);
      if (found) {
        return prev.map((x) =>
          x.product.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((x) => x.product.id !== id));
  }

  function setQty(id, qty) {
    const n = Number(qty);
    if (!Number.isFinite(n)) return;

    setItems((prev) => {
      if (n <= 0) return prev.filter((x) => x.product.id !== id);
      return prev.map((x) => (x.product.id === id ? { ...x, qty: n } : x));
    });
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.qty * it.product.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartCount,
      subtotal,
    }),
    [items, cartCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}