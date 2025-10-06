import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);

  // State for the "Add Question" form
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

  // State for the "Create Test" form
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [testTitle, setTestTitle] = useState('');

  // State for showing success or error messages
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

  // Handler for test case input changes
  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  // Adds a new blank test case to the form
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  // Removes a test case from the form by its index
  const removeTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  // Handles the submission of the "Add Question" form
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/admin/questions',
        { title, problemStatement, starterCode, testCases },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Question added successfully!');
      // Reset form fields
      setTitle('');
      setProblemStatement('');
      setStarterCode('');
      setTestCases([{ input: '', expectedOutput: '' }]);
      // Refresh the list of all questions
      const res = await api.get('/admin/questions', { headers: { Authorization: `Bearer ${user.token}` }});
      setAllQuestions(res.data);
    } catch (error) {
      setMessage('Failed to add question.');
      console.error(error);
    }
  };

  // Toggles the selection of a question for a new test
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };
  
  // Handles the submission of the "Create Test" form
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
      // Reset form fields
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
        {/* Form for Adding a New Question */}
        <form onSubmit={handleAddQuestion} className="admin-form">
          <h2>Add New Coding Question</h2>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Question Title (e.g., Two Sum)" required />
          <textarea value={problemStatement} onChange={e => setProblemStatement(e.target.value)} placeholder="Problem Statement (Description)" required />
          <textarea value={starterCode} onChange={e => setStarterCode(e.target.value)} placeholder="Starter Code (e.g., function twoSum(nums, target) { ... })" required />
          
          <h3>Test Cases</h3>
          {testCases.map((tc, index) => (
            <div key={index} className="test-case-inputs">
              <input type="text" value={tc.input} onChange={e => handleTestCaseChange(index, 'input', e.target.value)} placeholder={`Input ${index + 1}`} required />
              <input type="text" value={tc.expectedOutput} onChange={e => handleTestCaseChange(index, 'expectedOutput', e.target.value)} placeholder={`Expected Output ${index + 1}`} required />
              {testCases.length > 1 && <button type="button" onClick={() => removeTestCase(index)}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addTestCase}>Add Test Case</button>
          <button type="submit">Add Question</button>
        </form>

        {/* Form for Creating a New Test */}
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
                  <label htmlFor={q._id}>{q.title}</label>
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