from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from .. import models, auth
from ..database import get_db

router = APIRouter(prefix="/api/stats", tags=["statistics"])

@router.get("")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get user's answer statistics"""
    total_answers = db.query(models.UserAnswer).filter(
        models.UserAnswer.user_id == current_user.id
    ).count()
    
    correct_answers = db.query(models.UserAnswer).filter(
        models.UserAnswer.user_id == current_user.id,
        models.UserAnswer.is_correct == True
    ).count()
    
    percentage = (correct_answers / total_answers * 100) if total_answers > 0 else 0
    
    return {
        "total_answers": total_answers,
        "correct_answers": correct_answers,
        "incorrect_answers": total_answers - correct_answers,
        "percentage": round(percentage, 1)
    }

@router.delete("/reset")
def reset_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Reset user's answer history"""
    deleted_count = db.query(models.UserAnswer).filter(
        models.UserAnswer.user_id == current_user.id
    ).delete()
    
    db.commit()
    
    return {
        "message": "Statistics reset successfully",
        "deleted_answers": deleted_count
    }
