// src/pages/Dashboard.js
import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import AttendanceForm from '../components/AttendanceForm';
import { api } from '../utils/api';

const fetchDashboardData = async () => {
  const [activityRes, statsRes] = await Promise.all([
    api.get('/api/attendance/recent'),
    api.get('/api/attendance/stats'),
  ]);
  return { recentActivity: activityRes.data, stats: statsRes.data };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery('dashboardData', fetchDashboardData);

  if (isLoading) return <div>Loading dashboard...</div>;

  const { recentActivity, stats } = data;

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
                <span className="activity-date">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
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