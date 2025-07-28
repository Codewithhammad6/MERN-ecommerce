import { Navigate } from 'react-router-dom';
import { useStore } from '../store/store';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 