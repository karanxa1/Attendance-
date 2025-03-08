import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AttendanceForm.module.css';

const AttendanceForm = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const { register, handleSubmit, watch, setValue } = useForm();
  const selectedClass = watch('classId');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/api/attendance/classes');
        setClasses(res.data);
      } catch {
        toast.error('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudents = async () => {
      try {
        const res = await api.get(`/api/attendance/students/${selectedClass}`);
        const initialAttendance = res.data.map(student => ({
          studentId: student.id,
          studentName: student.name,
          status: 'Present',
        }));
        setStudents(res.data);
        setAttendance(initialAttendance);
      } catch {
        toast.error('Failed to load students');
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev =>
      prev.map(item => (item.studentId === studentId ? { ...item, status } : item))
    );
  };

  const onSubmit = async data => {
    try {
      await api.post('/api/attendance/mark', {
        classId: data.classId,
        date: new Date().toISOString().split('T')[0],
        teacher: user.name,
        attendance,
      });
      toast.success('Attendance marked successfully!');
      setValue('classId', '');
      setStudents([]);
      setAttendance([]);
    } catch {
      toast.error('Failed to submit attendance');
    }
  };

  return (
    <div className={styles.attendanceForm}>
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="classId">Select Class:</label>
          <select
            id="classId"
            {...register('classId', { required: true })}
            aria-required="true"
          >
            <option value="">-- Select Class --</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {students.length > 0 && (
          <>
            <div className={styles.studentsList}>
              <h3>Students</h3>
              <table className={styles.attendanceTable} role="grid">
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
                          value={
                            attendance.find(a => a.studentId === student.id)?.status || 'Present'
                          }
                          onChange={e => handleStatusChange(student.id, e.target.value)}
                          aria-label={`Attendance status for ${student.name}`}
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
            <button type="submit" className={styles.submitBtn}>
              Submit Attendance
            </button>
          </>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default AttendanceForm;