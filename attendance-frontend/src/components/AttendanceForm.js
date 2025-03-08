// attendance-frontend/src/components/AttendanceForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AttendanceForm = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/attendance/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(res.data);
      } catch (err) {
        setError('Failed to load classes');
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    if (!selectedClass) return;
    
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/attendance/students/${selectedClass}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Initialize attendance array with students
        const initialAttendance = res.data.map(student => ({
          studentId: student.id,
          studentName: student.name,
          status: 'Present' // Default status
        }));
        
        setStudents(res.data);
        setAttendance(initialAttendance);
      } catch (err) {
        setError('Failed to load students');
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => prev.map(item => 
      item.studentId === studentId ? { ...item, status } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/attendance/mark', {
        classId: selectedClass,
        date: new Date().toISOString().split('T')[0],
        teacher: user.name,
        attendance
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(true);
      // Reset form
      setSelectedClass('');
      setStudents([]);
      setAttendance([]);
    } catch (err) {
      setError('Failed to submit attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2>Mark Attendance</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Attendance marked successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="class">Select Class:</label>
          <select 
            id="class" 
            value={selectedClass} 
            onChange={handleClassChange}
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        
        {students.length > 0 && (
          <>
            <div className="students-list">
              <h3>Students</h3>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>
                        <select 
                          value={attendance.find(a => a.studentId === student.id)?.status || 'Present'}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AttendanceForm;