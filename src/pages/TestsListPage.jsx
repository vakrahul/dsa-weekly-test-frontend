import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './TestsListPage.css'; // For styling

const TestsListPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTests(response.data);
      } catch (err) {
        setError('Failed to fetch tests.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchTests();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading tests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tests-list-container">
      <h1>Available Tests</h1>
      <div className="tests-grid">
        {tests.length > 0 ? (
          tests.map((test) => (
            <Link to={`/test/${test._id}`} key={test._id} className="test-card">
              <h2>{test.title}</h2>
              <p>Click to start the test</p>
            </Link>
          ))
        ) : (
          <p>No tests are available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TestsListPage;