from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select
from typing import List, Any
from app.database import engine
from app.models.review import Review, ReviewCreate, ReviewRead
from app.models.user import User

router = APIRouter()

def get_db():
    with SQLSession(engine) as session:
        yield session

@router.post("/", response_model=ReviewRead)
def create_review(
    *, db: SQLSession = Depends(get_db), review_in: ReviewCreate
) -> Any:
    """
    Submit a new review.
    """
    db_obj = Review.from_orm(review_in)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/product/{product_id}", response_model=List[ReviewRead])
def read_product_reviews(
    *, db: SQLSession = Depends(get_db), product_id: int
) -> Any:
    """
    Get all reviews for a specific product.
    """
    statement = select(Review).where(Review.product_id == product_id)
    reviews = db.exec(statement).all()
    
    # Enrich with user name (in a real app, use joins)
    results = []
    for r in reviews:
        user = db.get(User, r.user_id)
        read_r = ReviewRead.from_orm(r)
        read_r.user_name = user.full_name if user else "Anonymous"
        results.append(read_r)
        
    return results
