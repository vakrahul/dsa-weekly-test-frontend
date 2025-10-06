import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);

  // State for the "Add Question" form
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // State for the "Create Test" form
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [testTitle, setTestTitle] = useState('');

  const [message, setMessage] = useState('');

  // Fetch all questions when the component loads
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.token) return;
      try {
        const res = await api.get('/admin/questions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAllQuestions(res.data);
      } catch (error) {
        setMessage('Failed to load questions.');
        console.error(error);
      }
    };
    fetchQuestions();
  }, [user]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/admin/questions',
        { questionText, options, correctAnswer },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Question added successfully!');
      // Reset form
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      // Refresh question list
      const res = await api.get('/admin/questions', { headers: { Authorization: `Bearer ${user.token}` }});
      setAllQuestions(res.data);
    } catch (error) {
      setMessage('Failed to add question.');
      console.error(error);
    }
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };
  
  const handleCreateTest = async (e) => {
    e.preventDefault();
    setMessage('');
    if (selectedQuestions.length === 0) {
      setMessage('Please select at least one question for the test.');
      return;
    }
    try {
      await api.post('/admin/tests',
        { title: testTitle, questions: selectedQuestions },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Test created successfully!');
      // Reset form
      setTestTitle('');
      setSelectedQuestions([]);
    } catch (error) {
      setMessage('Failed to create test.');
      console.error(error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {message && <p className="message">{message}</p>}
      <div className="admin-forms-container">
        {/* Add Question Form */}
        <form onSubmit={handleAddQuestion} className="admin-form">
          <h2>Add New Question</h2>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Question Text"
            required
          />
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
          ))}
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Correct Answer (must match one option exactly)"
            required
          />
          <button type="submit">Add Question</button>
        </form>

        {/* Create Test Form */}
        <form onSubmit={handleCreateTest} className="admin-form">
          <h2>Create New Test</h2>
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Test Title (e.g., Week 1 - Arrays)"
            required
          />
          <div className="question-list">
            <h3>Select Questions for this Test:</h3>
            {allQuestions.length > 0 ? (
              allQuestions.map(q => (
                <div key={q._id} className="question-checkbox">
                  <input
                    type="checkbox"
                    id={q._id}
                    checked={selectedQuestions.includes(q._id)}
                    onChange={() => handleQuestionSelect(q._id)}
                  />
                  <label htmlFor={q._id}>{q.questionText}</label>
                </div>
              ))
            ) : (
              <p>No questions found. Please add a question first.</p>
            )}
          </div>
          <button type="submit">Create Test</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;