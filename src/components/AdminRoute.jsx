import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  // Redirect to dashboard if not logged in or if the user is not an admin
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;