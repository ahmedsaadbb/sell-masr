"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
  isRTL: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Encryption helper functions
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_CART_ENCRYPTION_KEY || "default-key-change-me";

const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Use sessionStorage with encrypted data
    const savedCart = sessionStorage.getItem("sellmasr_cart_encrypted");
    if (savedCart) {
      const decryptedCart = decryptData(savedCart);
      if (decryptedCart) setCart(decryptedCart);
    }
  }, []);

  useEffect(() => {
    // Encrypt data before saving to sessionStorage
    if (cart.length > 0) {
      const encryptedCart = encryptData(cart);
      sessionStorage.setItem("sellmasr_cart_encrypted", encryptedCart);
    } else {
      sessionStorage.removeItem("sellmasr_cart_encrypted");
    }
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, isRTL: true }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
