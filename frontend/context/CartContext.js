'use client';
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Sync cart with localStorage when it changes, but only after initial load
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (product, qty = 1, size = 'M') => {
    setCartItems((prevItems) => {
      // Find if item with same ID and size already exists
      const existItem = prevItems.find(
        (x) => x.product === product._id && x.size === size
      );

      if (existItem) {
        // Limit quantity to stock
        const newQty = Math.min(existItem.qty + qty, product.countInStock);
        return prevItems.map((x) =>
          x.product === product._id && x.size === size
            ? { ...x, qty: newQty }
            : x
        );
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images && product.images[0] ? product.images[0] : product.image,
            qty: Math.min(qty, product.countInStock),
            size,
            countInStock: product.countInStock,
          },
        ];
      }
    });
  };

  const updateCartQty = (productId, size, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === productId && x.size === size ? { ...x, qty: Number(qty) } : x
      )
    );
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((x) => !(x.product === productId && x.size === size))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Compute helpers
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartItemsCount,
        cartTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
