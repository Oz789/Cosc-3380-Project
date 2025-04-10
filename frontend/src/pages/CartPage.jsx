import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button, Typography, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
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
    if (cart.length > 0) {
      navigate('/checkout', {
        state: {
          frames: cart,
        },
      });
    }
  };

  const handleGoBackToFrames = () => {
    navigate('/frames'); // Navigating to the correct path for FramesPage
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Your Cart</Typography>
        <Button onClick={handleGoBackToFrames}>Back to Frames</Button>
      </Box>
      {cart.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        cart.map((item, index) => (
          <Box key={index} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography>Price: ${item.price}</Typography>
            <Button onClick={() => handleRemove(item.frameID, item.name)}>Remove</Button>
          </Box>
        ))
      )}
      {cart.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleCheckout} mt={2}>
          Proceed to Checkout
        </Button>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={`${removedItemName} removed from cart`}
      />
    </Box>
  );
};

export default CartPage;