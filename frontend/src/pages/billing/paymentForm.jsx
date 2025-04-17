// PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./paymentForm.css";
import { useCart } from "../../context/CartContext"; // Import the useCart hook

function PaymentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // Access the clearCart function

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    address: "",
    address2: "",
    country: "United States",
    zipCode: "",
    city: "",
    state: "",
    email: " ",
  });

  const [frameData, setFrameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state?.frames?.length) {
      setFrameData(state.frames);
      setLoading(false);
    } else {
      alert("Missing cart data. Please return to the frames page.");
      navigate("/frames");
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    // Clear any specific error when the user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!paymentInfo.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
      isValid = false;
    }
    if (!/^\d{13,19}$/.test(paymentInfo.cardNumber.trim())) {
      newErrors.cardNumber = "Invalid card number";
      isValid = false;
    }
    if (!/^\d{3,4}$/.test(paymentInfo.cvv.trim())) {
      newErrors.cvv = "Invalid CVV";
      isValid = false;
    }
    if (!paymentInfo.expiry) {
      newErrors.expiry = "Expiration date is required";
      isValid = false;
    }
    if (!paymentInfo.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!/^\d{5}(?:-\d{4})?$/.test(paymentInfo.zipCode.trim())) {
      newErrors.zipCode = "Invalid ZIP code";
      isValid = false;
    }
    if (!paymentInfo.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!paymentInfo.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }
    if (paymentInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentInfo.email.trim())) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frameData.length) {
      alert("Missing frame data.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Logging for debugging
    console.log("Submitting checkout with items:", frameData);

    try {
      const response = await axios.post("http://localhost:5001/api/checkout", {
        items: frameData.map((frame) => ({
          frameID: frame.frameID || null,
          contactID: frame.contactID || null,
        })),
        paymentInfo: paymentInfo, // Include payment information in the request if needed
      });

      alert(`Payment processed successfully! Total: $${response.data.totalPrice.toFixed(2)}`);

      // Clear the cart after successful payment
      clearCart();
      console.log("Cart cleared after successful payment.");

      navigate("/frames"); // Or navigate to an order confirmation page
    } catch (err) {
      console.error("Checkout error:", err);
      const message = err.response?.data?.error || "An error occurred while processing your payment.";
      alert(`Payment failed: ${message}`);
    }
  };

  if (loading) return <div>Loading payment form...</div>;

  return (
    <div className="payment-form-container"> {/* Consistent container class */}
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit} className="payment-form"> {/* Added form class for styling */}
        <fieldset className="card-details"> {/* More descriptive class */}
          <legend>Card Details</legend>
          <div className="form-group"> {/* Grouping labels and inputs */}
            <label htmlFor="cardName">Name on Card:</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={paymentInfo.cardName}
              onChange={handleChange}
              required
            />
            {errors.cardName && <p className="error-message">{errors.cardName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleChange}
              required
            />
            {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
          </div>

          <div className="form-group card-details-group"> {/* Using a specific group for layout */}
            <div>
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleChange}
                required
              />
              {errors.cvv && <p className="error-message">{errors.cvv}</p>}
            </div>
            <div>
              <label htmlFor="expiry">Expiration Date:</label>
              <input
                type="month"
                id="expiry"
                name="expiry"
                value={paymentInfo.expiry}
                onChange={handleChange}
                required
              />
              {errors.expiry && <p className="error-message">{errors.expiry}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="billing-information"> {/* More descriptive class */}
          <legend>Billing Information</legend>
          <div className="form-group">
            <label htmlFor="address">Address Line 1:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={paymentInfo.address}
              onChange={handleChange}
              required
            />
            {errors.address && <p className="error-message">{errors.address}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2:</label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={paymentInfo.address2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select id="country" name="country" value={paymentInfo.country} onChange={handleChange}>
              <option>United States</option>
            </select>
          </div>

          <div className="form-group zip-city-state-group"> {/* Group for horizontal layout */}
            <div>
              <label htmlFor="zipCode">ZIP Code:</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={paymentInfo.zipCode}
                onChange={handleChange}
                required
              />
              {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={paymentInfo.city}
                onChange={handleChange}
              />
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={paymentInfo.state}
                onChange={handleChange}
              />
              {errors.state && <p className="error-message">{errors.state}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="receipt-information"> {/* More descriptive class */}
          <legend>Receipt Information</legend>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={paymentInfo.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
        </fieldset>

        <div className="form-buttons">
          <button type="submit" className="submit-button">Continue</button> {/* More specific class */}
          <button type="button" onClick={() => navigate("/frames")} className="exit-button">Exit</button> {/* More specific class */}
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;