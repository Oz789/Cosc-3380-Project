import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleAppointment.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ScheduleAppointment({ prevStep, patientId }) {
  const [appointments, setAppointments] = useState({});
  const [selected, setSelected] = useState({ date: '', time: '', doctorId: ''});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  const [baseDate, setBaseDate] = useState(new Date());
  const navigate = useNavigate();
  const daysToShow = 7;
  const buffer = 4;

  useEffect(() => {
    console.log("Appointments state changed:", appointments);
  }, [appointments]);

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

  const toInt = (value) => parseInt(value, 10);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    
    console.log(`Generating slots from ${start} to ${end}`);
    console.log(`Parsed times - Start: ${sh}:${sm}, End: ${eh}:${em}`);
    
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
    
    console.log(`Generated slots:`, slots);
    return slots;
  };

  const fetchLocations = async () => {
    const res = await fetch('http://localhost:5001/api/locations');
    const data = await res.json();
    console.log("Locations data:", data);
    setLocations(data);
  };

  const fetchSchedules = async (locationID) => {
    const res = await fetch(`http://localhost:5001/api/schedule/location/${locationID}`);
    const data = await res.json();
    console.log("Schedule Data:", data);
    
    // Log Friday's schedule specifically
    const fridaySchedule = data.find(sched => sched.dayOfWeek === 'Friday');
    if (fridaySchedule) {
      console.log("Friday's schedule:", fridaySchedule);
      console.log(`Friday's time range: ${fridaySchedule.startTime} to ${fridaySchedule.endTime}`);
    }
    
    setDoctorSchedules(data);
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments?locationID=${selectedLocation}`);
      const data = await res.json();
    
      console.log("📦 Raw API data:", data);
    
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        return;
      }
    
      const map = {};
      data.forEach(({ appointmentDate, appointmentTime }) => {
        const dateStr = appointmentDate.substring(0, 10);
        const timeStr = appointmentTime.trim().padStart(8, '0');
    
        console.log(`Extracted date: ${dateStr}, time: ${timeStr}`);
    
        if (!map[dateStr]) map[dateStr] = new Set();
        map[dateStr].add(timeStr);
        console.log(`Mapped DB date → ${appointmentDate} → ${dateStr} with time ${timeStr}`);
      });
    
      console.log("Final Appointments Before Set:", map);
      setAppointments(map);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments({});
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchSchedules(selectedLocation);
      fetchAppointments();
    }
  }, [selectedLocation]);

  const handleSelect = (date, time, doctorId) => {
    setSelected({ date, time, doctorId});
  };

  const handleConfirm = async () => {
    const { date, time, doctorId} = selected;
    if (!date || !time || !doctorId || !selectedLocation) {
      console.log("Missing fields:", { ...selected, locationID: selectedLocation });
      return;
    }
  
    const time24 = convertTo24Hour(time);
    const parsedService1ID = parseInt(selectedServiceType);
    
    // Format date to YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    console.log("Submitting appointment:", { 
      date: formattedDate, 
      time: time24, 
      doctorId, 
      patientId, 
      service1ID: parsedService1ID, 
      locationID: selectedLocation 
    });
  
    try {
      const res = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formattedDate,
          time: time24,
          patientId,
          doctorId,
          service1ID: parsedService1ID,
          locationID: selectedLocation
        }),
      });
  
      const text = await res.text();
      console.log("Server response:", res.status, text);
  
      if (res.ok) {
        alert('Appointment scheduled!');
        navigate(`/userProfile/${patientId}`);
      } else {
        console.log(selectedServiceType);
        alert('That time is no longer available or server error.');
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Something went wrong");
    }
  };

  const scheduleMap = {};
  doctorSchedules.forEach((entry) => {
    if (!scheduleMap[entry.dayOfWeek]) scheduleMap[entry.dayOfWeek] = [];
    scheduleMap[entry.dayOfWeek].push(entry);
  });

  const getNextWeekday = (date, offset) => {
    const nextDate = new Date(date);
    let daysAdded = 0;
    let currentOffset = 0;
    
    while (daysAdded < offset) {
      currentOffset++;
      const tempDate = new Date(date);
      tempDate.setDate(date.getDate() + currentOffset);
      
      // Only count weekdays
      if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    nextDate.setDate(date.getDate() + currentOffset);
    return nextDate;
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h2>Schedule Appointment</h2>
      </div>

      <div className="appointment-grid">
        <div className="location-selector">
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setSelectedServiceType('');
            }}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.locationID} value={loc.locationID}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {(selectedLocation === '1' || selectedLocation === '2') && (
          <div className="service-selector">
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              required
            >
              <option value="">Select Service Type</option>
              <option value="4">Eye Exam</option>
              <option value="5">Disease and Eye Treatment</option>
            </select>
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="time-slot-grid">
          {[...Array(daysToShow)].map((_, idx) => {
            const dateObj = getNextWeekday(new Date(), idx);
            const dateStr = dateObj.toISOString().split('T')[0];
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const readableDate = dateObj.toDateString();

            const schedules = scheduleMap[dayName] || [];

            return (
              <div key={dateStr}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                  {dayName}<br />
                  {readableDate}
                </h3>

                {schedules.map((sched) => {
                  const slots = generateTimeSlots(sched.startTime, sched.endTime);

                  return (
                    <div key={`${sched.doctorID}-${sched.scheduleID}`} style={{ marginBottom: '1rem' }}>
                      <p className="doctor-info">
                        {sched.doctorName}
                      </p>

                      {slots.map((hour) => {
                        const hour24 = convertTo24Hour(hour);
                        const isBooked = appointments[dateStr]?.has(hour24);
                        const isSelected =
                          selected.date === dateStr &&
                          convertTo24Hour(selected.time) === hour24 &&
                          selected.doctorId === sched.doctorID;
                        const isDisabled = isBooked || 
                          ((selectedLocation === '1' || selectedLocation === '2') && !selectedServiceType);

                        return (
                          <button
                            key={hour}
                            onClick={() => handleSelect(dateStr, hour, sched.doctorID)}
                            disabled={isBooked}
                            className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'unavailable' : ''}`}
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
          })}
        </div>
      )}

      {selected.date && (
        <div className="confirmation-section">
          <h3>Appointment Details</h3>
          <div className="confirmation-details">
            <p><strong>Date:</strong> {new Date(selected.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selected.time}</p>
          </div>
          <div className="action-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={handleConfirm}>Confirm Appointment</button>
          </div>
        </div>
      )}
    </div>
  );
}
