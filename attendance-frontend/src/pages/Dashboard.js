import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AttendanceForm from '../components/AttendanceForm';
import { api } from '../utils/api';
import styles from './Dashboard.module.css';

const fetchDashboardData = async () => {
  const [activityRes, statsRes] = await Promise.all([
    api.get('/api/attendance/recent'),
    api.get('/api/attendance/stats'),
  ]);
  return { recentActivity: activityRes.data, stats: statsRes.data };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) return <div>Loading dashboard...</div>;

  const { recentActivity, stats } = data || { recentActivity: [], stats: {} };

  return (
    <div className={styles.dashboardPage}>
      <h1>Dashboard</h1>
      <div className={styles.welcomeMessage}>
        <h2>Welcome, {user.name}!</h2>
        <p>Role: {user.role}</p>
      </div>

      <div className={styles.dashboardStats}>
        <div className={styles.statCard}>
          <h3>Total Classes</h3>
          <p className={styles.statNumber}>{stats.totalClasses || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Students</h3>
          <p className={styles.statNumber}>{stats.totalStudents || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Today's Attendance</h3>
          <p className={styles.statNumber}>{stats.attendanceToday || 0}%</p>
        </div>
      </div>

      {user.role === 'teacher' && <AttendanceForm />}

      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <li key={index} className={styles.activityItem}>
                <span className={styles.activityDate}>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                <span className={styles.activityDescription}>{activity.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;