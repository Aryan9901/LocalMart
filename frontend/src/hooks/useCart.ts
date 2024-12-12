import { create } from 'zustand';
import { Product } from '@/types';

interface CartStore {
  items: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeFromCart: (productId) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === productId
      );
      if (existingItem?.quantity === 1) {
        return {
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    });
  },
  clearCart: () => set({ items: [] }),
  getItemQuantity: (productId) => {
    const item = get().items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalAmount: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
}));