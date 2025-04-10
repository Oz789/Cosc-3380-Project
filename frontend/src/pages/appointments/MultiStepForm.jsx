import React, { useState } from 'react';
import GeneralInfoForm from './GeneralInfoForm';
import MedicalInfoForm from './MedicalInfoForm';
import AdditionalDetailsForm from './AdditionalDetailsForm';
import ScheduleAppointment from './ScheduleAppointment'; // NEW
import UserNavbar from "../../components/navBar";
//import UsernavBar from "../../components/navBar";
import './form.css';

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [patientId, setPatientId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phoneNumber: '',
    address: '',
    sex: '',
    password: '',
    occupation: '',
    insurance: '',
    emergencyContacts: [{ name: '', phone: '' }],
    lastExamDate: '',
    usesCorrectiveLenses: false,
    usesContacts: false,
    LensesPrescription: '',
    ContactsPrescription: '',
    lastPrescriptionDate: '',
    healthConcerns: [],
    otherConcerns: '',
    conditions: [],
    otherConditions: '',
    hadSurgery: false,
    surgeries: [],
    otherSurgeries: '',
    allergies: '',
    additionalDetails: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (newData) => {
    setFormData({ ...formData, ...newData });
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

      setPatientId(data.patientId); // Save ID for appointment
      nextStep(); // Proceed to schedule appointment
    } catch (error) {
      alert(error.message);
    }
  };

  const progressPercent = (step / totalSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <GeneralInfoForm
            nextStep={nextStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 2:
        return (
          <MedicalInfoForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 3:
        return (
          <AdditionalDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            setPatientId={setPatientId}
            values={formData}
            handleChange={handleChange}
          />
        );
      case 4:
        return (
          <ScheduleAppointment
            prevStep={prevStep}
            patientId={patientId}
          />
        );
      default:
        return null;
    }
  };
  

  return (
    <>
      <UserNavbar />
      <div className="form-container">
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        {renderStep()}
      </div>
    </>
  );
}
