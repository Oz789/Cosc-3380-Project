import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdditionalDetailsForm({ nextStep, prevStep, values, handleChange, setPatientId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(values);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    handleChange(newData);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/patients/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit form');

      setPatientId(data.patientId); // Save for appointment
      nextStep(); // 👈 advance to ScheduleAppointment
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Additional Details</h2>
      <div className="form-group">
        <textarea 
          placeholder="Allergies" 
          value={formData.allergies} 
          onChange={(e) => handleInputChange('allergies', e.target.value)} 
        />
      </div>
      <div className="form-group">
        <textarea 
          placeholder="Additional Notes" 
          value={formData.additionalDetails} 
          onChange={(e) => handleInputChange('additionalDetails', e.target.value)} 
        />
      </div>

      <div className="nav-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
