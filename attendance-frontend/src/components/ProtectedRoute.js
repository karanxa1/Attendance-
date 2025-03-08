import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component is now integrated directly into App.js, but we'll keep it for reference
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;