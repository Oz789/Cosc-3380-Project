/*
  // CartPage.jsx
  import React, { useState, useEffect, useMemo } from 'react';
  import { useCart } from '../context/CartContext';
  import { Button, Typography, Box, Snackbar, Table, TableBody, TableRow, TableCell } from '@mui/material';
  import { useNavigate } from 'react-router-dom';

  const CartPage = () => {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [removedItemName, setRemovedItemName] = useState('');
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

    const handleRemove = (frameID, itemName) => {
      removeFromCart(frameID);
      setRemovedItemName(itemName);
      setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };

    const handleCheckout = () => {
      if (cart.length > 0) {
        navigate('/checkout', {
          state: {
            frames: cart,
            userID: userID,
            patientData: patientData,
          },
        });
      }
    };

    const handleGoBackToFrames = () => {
      navigate('/frames');
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

    const total = useMemo(() => {
      let frameTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const serviceDetails = patientData?.service1ID ? getServiceDetails(patientData.service1ID) : null;
      const servicePrice = serviceDetails ? parseFloat(serviceDetails.price) : 0;
      return frameTotal + servicePrice;
    }, [cart, patientData, loadingServices, errorServices, services]);

    return (
      <Box p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Your Cart</Typography>
          <Button onClick={handleGoBackToFrames}>Back to Frames</Button>
        </Box>

        {userID && patientData && (
          <Box mb={2}>
            <Typography variant="subtitle1">
              {patientData.firstName} {patientData.lastName}
            </Typography>
          </Box>
        )}

        {loadingPatient && <Typography>Loading patient data...</Typography>}
        {errorPatient && <Typography color="error">Error: {errorPatient}</Typography>}
        {patientData && patientData.service1ID !== null && (  // Check if patientData exists
          <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">
                {loadingServices
                  ? 'Loading Service...'
                  : errorServices
                    ? 'Error Loading Service'
                    : getServiceDetails(patientData.service1ID)?.serviceName || 'Service'}
              </Typography>
              <Typography>
                Price: $
                {loadingServices
                  ? '...'
                  : errorServices
                    ? 'N/A'
                    : (getServiceDetails(patientData.service1ID)?.price !== undefined && getServiceDetails(patientData.service1ID)?.price !== null)
                      ? getServiceDetails(patientData.service1ID)?.price?.toFixed(2)
                      : '0.00'}
              </Typography>
            </Box>
        
          </Box>
        )}
        {patientData && patientData.service1ID === null && (  // Check if patientData exists
          <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">No Appointment Selected</Typography>
            </Box>
          </Box>
        )}
        {!patientData && (
          <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">No Patient Data</Typography>
            </Box>
          </Box>
        )}

        <Box display="flex" flexDirection="column">
          {cart.length === 0 && (!patientData || patientData.service1ID === null) && ( // Check if patientData exists
            <Typography>No items or services in cart.</Typography>
          )}
          {cart.length === 0 && patientData && patientData.service1ID !== null && ( // Check if patientData exists
            <Typography>No frames in cart.</Typography>
          )}
          {cart.length > 0 && (
            <Box flexGrow={1}>
              {cart.map((item, index) => {
                return (
                  <Box key={index} mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography>Price: ${item.price}</Typography>
                      <Typography variant="body2">Prescription: </Typography>
                    </Box>
                    <Button color="secondary" onClick={() => handleRemove(item.frameID, item.name)}>Remove</Button>
                  </Box>
                );
              })}
            </Box>
          )}
          <Box mt={2} ml={0} width={200}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        {(cart.length > 0 || (patientData && patientData.service1ID !== null)) && ( // Check if patientData exists
          <Button variant="contained" color="primary" onClick={handleCheckout} mt={2}>
            Proceed to Checkout
          </Button>
        )}
      </Box>
    );
  };

  export default CartPage;
*/
// CartPage.jsx
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Button, Typography, Box, Snackbar, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    userID,
    patientData,
    loadingPatient,
    errorPatient,
    getServiceDetails,
    loadingServices,
    errorServices,
  } = useCart();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [removedItemName, setRemovedItemName] = useState('');

  const handleRemove = (frameID, itemName) => {
    removeFromCart(frameID);
    setRemovedItemName(itemName);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCheckout = () => {
    if (cart.length > 0 || (patientData && patientData.service1ID !== null)) {
      navigate('/checkout', {
        state: {
          frames: cart,
          userID: userID,
          patientData: patientData,
        },
      });
    }
  };

  const handleGoBackToFrames = () => {
    navigate('/frames');
  };

  const total = useMemo(() => {
    let frameTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const serviceDetails = patientData?.service1ID ? getServiceDetails(patientData.service1ID) : null;
    const servicePrice = serviceDetails ? parseFloat(serviceDetails.price) : 0;
    return frameTotal + servicePrice;
  }, [cart, patientData, getServiceDetails]);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Your Cart</Typography>
        <Button onClick={handleGoBackToFrames}>Back to Frames</Button>
      </Box>

      {userID && patientData && (
        <Box mb={2}>
          <Typography variant="subtitle1">
            {patientData.firstName} {patientData.lastName}
          </Typography>
        </Box>
      )}

      {loadingPatient && <Typography>Loading patient data...</Typography>}
      {errorPatient && <Typography color="error">Error: {errorPatient}</Typography>}
      {patientData && patientData.service1ID !== null && ( // Check if patientData exists
        <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              {loadingServices
                ? 'Loading Service...'
                : errorServices
                  ? 'Error Loading Service'
                  : getServiceDetails(patientData.service1ID)?.serviceName || 'Service'}
            </Typography>
            <Typography>
              Price: $
              {loadingServices
                ? '...'
                : errorServices
                  ? 'N/A'
                  : (getServiceDetails(patientData.service1ID)?.price !== undefined && getServiceDetails(patientData.service1ID)?.price !== null)
                    ? getServiceDetails(patientData.service1ID)?.price?.toFixed(2)
                    : '0.00'}
            </Typography>
          </Box>
          {/* No Remove Button for Service */}
        </Box>
      )}
      {patientData && patientData.service1ID === null && ( // Check if patientData exists
        <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">No Appointment Selected</Typography>
          </Box>
        </Box>
      )}
      {!patientData && (
        <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">No Patient Data</Typography>
          </Box>
        </Box>
      )}

      <Box display="flex" flexDirection="column">
        {cart.length === 0 && (!patientData || patientData.service1ID === null) && ( // Check if patientData exists
          <Typography>No items or services in cart.</Typography>
        )}
        {cart.length === 0 && patientData && patientData.service1ID !== null && ( // Check if patientData exists
          <Typography>No frames in cart.</Typography>
        )}
        {cart.length > 0 && (
          <Box flexGrow={1}>
            {cart.map((item, index) => {
              return (
                <Box key={index} mt={2} p={2} border="1px solid #ccc" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography>Price: ${item.price}</Typography>
                    <Typography variant="body2">Prescription: {/* Prescription data will go here */}</Typography>
                  </Box>
                  <Button color="secondary" onClick={() => handleRemove(item.frameID, item.name)}>Remove</Button>
                </Box>
              );
            })}
          </Box>
        )}
        <Box mt={2} ml={0} width={200}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>

      {(cart.length > 0 || (patientData && patientData.service1ID !== null)) && ( // Check if patientData exists
        <Button variant="contained" color="primary" onClick={handleCheckout} mt={2}>
          Proceed to Checkout
        </Button>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`${removedItemName} removed from cart`}
      />
    </Box>
  );
};

export default CartPage;