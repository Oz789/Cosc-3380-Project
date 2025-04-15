import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./nurseExamPage.css";

const healthOptions = ['General Pain', 'Blurry Vision', 'Burning Sensation', 'Difficulty Reading', 'Dizziness', 'Double Vision', 'Eye Strain', 'Headaches', 'Itchy Eyes', 'Light Sensitivity', 'Lumps', 'Tunnel Vision', 'Watery Eyes'];
const conditionOptions = ['Cataracts', 'Corneal Abrasion', 'Crossed Eyes', 'Diabetic Retinopathy', 'Dry Eyes', 'Floaters', 'Glaucoma', 'Inflammation', 'Pink Eye', 'Retinal Detachment', 'Uveitis'];
const surgeryOptions = ['Cataract Surgery', 'Corneal Transplant', 'Eyelid Surgery', 'Eye Cancer Surgery', 'Glaucoma Surgery', 'Implants', 'LASIK', 'Orbital Surgery', 'Photorefractive Surgery', 'Retinal Repair', 'Vitrectomy'];

const NurseExamPage = () => {
  const { id: patientID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState("");
  const [editable, setEditable] = useState(false);

  const handleMultiSelect = (fieldName, event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      medicalForm: {
        ...prev.medicalForm,
        [fieldName]: selectedValues,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}`);
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchData();
  }, [patientID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      medicalForm: {
        ...prev.medicalForm,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/patients/update-form/${formData.medicalForm.medicalFormID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.medicalForm),
      });
      if (res.ok) {
        setStatus("Form updated successfully.");
        setEditable(false);
      } else {
        setStatus("Failed to update form.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setStatus("Server error.");
    }
  };

  if (!formData) return <p>Loading form...</p>;

  const { firstName, lastName, DOB, sex, email, phoneNumber, address, occupation, medicalForm } = formData;

  return (
    <div className="nurse-exam-container">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Profile
        </button>
        <button className="edit-toggle" onClick={() => setEditable(prev => !prev)}>
          {editable ? "Cancel" : "Edit"}
        </button>
      </div>

      <h2>Patient Prep Form</h2>

      <div className="patient-info">
        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>DOB:</strong> {DOB?.slice(0, 10)}</p>
        <p><strong>Sex:</strong> {sex}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phoneNumber}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Occupation:</strong> {occupation}</p>
      </div>

      <h3 className="section-header">Vision Details</h3>

      <div className="form-group checkbox-label">
        <input type="checkbox" name="usesCorrectiveLenses" checked={medicalForm?.usesCorrectiveLenses} onChange={handleChange} disabled={!editable} />
        <label>Uses Corrective Lenses</label>
      </div>

      <div className="form-group checkbox-label">
        <input type="checkbox" name="usesContacts" checked={medicalForm?.usesContacts} onChange={handleChange} disabled={!editable} />
        <label>Uses Contacts</label>
      </div>

      <div className="form-group">
        <label>Lenses Prescription:</label>
        <input type="text" name="LensesPrescription" value={medicalForm?.LensesPrescription || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group">
        <label>Contacts Prescription:</label>
        <input type="text" name="ContactsPrescription" value={medicalForm?.ContactsPrescription || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group">
        <label>Last Prescription Date:</label>
        <input type="date" name="lastPrescriptionDate" value={medicalForm?.lastPrescriptionDate?.slice(0, 10) || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <h3 className="section-header">Medical History</h3>

      <div className="form-group">
  <label>Health Concerns:</label>
  <select
    multiple
    value={medicalForm?.healthConcerns || []}
    onChange={(e) => handleMultiSelect("healthConcerns", e)}
    disabled={!editable}
    className={!editable ? "readonly" : ""}
  >
    {healthOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>


      <div className="form-group">
        <label>Other Concerns:</label>
        <textarea name="otherConcerns" value={medicalForm?.otherConcerns || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group">
  <label>Conditions:</label>
  <select
    multiple
    value={medicalForm?.conditions || []}
    onChange={(e) => handleMultiSelect("conditions", e)}
    disabled={!editable}
    className={!editable ? "readonly" : ""}
  >
    {conditionOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>


      <div className="form-group">
        <label>Other Conditions:</label>
        <textarea name="otherConditions" value={medicalForm?.otherConditions || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group checkbox-label">
        <input type="checkbox" name="hadSurgery" checked={medicalForm?.hadSurgery} onChange={handleChange} disabled={!editable} />
        <label>Had Surgery</label>
      </div>

      <div className="form-group">
  <label>Surgeries:</label>
  <select
    multiple
    value={medicalForm?.surgeries || []}
    onChange={(e) => handleMultiSelect("surgeries", e)}
    disabled={!editable}
    className={!editable ? "readonly" : ""}
  >
    {surgeryOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>


      <div className="form-group">
        <label>Other Surgeries:</label>
        <textarea name="otherSurgeries" value={medicalForm?.otherSurgeries || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group">
        <label>Allergies:</label>
        <textarea name="allergies" value={medicalForm?.allergies || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      <div className="form-group">
        <label>Additional Notes:</label>
        <textarea name="additionalDetails" value={medicalForm?.additionalDetails || ""} onChange={handleChange} readOnly={!editable} className={!editable ? "readonly" : ""} />
      </div>

      {editable && (
        <button onClick={handleSubmit} className="save-button">
          Save Changes
        </button>
      )}

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default NurseExamPage;


