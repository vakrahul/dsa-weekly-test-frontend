import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './TestPage.css';

const TestPage = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTest(response.data);
      } catch (error) {
        console.error('Failed to fetch test', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchTest();
  }, [testId, user]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));
    try {
      const response = await api.post('/tests/submit',
        { testId, answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setScore(response.data);
    } catch (error) {
      console.error('Failed to submit test', error);
    }
  };

  if (loading) return <div className="loading">Loading Test...</div>;
  if (!test) return <div className="error">Test not found.</div>;

  // ===== NEW FIX: ADD THIS CHECK =====
  if (!test.questions || test.questions.length === 0) {
    return (
      <div className="test-container">
        <h1>{test.title}</h1>
        <p className="error">This test has no questions yet.</p>
      </div>
    );
  }
  // ===================================

  if (score) {
    return (
      <div className="test-container">
        <div className="score-screen">
          <h2>Test Complete!</h2>
          <p className="final-score">Your Score: {score.score} / {score.totalQuestions}</p>
          <button onClick={() => navigate('/dashboard')} className="nav-button">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="test-container">
      <h1>{test.title}</h1>
      <div className="question-card">
        <h3>Question {currentQuestionIndex + 1} of {test.questions.length}</h3>
        <p className="question-text">{currentQuestion.questionText}</p>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion._id, option)}
              className={`option-button ${answers[currentQuestion._id] === option ? 'selected' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        {currentQuestionIndex < test.questions.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        )}
      </div>
    </div>
  );
};

export default TestPage;