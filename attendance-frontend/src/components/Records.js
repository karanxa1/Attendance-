// attendance-frontend/src/pages/Records.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    class: '',
    date: '',
    status: ''
  });
  const [classes, setClasses] = useState([]);
  
  // Fetch classes for filter dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/attendance/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };
    
    fetchClasses();
  }, []);
  
  // Fetch attendance records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.class) queryParams.append('class', filters.class);
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.status) queryParams.append('status', filters.status);
        
        const url = `/api/attendance/records?${queryParams.toString()}`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRecords(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.class) queryParams.append('class', filters.class);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.status) queryParams.append('status', filters.status);
      
      const url = `/api/attendance/export?${queryParams.toString()}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'attendance_records.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export records');
      console.error(err);
    }
  };

  if (loading && records.length === 0) {
    return <div className="loading">Loading records...</div>;
  }

  return (
    <div className="records-page">
      <h1>Attendance Records</h1>
      
      <div className="filters-section">
        <h3>Filter Records</h3>
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="class">Class:</label>
            <select
              id="class"
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>
        
        <button onClick={exportToCSV} className="export-btn">
          Export to CSV
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="records-container">
        {records.length === 0 ? (
          <p>No records found matching the current filters.</p>
        ) : (
          <table className="records-table">
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
                  <td className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                  <td>{record.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Records;