from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, questions, admin, stats

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Question Bank API",
    description="API for Question Bank Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(admin.router)
app.include_router(stats.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {
        "message": "Question Bank API",
        "docs": "/docs",
        "health": "/health"
    }
