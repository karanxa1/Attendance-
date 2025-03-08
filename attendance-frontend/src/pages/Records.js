import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Records.module.css';

const fetchRecords = async filters => {
  const queryParams = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/api/attendance/records?${queryParams}`);
  return data;
};

const Records = () => {
  const [filters, setFilters] = useState({ class: '', date: '', status: '' });
  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['records', filters],
    queryFn: () => fetchRecords(filters),
    keepPreviousData: true,
  });

  const handleFilterChange = e => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const exportToCSV = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/attendance/export?${queryParams}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance_records.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Records exported successfully!');
    } catch {
      toast.error('Failed to export records');
    }
  };

  if (isLoading) return <div>Loading records...</div>;
  if (error) return <div>Error fetching records: {error.message}</div>;

  return (
    <div className={styles.recordsPage}>
      <h1>Attendance Records</h1>
      <div className={styles.filtersSection}>
        <h3>Filter Records</h3>
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="class">Class:</label>
            <select id="class" name="class" value={filters.class} onChange={handleFilterChange}>
              <option value="">All Classes</option>
              {/* Populate dynamically if classes are fetched */}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>
        <button onClick={exportToCSV} className={styles.exportBtn}>
          Export to CSV
        </button>
      </div>
      <div className={styles.recordsContainer}>
        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table className={styles.recordsTable} role="grid">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Student</th>
                <th>Status</th>
                <th>Marked By</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.className}</td>
                  <td>{record.studentName}</td>
                  <td className={`${styles.status} ${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                  <td>{record.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Records;