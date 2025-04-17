import React, { useState, useEffect, useCallback } from 'react';
import '../doctor/doctorAppointments.css';
import PatientFormViewer from '../patientPortal/patientFormViewer';
import RecAppEdit from '../appointments/recEditApp';

const groupByDate = (appointments) => {
  return appointments.reduce((acc, appt) => {
    const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
    const dateStr = dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    acc[dateStr] = acc[dateStr] || [];
    acc[dateStr].push(appt);
    return acc;
  }, {});
};

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedAppointmentID, setSelectedAppointmentID] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientName, setPatientName] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState(null);
  const [error, setError] = useState(null);

  const locationID = localStorage.getItem("userLocation"); 

  const fetchClinicAppointments = useCallback(async (locationID) => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:5001/api/appointments/clinicAppointments/${locationID}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Server error: ${errorData.error} - ${errorData.details || ''}`);
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        return [];
      }
  
      const formattedAppointments = data.map(appt => {
        try {
          const dateObj = new Date(appt.appointmentDate);
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const rawDate = `${yyyy}-${mm}-${dd}`;
          const cleanTime = appt.appointmentTime?.slice(0, 5);
  
          return {
            appointmentID: appt.appointmentNumber,
            patientID: appt.patientID,
            patientName: `${appt.patientFirstName} ${appt.patientLastName}`.trim(),
            doctorName: `${appt.doctorFirstName} ${appt.doctorLastName}`,
            appointmentDate: rawDate,
            appointmentTime: cleanTime,
            status: appt.status
          };
        } catch (err) {
          console.error("Error formatting appointment:", appt, err);
          return null;
        }
      }).filter(appt => appt !== null);
  
      return formattedAppointments;
    } catch (err) {
      console.error("Failed to fetch clinic-specific appointments:", err);
      setError(err.message);
      return [];
    }
  }, []);

  const refreshAppointments = useCallback(() => {
    if (!locationID) {
      console.warn("No location ID found in localStorage.");
      return;
    }
    fetchClinicAppointments(locationID).then(setAppointments);
  }, [locationID, fetchClinicAppointments]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const handleCheckIn = async (appointmentID) => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/checkin/${appointmentID}`, {
        method: "PATCH",
      });
  
      if (res.ok) {
        setAppointments(prev =>
          prev.map(appt =>
            appt.appointmentID === appointmentID
              ? { ...appt, status: "Checked In", checkInTime: new Date().toISOString() }
              : appt
          )
        );
        refreshAppointments();
      } else {
        throw new Error("Check-in failed");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (appointmentID, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/update-status/${appointmentID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments(prev =>
          prev.map(a =>
            a.appointmentID === appointmentID
              ? { ...a, status: newStatus }
              : a
          )
        );
        refreshAppointments();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const filtered = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleAppointments = filtered;
  const todayStr = new Date().toISOString().slice(0, 10);

  let filteredByStatus = visibleAppointments;
  if (statusFilter !== 'All') {
    filteredByStatus = filteredByStatus.filter(appt => appt.status === statusFilter);
  }
  
  const filteredByDate = showTodayOnly
    ? filteredByStatus.filter(appt => appt.appointmentDate === todayStr)
    : filteredByStatus;
  
  const grouped = groupByDate(filteredByDate);

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
        <h2 className="appointments-title">Clinic Appointments</h2>

        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            padding: '10px', 
            marginBottom: '10px', 
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Search by patient or doctor..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: showTodayOnly ? "#004c9b" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
            onClick={() => setShowTodayOnly(prev => !prev)}
          >
            {showTodayOnly ? "Show All" : "Show Today Only"}
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontWeight: "500",
              minWidth: "150px"
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked In">Checked In</option>
            <option value="In Progress">In Progress</option>
            <option value="Ended">Ended</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="appointments-section">
            <h3 className="appointments-date">{date}</h3>
            {appts.map((appt) => {
              const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
              const timeStr = dt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const monthShort = dt.toLocaleString('default', { month: 'short' });
              const day = dt.getDate();

              return (
                <div className="appointment-card" key={appt.appointmentID}>
                  <div className="appointment-date-box">
                    <div className="appointment-month">{monthShort}</div>
                    <div className="appointment-day">{day}</div>
                  </div>

                  <div className="appointment-info">
                    <div className="appointment-name">
                      {appt.patientName} - <span className="appointment-status">{appt.status}</span>
                    </div>
                    <div className="appointment-time">{timeStr}</div>
                    <div className="appointment-doctor">Doctor: {appt.doctorName}</div>
                  </div>

                  {appt.status === "Scheduled" && (
                    <button
                      className="appointment-button"
                      style={{ backgroundColor: "#00796B" }}
                      onClick={() => handleStatusUpdate(appt.appointmentID, "Checked In")}
                    >
                      Check In
                    </button>
                  )}

                  <button
                    className="appointment-button"
                    onClick={() => {
                      setSelectedPatientID(appt.patientID);
                      setSelectedAppointmentID(appt.appointmentID);
                      setPatientName(appt.patientName);
                      setViewMode("edit");
                    }}
                  >
                    Edit Appt.
                  </button>

                  <button
                    className="appointment-button"
                    onClick={() => {
                      setSelectedPatientID(appt.patientID);
                      setSelectedAppointmentID(appt.appointmentID);
                      setPatientName(appt.patientName);
                      setViewMode("view");
                    }}
                  >
                    View Form
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="appointment-right">
        {selectedPatientID ? (
          viewMode === "edit" ? (
            <RecAppEdit
              patientId={selectedPatientID}
              appointmentID={selectedAppointmentID}
              onAppointmentChange={refreshAppointments}
              patientName={selectedPatientName}
              onClose={() => {
                setSelectedAppointmentID(null);
                setViewMode(null);
              }}
            />
          ) : (
            <PatientFormViewer
              patientID={selectedPatientID}
              onClose={() => {
                setSelectedAppointmentID(null);
                setViewMode(null);
              }}
            />
          )
        ) : (
          <div className="mock-placeholder">Select an appointment to view the form</div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistAppointments;