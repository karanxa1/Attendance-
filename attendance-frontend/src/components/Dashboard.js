// attendance-frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AttendanceForm from '../components/AttendanceForm';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    attendanceToday: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch recent activity
        const activityRes = await axios.get('/api/attendance/recent', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch stats
        const statsRes = await axios.get('/api/attendance/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRecentActivity(activityRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="welcome-message">
        <h2>Welcome, {user.name}!</h2>
        <p>Role: {user.role}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Classes</h3>
          <p className="stat-number">{stats.totalClasses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Attendance</h3>
          <p className="stat-number">{stats.attendanceToday}%</p>
        </div>
      </div>
      
      {user.role === 'teacher' && <AttendanceForm />}
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className="activity-list">
            {recentActivity.map((activity, index) => (
              <li key={index} className="activity-item">
                <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                <span className="activity-description">{activity.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;