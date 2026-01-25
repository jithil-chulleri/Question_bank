from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/questions", response_model=schemas.QuestionResponse)
def create_question(
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_admin_user)
):
    # Validate correct answer
    if question.correct_answer not in ['A', 'B', 'C', 'D']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Correct answer must be A, B, C, or D"
        )
    
    # Create question
    new_question = models.Question(
        question_text=question.question_text,
        option_a=question.option_a,
        option_b=question.option_b,
        option_c=question.option_c,
        option_d=question.option_d,
        correct_answer=question.correct_answer
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    return new_question

@router.post("/questions/bulk", response_model=List[schemas.QuestionResponse])
def create_questions_bulk(
    questions: List[schemas.QuestionCreate],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_admin_user)
):
    created_questions = []
    
    for question in questions:
        # Validate correct answer
        if question.correct_answer not in ['A', 'B', 'C', 'D']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Correct answer must be A, B, C, or D for question: {question.question_text}"
            )
        
        # Create question
        new_question = models.Question(
            question_text=question.question_text,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_answer=question.correct_answer
        )
        db.add(new_question)
        created_questions.append(new_question)
    
    db.commit()
    
    for question in created_questions:
        db.refresh(question)
    
    return created_questions

@router.get("/questions", response_model=List[schemas.QuestionResponse])
def get_all_questions_admin(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_admin_user)
):
    questions = db.query(models.Question).all()
    return questions

@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_admin_user)
):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    db.delete(question)
    db.commit()
    
    return {"message": "Question deleted successfully"}
