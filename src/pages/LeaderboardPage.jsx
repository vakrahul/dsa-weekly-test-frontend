import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './LeaderboardPage.css'; // For styling

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/tests/leaderboard', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setLeaderboard(response.data);
      } catch (err) {
        setError('Failed to fetch leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchLeaderboard();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading Leaderboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const getMedal = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return rank + 1; // Return the rank number for others
  };

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <ol className="leaderboard-list">
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => (
            <li key={index} className="leaderboard-item">
              <span className="rank">{getMedal(index)}</span>
              <span className="name">{player.name}</span>
              <span className="score">{player.totalScore} points</span>
            </li>
          ))
        ) : (
          <p>No scores recorded yet. Be the first to complete a test!</p>
        )}
      </ol>
    </div>
  );
};

export default LeaderboardPage;