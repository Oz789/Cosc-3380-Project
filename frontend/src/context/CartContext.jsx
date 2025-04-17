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
*/
// CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userID, setUserID] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [errorPatient, setErrorPatient] = useState('');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState('');

  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      setUserID(storedUserID);
      fetchPatientData(storedUserID);
    } else {
      setLoadingPatient(false);
    }
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    setLoadingServices(true);
    setErrorServices('');
    try {
      const response = await fetch('http://localhost:5001/api/services');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch services data');
      }
      const data = await response.json();
      setServices(data);
      setLoadingServices(false);
    } catch (error) {
      console.error('Error fetching services data:', error);
      setErrorServices(error.message);
      setLoadingServices(false);
    }
  };

  const fetchPatientData = async (currentUserID) => {
    setLoadingPatient(true);
    setErrorPatient('');
    try {
      const response = await fetch(`http://localhost:5001/api/user/${currentUserID}/patient`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch patient data');
      }
      const data = await response.json();
      setPatientData(data);
      setLoadingPatient(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setErrorPatient(error.message);
      setLoadingPatient(false);
    }
  };

  const addToCart = (frame) => {
    setCart((prevCart) => [...prevCart, frame]);
  };

  const removeFromCart = (frameID) => {
    setCart((prevCart) => prevCart.filter((item) => item.frameID !== frameID));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getServiceDetails = (serviceId) => {
    if (loadingServices) return null;
    if (errorServices) return null;
    const service = services.find((s) => s.serviceID === serviceId);
    if (service && service.price !== null && service.price !== undefined) {
      return { ...service, price: parseFloat(service.price) }; // Convert price to a number
    }
    return service;
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0) +
    (patientData?.service1ID ? (getServiceDetails(patientData.service1ID)?.price || 0) : 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        userID,
        patientData,
        loadingPatient,
        errorPatient,
        services,
        loadingServices,
        errorServices,
        getServiceDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};