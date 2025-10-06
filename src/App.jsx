import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TestsListPage from './pages/TestsListPage';
import TestPage from './pages/TestPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      {/* Navbar is outside the Routes so it's visible on every page */}
      <Navbar />

      {/* Use a <main> tag for semantic HTML and potential global styling */}
      <main>
        <Routes>
          {/* == Public Routes == */}
          {/* These routes are accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* == User Protected Routes == */}
          {/* These routes are for any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tests" element={<TestsListPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/test/:id" element={<TestPage />} />
          </Route>

          {/* == Admin Protected Route == */}
          {/* This route is ONLY for users with the 'admin' role */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* You can add a 404 Not Found page here later if you wish */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;