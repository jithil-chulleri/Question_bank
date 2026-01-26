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
        hardness: 'easy',
        category_id: '',
    });
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setFetching(true);
        try {
            const [qRes, cRes] = await Promise.all([
                api.get('/admin/questions'),
                api.get('/questions/categories')
            ]);
            setQuestions(qRes.data);
            setCategories(cRes.data);
            if (cRes.data.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: cRes.data[0].id }));
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to fetch data');
        } finally {
            setFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/questions/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/admin/questions');
            setQuestions(response.data);
        } catch (err) {
            console.error('Failed to fetch questions:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        try {
            await api.post('/admin/categories', { name: categoryName });
            setCategoryName('');
            setSuccess('Category added successfully!');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            setSuccess('Category deleted successfully!');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete category');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = {
            ...formData,
            category_id: formData.category_id ? parseInt(formData.category_id) : null
        };

        try {
            await api.post('/admin/questions', payload);
            setSuccess('Question added successfully!');
            setFormData({
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: 'A',
                hardness: 'easy',
                category_id: categories.length > 0 ? categories[0].id : '',
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

                <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--spacing-xl)' }}>
                    <div className="admin-main">
                        <section className="admin-section">
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

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="correct_answer">Correct Answer</label>
                                        <select
                                            id="correct_answer"
                                            name="correct_answer"
                                            value={formData.correct_answer}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="hardness">Hardness</label>
                                        <select
                                            id="hardness"
                                            name="hardness"
                                            value={formData.hardness}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category_id">Category</label>
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                    {loading ? 'Adding Question...' : 'Add Question'}
                                </button>
                            </form>
                        </section>

                        <section className="admin-section">
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
                                                <div className="q-meta">
                                                    <span>Correct: <strong>{q.correct_answer}</strong></span>
                                                    {q.category && <span className="badge badge-category">{q.category.name}</span>}
                                                    {q.hardness && <span className={`badge badge-${q.hardness}`}>{q.hardness}</span>}
                                                </div>
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
                        </section>
                    </div>

                    <div className="admin-sidebar">
                        <section className="admin-section">
                            <h2>Categories</h2>
                            <form onSubmit={handleAddCategory} className="category-add-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="New Category Name"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm btn-full" style={{ marginTop: 'var(--spacing-sm)' }}>
                                    Add Category
                                </button>
                            </form>

                            <div className="category-list" style={{ marginTop: 'var(--spacing-lg)' }}>
                                {categories.map(c => (
                                    <div key={c.id} className="category-item" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--spacing-sm) 0',
                                        borderBottom: '1px solid var(--border)'
                                    }}>
                                        <span>{c.name}</span>
                                        <button
                                            className="btn-icon text-danger"
                                            onClick={() => handleDeleteCategory(c.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .form-select {
                    width: 100%;
                    padding: var(--spacing-md) var(--spacing-lg);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border);
                    borderRadius: var(--radius-md);
                    color: var(--text-primary);
                    fontSize: var(--font-size-base);
                    fontFamily: var(--font-family);
                    cursor: pointer;
                }
                .badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-left: 8px;
                    text-transform: capitalize;
                }
                .badge-category { background: var(--primary-color); color: white; }
                .badge-easy { background: #28a745; color: white; }
                .badge-medium { background: #ffc107; color: #333; }
                .badge-hard { background: #dc3545; color: white; }
                .admin-section { margin-bottom: var(--spacing-xl); }
                .q-meta { display: flex; align-items: center; margin-top: var(--spacing-sm); font-size: 0.9rem; color: var(--text-secondary); }
            `}} />
        </div>
    );
}

export default AdminPanel;
