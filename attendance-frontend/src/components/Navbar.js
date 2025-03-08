// attendance-frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Added CSS import

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate(); // Updated from useHistory

  const handleLogout = () => {
    logout();
    navigate('/login'); // Updated from history.push
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Attendance System</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user && user.role === 'admin' && (
              <Link to="/records">Records</Link>
            )}
            <span className="user-info">Welcome, {user.name} ({user.role})</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;