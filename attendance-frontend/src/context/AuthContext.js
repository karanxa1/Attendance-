// attendance-frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (formData) => {
    const res = await axios.post('/api/auth/login', formData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };