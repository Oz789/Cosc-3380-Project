import React, { useState, useEffect } from "react";
import ProfileTemplate from "../../components/profileTemplate";
import { useParams } from "react-router-dom";

const PatientProfile = () => {
  const { patientID } = useParams();  // grabbing patient ID from URL param
  
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    dob: "",
    sex: "",
    address: "",
    phone: "",
    lastExamDate: "",
    usesCorrectiveLenses: "",
    usesContacts: "",
    lensesPrescription: "",
    contactsPrescription: "",
    lastPrescriptionDate: "",
    healthConcerns: "",
    otherConcerns: "",
    conditions: "",
    otherConditions: "",
    hadSurgery: "",
    surgeries: "",
    otherSurgeries: "",
    allergies: "",
    additionalDetails: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}`);
        console.log("Fetch response status:", res.status); // ← LOG STATUS
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        console.log("Fetched patient data:", data); // ← LOG RAW DATA
  
        setPatientData({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email || "",
          DOB: data.DOB ? data.DOB.slice(0, 10) : "",
          sex: data.sex || "",
          address: data.address || "",
          phone: data.phoneNumber || "",
          //lastExamDate: data.medicalForm.lastExamDate || "",
          lastExamDate: data.medicalForm.lastExamDate ? data.medicalForm.lastExamDate.slice(0, 10) : "",
          usesCorrectiveLenses: data.medicalForm.usesCorrectiveLenses ? "Yes" : "No",
          usesContacts: data.medicalForm.usesContacts ? "Yes" : "No",
          lensesPrescription: data.medicalForm.LensesPrescription || "",
          contactsPrescription: data.medicalForm.ContactsPrescription || "",
          //lastPrescriptionDate: data.medicalForm.lastPrescriptionDate || "",
          lastPrescriptionDate: data.medicalForm.lastPrescriptionDate ? data.medicalForm.lastPrescriptionDate.slice(0, 10) : "",
          healthConcerns: (data.medicalForm.healthConcerns || "").split(',').join(', '),
          otherConcerns: data.medicalForm.otherConcerns || "",
          conditions: (data.medicalForm.conditions || "").split(',').join(', '),
          otherConditions: data.medicalForm.otherConditions || "",
          hadSurgery: data.medicalForm.hadSurgery ? "Yes" : "No",
          surgeries: (data.medicalForm.surgeries || "").split(',').join(', '),
          otherSurgeries: data.medicalForm.otherSurgeries || "",
          allergies: data.medicalForm.allergies || "",
          additionalDetails: data.medicalForm.additionalDetails || "",
        });
        if (data.appointments) {
          //const now = new Date();
        
          // Filter for upcoming only (today or future)
          console.log("Raw appointments:", data.appointments);
          const upcoming = data.appointments.filter(appt => {
            const [hour, minute] = appt.appointmentTime.split(":");
            const [year, month, day] = appt.appointmentDate.slice(0, 10).split("-");
            const apptDateTime = new Date(year, month - 1, day, Number(hour), Number(minute));
          
            console.log("→ Checking:", {
              apptDateTime,
              now: new Date(),
              isUpcoming: apptDateTime >= new Date()
            });
          
            return apptDateTime >= new Date();
          });

          console.log("Filtered upcoming appointments:", upcoming);
          
        
          // Sort ascending by date and time
          upcoming.sort((a, b) => {
            const aDateTime = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
            const bDateTime = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
            return aDateTime - bDateTime;
          });
        
          setAppointments(upcoming);
        }            
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }      
    };
  
    fetchPatientData();
  }, [patientID]);
  

  //const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  return (
    <ProfileTemplate
      
      sidebarContent={
        <div>
          <h2 className="section-title">Patient Information</h2>
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Email:</label>
          <input type="email" name="email" value={patientData.email || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>DOB:</label>
          <input type="date" name="dob" value={patientData.DOB || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Sex:</label>
          <select name="sex" value={patientData.sex || ""} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Address:</label>
          <input type="text" name="address" value={patientData.address || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Phone:</label>
          <input type="tel" name="phone" value={patientData.phone || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />
        </div>
      }

      
      mainContent={
        <div>
          <h2 className="section-title">Medical Form Data</h2>

          <label>Last Exam Date:</label>
          <input type="date" name="lastExamDate" value={patientData.lastExamDate || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Uses Corrective Lenses:</label>
          <select name="usesCorrectiveLenses" value={patientData.usesCorrectiveLenses || ""} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Uses Contacts:</label>
          <select name="usesContacts" value={patientData.usesContacts || ""} onChange={handleChange} className="input-field" disabled={!isEditing}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Lenses Prescription:</label>
          <input type="text" name="lensesPrescription" value={patientData.lensesPrescription || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Contacts Prescription:</label>
          <input type="text" name="contactsPrescription" value={patientData.contactsPrescription || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <label>Last Prescription Date:</label>
          <input type="date" name="lastPrescriptionDate" value={patientData.lastPrescriptionDate || ""} onChange={handleChange} className="input-field" readOnly={!isEditing} />

          <h3 className="subsection-title">Health Concerns</h3>
          <textarea name="healthConcerns" value={patientData.healthConcerns || ""} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Other Concerns</h3>
          <textarea name="otherConcerns" value={patientData.otherConcerns || ""} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Conditions</h3>
          <textarea name="conditions" value={patientData.conditions || ""} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          <h3 className="subsection-title">Additional Details</h3>
          <textarea name="additionalDetails" value={patientData.additionalDetails || ""} onChange={handleChange} className="textarea-field" readOnly={!isEditing}></textarea>

          
          <div className="button-group">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            )}
          </div>
        </div>
      }

      extraContent={
        <>
          <div>
            <p style={{ color: "#aaa", fontStyle: "italic" }}></p>
            <h3 className="section-title">Upcoming Appointments</h3>
          </div>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appt, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <strong>{new Date(appt.appointmentDate).toDateString()}</strong> at{" "}
                  {(() => {
                    const date = new Date(appt.appointmentDate);
                    const [hour, minute] = appt.appointmentTime.split(':');
                    date.setHours(Number(hour));
                    date.setMinutes(Number(minute));
                    return date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  })()}
                  <br />
                  Doctor: Dr. {appt.doctorFirstName} {appt.doctorLastName}<br />
                  Service: {appt.serviceName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </>
      }
    />
  );
};

export default PatientProfile;
