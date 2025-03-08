// attendance-frontend/src/components/Navbar.js
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
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