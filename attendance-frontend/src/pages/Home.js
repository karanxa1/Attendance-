// attendance-frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>School Attendance Management System</h1>
        <p>A simple and efficient way to track student attendance</p>
        
        {isAuthenticated ? (
          <Link to="/dashboard" className="cta-button">Go to Dashboard</Link>
        ) : (
          <Link to="/login" className="cta-button">Login</Link>
        )}
      </div>
      
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Mark Attendance</h3>
            <p>Teachers can quickly mark student attendance for their classes</p>
          </div>
          <div className="feature-card">
            <h3>View Records</h3>
            <p>Admins can view and export comprehensive attendance records</p>
          </div>
          <div className="feature-card">
            <h3>Google Sheets Integration</h3>
            <p>All data is securely stored in Google Sheets for easy access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;