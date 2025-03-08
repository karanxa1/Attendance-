import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <h1>School Attendance Management System</h1>
        <p>A simple and efficient way to track student attendance</p>
        {isAuthenticated ? (
          <Link to="/dashboard" className={styles.ctaButton}>
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className={styles.ctaButton}>
            Login
          </Link>
        )}
      </div>

      <div className={styles.featuresSection}>
        <h2>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Mark Attendance</h3>
            <p>Teachers can quickly mark student attendance for their classes</p>
          </div>
          <div className={styles.featureCard}>
            <h3>View Records</h3>
            <p>Admins can view and export comprehensive attendance records</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Google Sheets Integration</h3>
            <p>All data is securely stored in Google Sheets for easy access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;