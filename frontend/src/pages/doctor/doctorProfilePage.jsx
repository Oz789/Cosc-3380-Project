import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch(`http://localhost:5001/api/doctors/${doctorID}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data))
      .catch((err) => console.error("Error fetching doctor:", err));
  }, [doctorID]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/doctors/${doctorID}/appointments`)

      .then((res) => res.json())
      .then(setAppointments)
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [doctorID]);

  if (!doctor) return <p>Loading profile...</p>;

  const doctorInfo = {
    name: `${doctor.firstName} ${doctor.lastName}`,
    role: doctor.specialization || "Doctor",
    avatar: "/Images/dog-secretary.webp" 
  };

  return (
    <div>
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

