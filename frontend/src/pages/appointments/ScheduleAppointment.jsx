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
    
    while (sh < eh || (sh === eh && sm < em)) {
      const time = new Date(0, 0, 0, sh, sm).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      slots.push(time);
      sm += 30; // Changed from 60 to 30 for 30-minute intervals
      if (sm >= 60) {
        sh++;
        sm = 0;
      }
    }
    
    return slots;
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/locations');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Locations data:", data);
      // Ensure data is an array before setting it
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching locations:", err);
      // Set locations to empty array on error
      setLocations([]);
    }
  };

  const fetchSchedules = async (locationID) => {
    console.log(`Fetching schedules for location ${locationID}`);
    try {
      const res = await fetch(`http://localhost:5001/api/schedule/location/${locationID}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched doctor schedules:", data);
      setDoctorSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  useEffect(() => {
    console.log("Doctor schedules state changed:", doctorSchedules);
  }, [doctorSchedules]);

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
    console.log("Selected appointment:", { date, time, doctorId });
    setSelected({ date, time, doctorId });
  };

  const handleConfirm = async () => {
    const { date, time, doctorId } = selected;
    console.log("Confirming appointment with:", { date, time, doctorId, patientId, selectedServiceType, selectedLocation });

    if (!date || !time || !doctorId || !patientId || !selectedServiceType || !selectedLocation) {
      console.warn("Missing required fields:", {
        date: !date,
        time: !time,
        doctorId: !doctorId,
        patientId: !patientId,
        serviceType: !selectedServiceType,
        location: !selectedLocation
      });
      alert('Please fill in all required fields');
      return;
    }

    const time24 = convertTo24Hour(time);
    
    // Format date to YYYY-MM-DD
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Get day of week
    const selectedDayOfWeek = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long'
    });

    // Find the doctor's schedule for this day
    const doctorSchedule = doctorSchedules.find(schedule => 
      schedule.doctorID === doctorId && 
      schedule.dayOfWeek.toLowerCase() === selectedDayOfWeek.toLowerCase()
    );

    if (!doctorSchedule) {
      const doctorSchedulesForDoctor = doctorSchedules.filter(s => s.doctorID === doctorId);
      const availableDays = [...new Set(doctorSchedulesForDoctor.map(s => s.dayOfWeek))];
      alert(`Doctor is not available on ${selectedDayOfWeek}. Available days: ${availableDays.join(', ')}`);
      return;
    }

    // Validate time is within schedule
    const [selectedHour, selectedMinute] = time24.split(':').map(Number);
    const [startHour, startMinute] = doctorSchedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = doctorSchedule.endTime.split(':').map(Number);

    const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (selectedTimeInMinutes < startTimeInMinutes || selectedTimeInMinutes >= endTimeInMinutes) {
      alert(`Selected time ${time} is outside of doctor's working hours (${doctorSchedule.startTime} - ${doctorSchedule.endTime})`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          time: time24,
          patientId,
          doctorId,
          service1ID: selectedServiceType,
          locationID: selectedLocation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule appointment');
      }

      const data = await response.json();
      console.log('Appointment scheduled successfully:', data);
      alert('Appointment scheduled successfully!');
      navigate('/appointments');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert(error.message || 'Failed to schedule appointment. Please try again.');
    }
  };

  const scheduleMap = {};
  doctorSchedules.forEach((entry) => {
    console.log("Processing schedule entry:", entry);
    if (!scheduleMap[entry.dayOfWeek]) scheduleMap[entry.dayOfWeek] = [];
    scheduleMap[entry.dayOfWeek].push(entry);
  });
  console.log("Schedule map:", scheduleMap);

  const getNextWeekday = (date, offset) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + offset);
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
            const dateObj = getNextWeekday(baseDate, idx);
            const dateStr = dateObj.toISOString().split('T')[0];
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const readableDate = dateObj.toDateString();

            const schedules = scheduleMap[dayName] || [];
            console.log(`Checking schedules for ${dayName} (${dateStr}):`, schedules);

            return (
              <div key={dateStr}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                  {dayName}<br />
                  {readableDate}
                </h3>

                {schedules.map((sched) => {
                  console.log(`Generating slots for doctor ${sched.doctorID} on ${dayName}`);
                  const slots = generateTimeSlots(sched.startTime, sched.endTime);

                  return (
                    <div key={`${sched.doctorID}-${sched.scheduleID}`} style={{ marginBottom: '1rem' }}>
                      <p className="doctor-info">
                        Dr. {sched.firstName} {sched.lastName}
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
                            disabled={isDisabled}
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
