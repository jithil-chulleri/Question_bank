-- This script runs automatically when the PostgreSQL container is first created

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question_text VARCHAR NOT NULL,
    option_a VARCHAR NOT NULL,
    option_b VARCHAR NOT NULL,
    option_c VARCHAR NOT NULL,
    option_d VARCHAR NOT NULL,
    correct_answer VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    selected_answer VARCHAR NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- Create admin user (password: admin123)
-- Note: The hashed password below is bcrypt hash of 'admin123'
INSERT INTO users (email, hashed_password, is_admin, created_at)
VALUES ('admin@questionbank.com', '$2b$12$k9nlXONr9Le12vYf2UAA/OxygL3KpOOovB0hnCGNooYA.we3nPPKG', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_at)
VALUES 
    ('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', NOW()),
    ('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', NOW()),
    ('What is 2 + 2?', '3', '4', '5', '6', 'B', NOW()),
    ('Who wrote "Romeo and Juliet"?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain', 'B', NOW()),
    ('What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'D', NOW())
ON CONFLICT DO NOTHING;
