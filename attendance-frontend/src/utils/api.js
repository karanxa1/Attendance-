import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mock API responses for development
const mockResponses = {
  '/api/attendance/classes': [
    { id: 1, name: 'Class 6A' },
    { id: 2, name: 'Class 7B' },
    { id: 3, name: 'Class 8C' }
  ],
  '/api/attendance/students/1': [
    { id: 101, name: 'John Doe' },
    { id: 102, name: 'Jane Smith' },
    { id: 103, name: 'Alex Johnson' }
  ],
  '/api/attendance/students/2': [
    { id: 201, name: 'Sarah Williams' },
    { id: 202, name: 'Mike Brown' },
    { id: 203, name: 'Emily Davis' }
  ],
  '/api/attendance/students/3': [
    { id: 301, name: 'David Wilson' },
    { id: 302, name: 'Lisa Moore' },
    { id: 303, name: 'Ryan Taylor' }
  ],
  '/api/attendance/recent': [
    { date: '2025-03-08', description: 'Attendance marked for Class 7B' },
    { date: '2025-03-07', description: 'Attendance marked for Class 6A' },
    { date: '2025-03-06', description: 'Attendance marked for Class 8C' }
  ],
  '/api/attendance/stats': {
    totalClasses: 3,
    totalStudents: 45,
    attendanceToday: 92
  },
  '/api/attendance/records': [
    { date: '2025-03-08', className: 'Class 7B', studentName: 'Sarah Williams', status: 'Present', teacher: 'John Teacher' },
    { date: '2025-03-08', className: 'Class 7B', studentName: 'Mike Brown', status: 'Absent', teacher: 'John Teacher' },
    { date: '2025-03-08', className: 'Class 7B', studentName: 'Emily Davis', status: 'Present', teacher: 'John Teacher' },
    { date: '2025-03-07', className: 'Class 6A', studentName: 'John Doe', status: 'Present', teacher: 'John Teacher' },
    { date: '2025-03-07', className: 'Class 6A', studentName: 'Jane Smith', status: 'Late', teacher: 'John Teacher' }
  ]
};

// Add mock interceptor for development
api.interceptors.request.use(
  async config => {
    const mockPath = Object.keys(mockResponses).find(path => {
      // Handle paths with parameters
      if (config.url.includes('/api/attendance/students/')) {
        return config.url.match(/\/api\/attendance\/students\/\d+/);
      }
      return config.url.includes(path);
    });

    if (mockPath) {
      // Create a delayed mock response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return Promise.reject({
        response: {
          status: 200,
          data: mockPath === '/api/attendance/students/' 
            ? mockResponses['/api/attendance/students/1'] 
            : mockResponses[mockPath]
        }
      });
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Override axios adapter to intercept requests and return mock data
const originalAdapter = api.defaults.adapter;
api.defaults.adapter = async config => {
  try {
    // Try to make the actual API call
    return await originalAdapter(config);
  } catch (error) {
    // If the error contains our mock response, return it
    if (error.response && error.response.status === 200) {
      return {
        data: error.response.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    throw error;
  }
};

export { api };