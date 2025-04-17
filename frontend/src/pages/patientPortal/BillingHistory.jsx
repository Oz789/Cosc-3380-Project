import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BillingHistory.css';

const BillingHistory = () => {
  const { patientID } = useParams();
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/billing/history/${patientID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch billing history');
        }
        const data = await response.json();
        setBillingHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, [patientID]);

  if (loading) return <div className="billing-container">Loading billing history...</div>;
  if (error) return <div className="billing-container">Error: {error}</div>;

  return (
    <div className="billing-container">
      <h2>Billing History</h2>
      {billingHistory.length === 0 ? (
        <p>No billing history found</p>
      ) : (
        <div className="billing-list">
          {billingHistory.map((sale) => (
            <div key={sale.saleID} className="billing-item">
              <div className="billing-header">
                <h3>Sale #{sale.saleID}</h3>
                <p className="sale-date">Date: {new Date(sale.saleDate).toLocaleDateString()}</p>
              </div>
              <div className="billing-details">
                <p><strong>Appointment Number:</strong> {sale.appointmentNumber}</p>
                <p><strong>Total Amount:</strong> ${sale.totalAmount.toFixed(2)}</p>
              </div>
              <div className="sale-items">
                <h4>Items Purchased:</h4>
                <ul>
                  {sale.items.map((item) => (
                    <li key={item.saleItemID}>
                      {item.quantity}x {item.itemType} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillingHistory; 