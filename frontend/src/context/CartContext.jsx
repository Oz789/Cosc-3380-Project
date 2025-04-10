/*
// CartContext.jsx
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (frame) => {
    setCart((prevCart) => [...prevCart, frame]);
  };

  const removeFromCart = (frameID) => { // Changed parameter name to frameID
    setCart((prevCart) => prevCart.filter((item) => item.frameID !== frameID)); // Changed item.id to item.frameID
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
<<<<<<< HEAD
*/
// CartContext.jsx
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (frame) => {
    setCart((prevCart) => [...prevCart, frame]);
  };

  const removeFromCart = (frameID) => {
    setCart((prevCart) => prevCart.filter((item) => item.frameID !== frameID));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
=======

>>>>>>> a3649b73bbb75ccbb05537f6830eefd1aa398971
