import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/index.js';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CART_STORAGE_KEY = 'digital_market_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
    return [];
  });

  // Save to localStorage on any cart modification
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const isInCart = (productId: string): boolean => {
    return cart.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    // Edge case: Sold out products cannot be added
    if (product.availabilityStatus !== 'AVAILABLE' || product.stockQuantity <= 0) {
      return {
        success: false,
        message: 'This product is currently sold out and cannot be added to cart.',
      };
    }

    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const currentQty = updatedCart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      // Edge case: Cannot exceed available stock
      if (targetQty > product.stockQuantity) {
        return {
          success: false,
          message: `Only ${product.stockQuantity} unit(s) available in stock.`,
        };
      }

      updatedCart[existingIndex].quantity = targetQty;
      // Sync latest product price and specs
      updatedCart[existingIndex].product = product;
    } else {
      if (quantity > product.stockQuantity) {
        return {
          success: false,
          message: `Only ${product.stockQuantity} unit(s) available in stock.`,
        };
      }

      updatedCart.push({
        product,
        quantity,
      });
    }

    setCart(updatedCart);
    return {
      success: true,
      message: `${product.name} added to cart!`,
    };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          // Cap at available stock
          const safeQty = Math.min(quantity, item.product.stockQuantity);
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    return acc + Number(item.product.sellingPrice) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
