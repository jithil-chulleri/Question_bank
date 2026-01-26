import { useState } from 'react';
import api from '../utils/api';

function QuestionCard({ question, index, onAnswerSubmitted }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [answered, setAnswered] = useState(false);

    const handleAnswerClick = async (option) => {
        if (answered) return;

        setSelectedAnswer(option);

        try {
            const response = await api.post(`/questions/${question.id}/answer`, {
                selected_answer: option,
            });

            setFeedback(response.data);
            setAnswered(true);

            // Notify parent component
            if (onAnswerSubmitted) {
                onAnswerSubmitted();
            }
        } catch (err) {
            console.error('Error submitting answer:', err);
        }
    };

    const getOptionClass = (option) => {
        if (!answered) {
            return selectedAnswer === option ? 'option-btn selected' : 'option-btn';
        }

        if (feedback.correct_answer === option) {
            return 'option-btn correct';
        }

        if (selectedAnswer === option && !feedback.is_correct) {
            return 'option-btn incorrect';
        }

        return 'option-btn';
    };

    return (
        <div className="question-card">
            <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <div className="question-badges">
                    {question.category && (
                        <span className="badge badge-category">{question.category.name}</span>
                    )}
                    {question.hardness && (
                        <span className={`badge badge-${question.hardness}`}>{question.hardness}</span>
                    )}
                </div>
            </div>
            <h3 className="question-text">{question.question_text}</h3>

            <div className="options">
                <button
                    className={getOptionClass('A')}
                    onClick={() => handleAnswerClick('A')}
                    disabled={answered}
                >
                    A. {question.option_a}
                </button>
                <button
                    className={getOptionClass('B')}
                    onClick={() => handleAnswerClick('B')}
                    disabled={answered}
                >
                    B. {question.option_b}
                </button>
                <button
                    className={getOptionClass('C')}
                    onClick={() => handleAnswerClick('C')}
                    disabled={answered}
                >
                    C. {question.option_c}
                </button>
                <button
                    className={getOptionClass('D')}
                    onClick={() => handleAnswerClick('D')}
                    disabled={answered}
                >
                    D. {question.option_d}
                </button>
            </div>

            {feedback && (
                <div className={`feedback ${feedback.is_correct ? 'success' : 'error'}`}>
                    {feedback.is_correct ? (
                        <>✓ Correct! Well done!</>
                    ) : (
                        <>✗ Incorrect. The correct answer is {feedback.correct_answer}</>
                    )}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }
                .question-badges {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .badge-category {
                    background: rgba(var(--primary-color-rgb, 99, 102, 241), 0.1);
                    color: var(--primary-color);
                    border: 1px solid rgba(var(--primary-color-rgb, 99, 102, 241), 0.2);
                }
                .badge-easy { background: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid rgba(40, 167, 69, 0.2); }
                .badge-medium { background: rgba(255, 193, 7, 0.1); color: #d39e00; border: 1px solid rgba(255, 193, 7, 0.2); }
                .badge-hard { background: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid rgba(220, 53, 69, 0.2); }
            `}} />
        </div>
    );
}

export default QuestionCard;
