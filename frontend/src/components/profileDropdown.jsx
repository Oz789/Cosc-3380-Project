import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './dropdown.css';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="profile-dropdown-wrapper">
      <button className="profile-icon-button" onClick={() => setOpen(!open)}>
        <FaUserCircle />
      </button>
      {open && (
        <div className="profile-menu">
          <Link to="/profile">Profile</Link>
          <Link to="/notifications">Notifications</Link>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

