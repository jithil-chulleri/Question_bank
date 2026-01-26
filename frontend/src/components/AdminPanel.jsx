import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminPanel() {
    const [formData, setFormData] = useState({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/admin/questions');
            setQuestions(response.data);
        } catch (err) {
            console.error('Failed to fetch questions:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/admin/questions', formData);
            setSuccess('Question added successfully!');
            setFormData({
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: 'A',
            });
            fetchQuestions(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add question');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question? This will also delete all user answers related to it.')) {
            return;
        }

        try {
            await api.delete(`/admin/questions/${id}`);
            setSuccess('Question deleted successfully!');
            fetchQuestions(); // Refresh the list
        } catch (err) {
            setError('Failed to delete question');
            console.error(err);
        }
    };

    return (
        <div className="admin-panel">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Admin Panel</h1>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="admin-form">
                    <h2>Add New Question</h2>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="question_text">Question</label>
                            <input
                                id="question_text"
                                name="question_text"
                                type="text"
                                placeholder="Enter the question"
                                value={formData.question_text}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="option_a">Option A</label>
                                <input
                                    id="option_a"
                                    name="option_a"
                                    type="text"
                                    placeholder="Option A"
                                    value={formData.option_a}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="option_b">Option B</label>
                                <input
                                    id="option_b"
                                    name="option_b"
                                    type="text"
                                    placeholder="Option B"
                                    value={formData.option_b}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="option_c">Option C</label>
                                <input
                                    id="option_c"
                                    name="option_c"
                                    type="text"
                                    placeholder="Option C"
                                    value={formData.option_c}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="option_d">Option D</label>
                                <input
                                    id="option_d"
                                    name="option_d"
                                    type="text"
                                    placeholder="Option D"
                                    value={formData.option_d}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="correct_answer">Correct Answer</label>
                            <select
                                id="correct_answer"
                                name="correct_answer"
                                value={formData.correct_answer}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-md) var(--spacing-lg)',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    fontFamily: 'var(--font-family)',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Adding Question...' : 'Add Question'}
                        </button>
                    </form>
                    <div className="admin-questions-list">
                        <h2>Manage Questions ({questions.length})</h2>
                        {fetching ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Loading questions...</p>
                            </div>
                        ) : (
                            <div className="admin-questions-grid">
                                {questions.map((q) => (
                                    <div key={q.id} className="admin-question-item">
                                        <div className="q-info">
                                            <div className="q-text">{q.question_text}</div>
                                            <div className="q-meta">Correct Answer: {q.correct_answer}</div>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(q.id)}
                                            title="Delete Question"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
