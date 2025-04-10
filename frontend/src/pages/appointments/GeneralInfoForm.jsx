import React, { useState } from 'react';

export default function GeneralInfoForm({ nextStep, handleChange, values }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(values);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Sex validation
    if (!formData.sex) {
      newErrors.sex = 'Please select your sex';
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    handleChange(newData);
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    const newData = { ...formData, emergencyContacts: newContacts };
    setFormData(newData);
    handleChange(newData);
  };

  const addEmergencyContact = () => {
    const newData = {
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '' }]
    };
    setFormData(newData);
    handleChange(newData);
  };

  const handleNext = () => {
    console.log('Form data before next step:', formData);
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="form-container">
      <h2>General Information</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          className={errors.firstName ? 'error' : ''}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          className={errors.lastName ? 'error' : ''}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <input
          type="date"
          value={formData.DOB}
          onChange={(e) => handleInputChange('DOB', e.target.value)}
        />
      </div>

      <div className="form-group">
      <select
        value={formData.sex}
        onChange={(e) => handleInputChange('sex', e.target.value)}
        className={errors.sex ? 'error' : ''}
      >
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>


        {errors.sex && <span className="error-message">{errors.sex}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Occupation"
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          className={errors.occupation ? 'error' : ''}
        />
        {errors.occupation && <span className="error-message">{errors.occupation}</span>}
      </div>

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={errors.phoneNumber ? 'error' : ''}
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>

      <h3>Emergency Contacts (Optional)</h3>
      {formData.emergencyContacts.map((contact, idx) => (
        <div key={idx} className="emergency-contact">
          <div className="form-group">
            <input
              type="text"
              placeholder="Contact Name"
              value={contact.name}
              onChange={(e) => handleEmergencyContactChange(idx, 'name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              placeholder="Contact Phone"
              value={contact.phone}
              onChange={(e) => handleEmergencyContactChange(idx, 'phone', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button onClick={addEmergencyContact}>Add Contact</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
