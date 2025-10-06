import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './DashboardPage.css'; // For styling

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        setLoading(false);
        setError('You are not logged in.');
        return;
      }

      try {
        // Fetch both profile and leaderboard data
        const profileRes = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const leaderboardRes = await api.get('/tests/leaderboard', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        setProfile(profileRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    if (profile) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">Could not load profile.</div>;

  // Full Screen Splash Screen
  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-icon">⚡</div>
          <h1 className="splash-title">Welcome back, {profile.name}!</h1>
          <p className="splash-subtitle">Get ready to conquer DSA challenges</p>
          <div className="splash-loader">
            <div className="loader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Main Content */}
      <div className="main-content">
        <h1 className="welcome-header">Welcome back, {profile.name}!</h1>
        
        <div className="stats-container">
          <div className="stat-card">
            <h4>Total Problems</h4>
            <p>345</p>
          </div>
          <div className="stat-card">
            <h4>Current Streak</h4>
            <p>14 days</p>
          </div>
          <div className="stat-card">
            <h4>Next Weekly Test</h4>
            <p>Dynamic Programming</p>
          </div>
        </div>

        <div className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="action-buttons">
            <Link to="/tests" className="action-btn primary">Take a Weekly Test</Link>
            <button className="action-btn secondary">Practice Questions</button>
          </div>
        </div>
        
        <div className="activity-chart">
          <h3>Last 30 Days Activity</h3>
          {/* In a real app, a chart library like Chart.js or Recharts would render here */}
          <p style={{textAlign: "center", padding: "2rem", color: "#888"}}>[Line chart placeholder]</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-widget calendar">
          <h3>November 2024</h3>
          <p style={{textAlign: "center", padding: "2rem", color: "#888"}}>[Calendar placeholder]</p>
        </div>

        <div className="sidebar-widget topic">
          <h4>This Week's Topic</h4>
          <p>Graphs & Trees</p>
        </div>

        <div className="sidebar-widget rankers">
          <h3>Top Rankers</h3>
          <ol className="rankers-list">
            {leaderboard.slice(0, 3).map((ranker, index) => (
              <li key={index}>
                <span>{ranker.name} - {ranker.totalScore} points</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;