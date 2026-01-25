import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import QuestionCard from './QuestionCard';

function Dashboard() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        fetchQuestions();
        fetchStats();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/questions');
            setQuestions(response.data);
        } catch (err) {
            setError('Failed to load questions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleResetStats = async () => {
        try {
            await api.delete('/stats/reset');
            await fetchStats();
            setShowResetConfirm(false);
            setShowMenu(false);
            window.location.reload();
        } catch (err) {
            console.error('Failed to reset stats:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
    };

    const handleAnswerSubmitted = () => {
        fetchStats();
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Question Bank</h1>

                    <div className="header-right">
                        {/* Percentage Badge */}
                        {stats && stats.total_answers > 0 && (
                            <div className="percentage-badge">
                                {stats.percentage}%
                            </div>
                        )}

                        {/* Three Dot Menu */}
                        <div className="menu-container">
                            <button
                                className="menu-trigger"
                                onClick={() => setShowMenu(!showMenu)}
                                aria-label="Menu"
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>

                            {showMenu && (
                                <>
                                    <div className="menu-overlay" onClick={() => setShowMenu(false)} />
                                    <div className="dropdown-menu">
                                        {/* Stats Section */}
                                        {stats && stats.total_answers > 0 && (
                                            <>
                                                <div className="menu-section">
                                                    <div className="menu-section-title">Statistics</div>
                                                    <div className="stats-grid">
                                                        <div className="stat-box">
                                                            <div className="stat-box-value">{stats.correct_answers}</div>
                                                            <div className="stat-box-label">Correct</div>
                                                        </div>
                                                        <div className="stat-box">
                                                            <div className="stat-box-value">{stats.incorrect_answers}</div>
                                                            <div className="stat-box-label">Incorrect</div>
                                                        </div>
                                                        <div className="stat-box">
                                                            <div className="stat-box-value">{stats.total_answers}</div>
                                                            <div className="stat-box-label">Total</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="menu-item danger"
                                                        onClick={() => {
                                                            setShowMenu(false);
                                                            setShowResetConfirm(true);
                                                        }}
                                                    >
                                                        <span>🔄</span> Reset Statistics
                                                    </button>
                                                </div>
                                                <div className="menu-divider"></div>
                                            </>
                                        )}

                                        {/* Admin Panel */}
                                        {isAdmin && (
                                            <>
                                                <button
                                                    className="menu-item"
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        navigate('/admin');
                                                    }}
                                                >
                                                    <span>⚙️</span> Admin Panel
                                                </button>
                                                <div className="menu-divider"></div>
                                            </>
                                        )}

                                        {/* Logout */}
                                        <button
                                            className="menu-item"
                                            onClick={handleLogout}
                                        >
                                            <span>🚪</span> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reset Confirmation Modal */}
                {showResetConfirm && (
                    <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Reset Statistics?</h3>
                            <p>This will delete all your answer history. This action cannot be undone.</p>
                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowResetConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleResetStats}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                {questions.length === 0 ? (
                    <div className="text-center">
                        <p>No questions available yet.</p>
                        {isAdmin && (
                            <button
                                className="btn btn-primary mt-md"
                                onClick={() => navigate('/admin')}
                            >
                                Add Questions
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="question-container">
                        <div className="question-progress">
                            Question {currentIndex + 1} of {questions.length}
                        </div>

                        <QuestionCard
                            question={questions[currentIndex]}
                            index={currentIndex}
                            key={questions[currentIndex].id}
                            onAnswerSubmitted={handleAnswerSubmitted}
                        />

                        <div className="navigation-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                            >
                                ← Previous
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleNext}
                                disabled={currentIndex === questions.length - 1}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
