// PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
import axios from "axios";
import "./paymentForm.css";
import { useCart } from "../../context/CartContext"; // Import the useCart hook

function PaymentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // Access the clearCart function
=======
import "./paymentForm.css"; // Import the CSS file for styling

function PaymentForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
>>>>>>> a3649b73bbb75ccbb05537f6830eefd1aa398971

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
        email: " "
    });

<<<<<<< HEAD
  const [frameData, setFrameData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frameData.length) {
      alert("Missing frame data.");
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
=======
    const [frameData, setFrameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (state && state.frame) {
            setFrameData(state.frame);
            setLoading(false);
        } else {
            setError("Frame data not available.");
            setLoading(false);
            // Optionally, redirect back to the frames page
            // navigate('/frames');
        }
    }, [state, navigate]);

    const handleChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (frameData) {
            console.log("Payment Info:", paymentInfo);
            console.log("Frame Data:", frameData);
            alert(`Payment processed successfully for ${frameData.name}! (Check console for details)`);
            // In a real application, you would send this data to your backend for processing.
        } else {
            alert("Error: No frame data to process payment for.");
        }
    };

    if (loading) {
        return <div>Loading payment information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
>>>>>>> a3649b73bbb75ccbb05537f6830eefd1aa398971
    }

<<<<<<< HEAD
  if (loading) return <div>Loading payment form...</div>;
=======
    if (!frameData) {
        return <div>Frame data not available. Please return to the frames page and try again.</div>;
    }

    return (
        <div className="payment-container">
            <h1>Payment Information for {frameData.name}</h1>
            {state && state.prescription && <h2>Prescription: {state.prescription}</h2>}

            <form onSubmit={handleSubmit} className="payment-form">
                <fieldset>
                    <legend>Payment Information</legend>
                    <label>Cardholder's Name:</label>
                    <input type="text" name="cardName" value={paymentInfo.cardName} onChange={handleChange} required />
>>>>>>> a3649b73bbb75ccbb05537f6830eefd1aa398971

                    <label>Card Number:</label>
                    <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleChange} required />

                    <label>Card Security Code (CVV):</label>
                    <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handleChange} required />

                    <label>Expiration Date:</label>
                    <input type="month" name="expiry" value={paymentInfo.expiry} onChange={handleChange} required />
                </fieldset>

                <fieldset>
                    <legend>Billing Information</legend>
                    <label>Address Line 1:</label>
                    <input type="text" name="address" value={paymentInfo.address} onChange={handleChange} required />

                    <label>Address Line 2:</label>
                    <input type="text" name="address2" value={paymentInfo.address2} onChange={handleChange} />

                    <label>Country:</label>
                    <select name="country" value={paymentInfo.country} onChange={handleChange}>
                        <option>United States</option>
                    </select>

                    <label>ZIP Code:</label>
                    <input type="text" name="zipCode" value={paymentInfo.zipCode} onChange={handleChange} required />

                    <label>City:</label>
                    <input type="text" name="city" value={paymentInfo.city} onChange={handleChange} />

                    <label>State:</label>
                    <input type="text" name="state" value={paymentInfo.state} onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <legend>Receipt Information</legend>
                    <label>Email Address:</label>
                    <input type="email" name="email" value={paymentInfo.email} onChange={handleChange} />
                </fieldset>

                <div className="form-buttons">
                    <button type="submit">Continue</button>
                    <button type="button" onClick={() => navigate("/frames")} className="exit-btn">Exit</button>
                </div>
            </form>
        </div>
    );
}

export default PaymentForm;