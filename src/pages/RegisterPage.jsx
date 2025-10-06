import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './LoginPage.css'; // We can reuse the same styles from the login page!

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Make the API call to the backend's register endpoint
      const response = await api.post('/auth/register', { name, email, password });

      // 2. If registration is successful, automatically log the user in
      login(response.data);

      // 3. Navigate the user to their dashboard
      navigate('/dashboard');
    } catch (err) {
      // 4. If there's an error (e.g., user already exists), display it
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;