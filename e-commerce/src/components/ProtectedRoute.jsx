import { Navigate } from 'react-router-dom';
import { useStore } from '../store/store';

const ProtectedRoute = ({ children }) => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 