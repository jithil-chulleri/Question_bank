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
            <span className="question-number">Question {index + 1}</span>
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
        </div>
    );
}

export default QuestionCard;
