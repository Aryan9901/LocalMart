import { useState, useEffect } from "react";

export function useCart() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.weight === item.weight
      );
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (itemId, weight) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === itemId && item.weight === weight))
    );
  };

  const updateQuantity = (itemId, weight, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId && item.weight === weight
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
}
