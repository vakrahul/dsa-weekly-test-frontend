import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">DSA PRO</Link>
      <div className="nav-links">
        {user ? (
          // Links to show if the user IS logged in
          <>
            {/* This link only appears if the logged-in user is an admin */}
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tests">Take a Test</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </>
        ) : (
          // Links to show if the user IS NOT logged in
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;