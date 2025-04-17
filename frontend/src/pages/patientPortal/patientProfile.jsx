import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./patientProfile.css";
import NavBar from "../../components/navBar";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

const PatientProfile = () => {
  const { patientID } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    generalInfo: {},
    appointments: []
  });
  const [billingHistory, setBillingHistory] = useState([]);
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBilling, setExpandedBilling] = useState({});
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('');

  const toggleBillingDetails = (saleID) => {
    setExpandedBilling(prev => ({
      ...prev,
      [saleID]: !prev[saleID]
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/contacts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${patientData.generalInfo.firstName} ${patientData.generalInfo.lastName}`,
          email: patientData.generalInfo.email,
          phone: patientData.generalInfo.phoneNumber,
          message: contactMessage,
          status: 'Pending',
          handledByEmployeeID: null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      const data = await response.json();
      setContactStatus('Message sent successfully!');
      setContactMessage('');
      setTimeout(() => setContactStatus(''), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactStatus('Error sending message. Please try again.');
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data for patient ID:', patientID);
        
        const queryParams = new URLSearchParams({
          showPast: showPastAppointments.toString(),
          ...(selectedServiceType && { serviceType: selectedServiceType })
        });
        
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}?${queryParams}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Raw API response:', data);
        
        if (!data || !data.generalInfo) {
          throw new Error('Invalid data structure received from API');
        }
        
        console.log('Setting patient data with:', {
          generalInfo: data.generalInfo,
          appointments: data.appointments || []
        });
        
        setPatientData({
          generalInfo: data.generalInfo,
          appointments: data.appointments || []
        });
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBillingHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/billing/history/${patientID}`);
        if (!res.ok) throw new Error("Failed to fetch billing history");
        const data = await res.json();
        setBillingHistory(data);
      } catch (err) {
        console.error("Error fetching billing history:", err);
      }
    };

    fetchPatientData();
    fetchBillingHistory();
  }, [patientID, showPastAppointments, selectedServiceType]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="patient-profile-wrapper">
          <div className="loading-message">Loading patient data...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="patient-profile-wrapper">
          <div className="error-message">Error: {error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="patient-profile-wrapper">
        <div className="profile-sections-container">
          {/* General Information Section */}
          <div className="profile-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="section-title">General Information</h2>
              <IconButton
                onClick={() => navigate(`/register?patientID=${patientID}`)}
                sx={{ color: '#00796B' }}
              >
                <EditIcon />
              </IconButton>
            </div>
            <div className="profile-info">
              {patientData.generalInfo && Object.keys(patientData.generalInfo).length > 0 ? (
                <>
                  <p><strong>Name:</strong> {`${patientData.generalInfo.firstName || ''} ${patientData.generalInfo.lastName || ''}`}</p>
                  <p><strong>Email:</strong> {patientData.generalInfo.email || 'N/A'}</p>
                  <p><strong>DOB:</strong> {patientData.generalInfo.DOB ? new Date(patientData.generalInfo.DOB).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Sex:</strong> {patientData.generalInfo.sex || 'N/A'}</p>
                  <p><strong>Address:</strong> {patientData.generalInfo.address || 'N/A'}</p>
                  <p><strong>Phone:</strong> {patientData.generalInfo.phoneNumber || 'N/A'}</p>
                </>
              ) : (
                <p>No general information available</p>
              )}
            </div>
          </div>

          {/* Billing History Section */}
          <div className="profile-section">
            <h2 className="section-title">Billing History</h2>
            <div className="billing-history">
              {billingHistory.length > 0 ? (
                billingHistory.map((sale) => (
                  <div key={sale.saleID} className="billing-item">
                    <div className="billing-header">
                      <h3>Sale #{sale.saleID}</h3>
                      <p className="sale-date">Date: {new Date(sale.saleDate).toLocaleDateString()}</p>
                    </div>
                    <div className="billing-details">
                      <p><strong>Appointment Number:</strong> {sale.appointmentNumber}</p>
                      <p><strong>Total Amount:</strong> ${sale.totalAmount.toFixed(2)}</p>
                      <div className="sale-items">
                        <h4>Items Purchased:</h4>
                        <ul>
                          {sale.items && sale.items.length > 0 ? (
                            sale.items.map((item) => (
                              <li key={item.saleItemID}>
                                <span className="item-quantity">{item.quantity}x</span>
                                <span className="item-name">{item.itemType}</span>
                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))
                          ) : (
                            <li>No items found for this sale</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No billing history found</p>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="profile-section">
            <h2 className="section-title">Appointments</h2>
            <div className="appointment-filters">
              <div className="filter-group">
                <label>Show:</label>
                <select 
                  value={showPastAppointments ? 'all' : 'upcoming'}
                  onChange={(e) => setShowPastAppointments(e.target.value === 'all')}
                  className="filter-select"
                >
                  <option value="upcoming">Upcoming Appointments</option>
                  <option value="all">All Appointments</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Service Type:</label>
                <select 
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Services</option>
                  <option value="4">Eye Exam</option>
                  <option value="5">Disease and Eye Treatment</option>
                  <option value="6">Curing Blindness</option>
                </select>
              </div>
            </div>
            <div className="appointments-list">
              {patientData.appointments.length > 0 ? (
                patientData.appointments.map((appointment) => (
                  <div key={appointment.appointmentNumber} className="appointment-card">
                    <div className="appointment-header">
                      <h3>Appointment #{appointment.appointmentNumber}</h3>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-row">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{appointment.appointmentDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{appointment.appointmentTime}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Doctor:</span>
                        <span className="detail-value">{`${appointment.doctorFirstName} ${appointment.doctorLastName}`}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{appointment.serviceName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{appointment.locationName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No appointments found</p>
              )}
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="contact-section">
            <h2 className="section-title">Contact Us</h2>
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={`${patientData.generalInfo.firstName} ${patientData.generalInfo.lastName}`}
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={patientData.generalInfo.email}
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={patientData.generalInfo.phoneNumber}
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                />
              </div>
              <button type="submit" className="submit-button">Send Message</button>
              {contactStatus && (
                <div className={`status-message ${contactStatus.includes('Error') ? 'error' : 'success'}`}>
                  {contactStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;











