from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select, join
from typing import List, Any
from app.database import engine
from app.models.review import Review, ReviewCreate, ReviewRead
from app.models.user import User
from app.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=ReviewRead)
def create_review(
    *, 
    db: SQLSession = Depends(get_db), 
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Submit a new review.
    """
    db_obj = Review.from_orm(review_in)
    db_obj.user_id = current_user.id
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/product/{product_id}", response_model=List[ReviewRead])
def read_product_reviews(
    *, db: SQLSession = Depends(get_db), product_id: int
) -> Any:
    """
    Get all reviews for a specific product with user info (optimized with JOIN).
    """
    # Use JOIN to fetch reviews with user info in a single query
    statement = (
        select(Review, User.full_name)
        .join(User, Review.user_id == User.id)
        .where(Review.product_id == product_id)
    )
    
    results = db.exec(statement).all()
    
    # Convert results to ReviewRead list
    review_list = []
    for review, user_full_name in results:
        review_read = ReviewRead.from_orm(review)
        review_read.user_name = user_full_name if user_full_name else "Anonymous"
        review_list.append(review_read)
    
    return review_list
