import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DoctorHeader from "./doctorHeader";
import DoctorTabs from "./doctorTabs";
import DoctorTabContent from "./doctorTabContent";

const DoctorProfilePage = () => {
  const { doctorID } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  const fetchDoctorData = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/doctors/${doctorID}`);
      if (!res.ok) {
        throw new Error('Failed to fetch doctor data');
      }
      const data = await res.json();
      setDoctor(data);
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError(err.message);
    }
  }, [doctorID]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/doctors/${doctorID}/appointments`);
      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    }
  }, [doctorID]);

  useEffect(() => {
    fetchDoctorData();
    fetchAppointments();
  }, [fetchDoctorData, fetchAppointments]);

  const doctorInfo = {
    name: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Loading...',
    role: doctor?.specialization || "Doctor",
    avatar: "/Images/dog-secretary.webp" 
  };

  return (
    <div>
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          marginBottom: '10px', 
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <DoctorHeader name={doctorInfo.name} role={doctorInfo.role} avatar={doctorInfo.avatar} />
      <DoctorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <DoctorTabContent
        activeTab={activeTab}
        doctor={doctor}
        appointments={appointments}
        patients={patients}
      />
    </div>
  );
};

export default DoctorProfilePage;

