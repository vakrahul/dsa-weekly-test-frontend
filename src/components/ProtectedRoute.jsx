import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  // If there's a user, show the page (the <Outlet /> component).
  // Otherwise, redirect them to the /login page.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;