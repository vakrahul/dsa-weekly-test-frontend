import { Link } from 'react-router-dom';
import './HomePage.css'; // For styling

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Data Structures & Algorithms
          </h1>
          <p className="hero-subtitle">
            Join weekly tests, track your progress, and climb the leaderboard. Your journey to becoming a DSA pro starts here.
          </p>
          <Link to="/register" className="hero-cta-button">
            Get Started for Free
          </Link>
        </div>
        <div className="hero-image">
          {/* In a real app, you could place a relevant image or illustration here */}
          [Image of abstract data structure nodes and connections]
        </div>
      </section>
    </div>
  );
};

export default HomePage;