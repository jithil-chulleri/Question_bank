from sqlalchemy import create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://questionbank:questionbank123@db:5432/questionbank")

engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Starting migration...")
        
        # Create categories table if not exists
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL UNIQUE,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
            )
        """))
        print("Categories table checked/created.")
        
        # Add columns to questions table if they don't exist
        # Check if columns exist first
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='questions'"))
        columns = [row[0] for row in result]
        
        if 'hardness' not in columns:
            conn.execute(text("ALTER TABLE questions ADD COLUMN hardness VARCHAR"))
            print("Added hardness column to questions table.")
        
        if 'category_id' not in columns:
            conn.execute(text("ALTER TABLE questions ADD COLUMN category_id INTEGER REFERENCES categories(id)"))
            print("Added category_id column to questions table.")
            
        conn.commit()
        print("Migration completed successfully.")

if __name__ == "__main__":
    migrate()
