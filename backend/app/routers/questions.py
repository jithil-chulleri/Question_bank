from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.get("/categories", response_model=List[schemas.Category])
def get_categories(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Category).all()

@router.get("", response_model=List[schemas.QuestionResponse])
def get_questions(
    category_id: Optional[int] = None,
    hardness: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Question)
    if category_id:
        query = query.filter(models.Question.category_id == category_id)
    if hardness:
        query = query.filter(models.Question.hardness == hardness)
    
    questions = query.all()
    
    # Don't show correct answer to non-admin users
    if not current_user.is_admin:
        for question in questions:
            question.correct_answer = None
    
    return questions

@router.get("/{question_id}", response_model=schemas.QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Don't show correct answer to non-admin users
    if not current_user.is_admin:
        question.correct_answer = None
    
    return question

@router.post("/{question_id}/answer", response_model=schemas.AnswerResponse)
def submit_answer(
    question_id: int,
    answer: schemas.AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate answer format
    if answer.selected_answer not in ['A', 'B', 'C', 'D']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Answer must be A, B, C, or D"
        )
    
    # Get question
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if answer is correct
    is_correct = answer.selected_answer == question.correct_answer
    
    # Save user answer
    user_answer = models.UserAnswer(
        user_id=current_user.id,
        question_id=question_id,
        selected_answer=answer.selected_answer,
        is_correct=is_correct
    )
    db.add(user_answer)
    db.commit()
    
    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "selected_answer": answer.selected_answer
    }
