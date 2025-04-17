import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './receptionistApp.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function RecAppEdit({ patientId, appointmentID, onAppointmentChange, onClose, patientName }) {
  const [appointments, setAppointments] = useState({});
  const [selected, setSelected] = useState({ date: '', time: '', doctorId: '', service1ID: '4' });
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  const [baseDate, setBaseDate] = useState(new Date());
  const navigate = useNavigate();
  const daysToShow = 7;
  const buffer = 4;

  useEffect(() => {
    console.log("Appointments state changed:", appointments);
  }, [appointments]);
  // ---------------- TIME HELPERS ----------------
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
  
    if (modifier === 'PM' && hours !== '12') hours = String(+hours + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
  
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const getFormattedDate = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-CA');
  };

  const getDayName = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    while (sh < eh || (sh === eh && sm < em)) {
      const time = new Date(0, 0, 0, sh, sm).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      slots.push(time);
      sm += 60;
      if (sm >= 60) {
        sh++;
        sm = 0;
      }
    }
    return slots;
  };

  // ---------------- DATA FETCHING ----------------
  const fetchLocations = async () => {
    const res = await fetch('http://localhost:5001/api/locations');
    const data = await res.json();
    setLocations(data);
  };

  const fetchSchedules = async (locationID) => {
    const res = await fetch(`http://localhost:5001/api/schedule/location/${locationID}`);
    const data = await res.json();
    setDoctorSchedules(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch(`http://localhost:5001/api/appointments?locationID=${selectedLocation}`);
    const data = await res.json();
  
    console.log("📦 Raw API data:", data); // ← FULL object
  
    const map = {};
    data.forEach(({ appointmentDate, appointmentTime }) => {
      const dateStr = appointmentDate.substring(0, 10);
      const timeStr = appointmentTime.trim().padStart(8, '0');
  
      console.log(`Extracted date: ${dateStr}, time: ${timeStr}`); // ← Track parsed values
  
      if (!map[dateStr]) map[dateStr] = new Set();
      map[dateStr].add(timeStr);
      console.log(`Mapped DB date → ${appointmentDate} → ${dateStr} with time ${timeStr}`);
    });
  
    console.log("Final Appointments Before Set:", map);
    setAppointments(map);
  };
  
  

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchSchedules(selectedLocation);
      fetchAppointments();
    }
  }, [selectedLocation]);

  // ---------------- ACTIONS ----------------
  const handleSelect = (date, time, doctorId, service1ID) => {
    setSelected({ date, time, doctorId, service1ID });
  };

  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/${appointmentID}`, {
        method: 'DELETE',
      });

      if (onAppointmentChange) {
        onAppointmentChange();
      }
  
      if (res.ok) {
        alert("Appointment cancelled successfully.");
        fetchAppointments();
        if (onClose) onClose();
        
      } else {
        alert("Failed to cancel the appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("An error occurred.");
    }
  };

  const handleConfirm = async () => {
    const { date, time, doctorId, service1ID } = selected;
    console.log("🟢 Confirming:", selected);

    if (!date || !time || !doctorId || !service1ID) {
      console.warn("❌ Missing required fields");
      console.log("d: " + date + " time: " + time + " doctorId: " + doctorId + " service1Id: " + service1ID);
      return;
    }
      

    const time24 = convertTo24Hour(time);

    console.log("🟡 Request payload", {
        date,
        time: time24,
        patientId,
        doctorId,
        service1ID,
        appointmentID,
        locationID: selectedLocation
      });

    const res = await fetch('http://localhost:5001/api/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        time: time24,
        patientId,
        doctorId,
        service1ID: service1ID,
        appointmentID,
        locationID: selectedLocation,
        status: 'Scheduled'

      }),
    });

    if (res.ok) {
      alert('Appointment scheduled!');
      await fetchAppointments(); 
      if (onAppointmentChange) onAppointmentChange();
      
    } else {
      alert('That time is no longer available.');
    }
  };

  // ---------------- DISPLAY ----------------
  const scheduleMap = {};
  doctorSchedules.forEach((entry) => {
    if (!scheduleMap[entry.dayOfWeek]) scheduleMap[entry.dayOfWeek] = [];
    scheduleMap[entry.dayOfWeek].push(entry);
  });

  return (
    <div className="rec-page">
      <div className="rec-container ">
        <div className="rec-box fex">
          <h2 className="rec-title">Reschedule Appointment</h2>
          <p className="starter"> Appointment for:  {`${patientName}`}</p>

          {/* SELECT LOCATION */}
          <div className="rec-row">
            <p>Select Location:</p>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>

              {locations.map((loc) => (
                <option key={loc.locationID} value={loc.locationID}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

        {selectedLocation && (
          <div>
          <div className="calendar-picker-container"> 
            <label>Select Week:</label>
            <DatePicker
              selected={baseDate}
              onChange={(date) => setBaseDate(date)}
              dateFormat="MMMM d, yyyy"
              inline
              showPopperArrow={false}
              minDate={new Date()}
            />
          </div>

          {/* TIME SLOT PICKER */}
          
            <div className="appointment-grid" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daysToShow}, minmax(20px, 1fr))`, gap: '10px' }}>
              
              {(() => {
  // const baseDate = new Date();
  // baseDate.setHours(12); 

  const startDate = new Date(baseDate);
  startDate.setHours(12);

  

  return [...Array(daysToShow)].map((_, idx) => {
    const dateObj = new Date(startDate);
    dateObj.setDate(startDate.getDate() + idx);

    const dateStr = dateObj.toISOString().split('T')[0];
    const abbrevDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
    const readableDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }); // e.g., "Apr 15, 2025"

    const schedules = scheduleMap[dateObj.toLocaleDateString('en-US', { weekday: 'long' })] || [];

    return (
      <div key={dateStr} className="time-column">
        <div className="day-header">
          <span className="day-abbrev">{abbrevDay}</span>
          <span className="day-date">{readableDate}</span>
        </div>

        {schedules.map((sched) => {
          const slots = generateTimeSlots(sched.startTime, sched.endTime);
          return (
            <div key={`${sched.doctorID}-${sched.scheduleID}`} className="slot-group">
              {slots.map((hour) => {
                const hour24 = convertTo24Hour(hour);
                const isBooked = appointments[dateStr]?.has(hour24);
                const isSelected =
                  selected.date === dateStr &&
                  convertTo24Hour(selected.time) === hour24 &&
                  selected.doctorId === sched.doctorID;

                return (
                  <button
                    key={hour}
                    onClick={() => handleSelect(dateStr, hour, sched.doctorID, buffer)}
                    disabled={isBooked}
                    className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  });
})()}

    </div>
  </div>
  </div>
)}

          
          <div className="nav-buttons" style={{ marginTop: '2rem' }}>
            <button onClick={handleCancel}>Cancel Appointment Instead</button>

            {/* CONFIRM BUTTON */}
            <button
              onClick={handleConfirm}
              disabled={!selected.date || !selected.time || !selected.doctorId}
            >
              Confirm Appointment 
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
