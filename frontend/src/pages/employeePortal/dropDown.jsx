import React, { useState, useRef, useEffect } from 'react';

export default function PatientDropdown(props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonStyle = {
    backgroundColor: "#c8ede0",
    color: "#003d33",
    padding: "10px 20px",
    border: "1px solid #00796B",
    borderRadius: "8px",
    fontFamily: "Bell MT",
    fontSize: "1rem",
    cursor: "pointer",
    position: "relative",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "110%",
    left: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #00796B",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 10,
    width: "100%",
  };

  const optionStyle = {
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    color: "#003d33",
    fontFamily: "Bell MT",
    fontSize: "1rem",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  };

  const handleClick = () =>
  {
    props.bool();
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button style={buttonStyle} onClick={() => setOpen(!open)}>
        Book Appointment ▼
      </button>

      {open && (
        <div style={dropdownStyle}>
          <div
            style={optionStyle} 
            onClick={() => window.location.href = "/book-Appointment"}
          >
            New Patient
          </div>
          <div
            style={{ ...optionStyle, borderBottom: "none" }}
            onClick={handleClick}
          >
            Existing Patient
          </div>
        </div>
      )}
    </div>
  );
}