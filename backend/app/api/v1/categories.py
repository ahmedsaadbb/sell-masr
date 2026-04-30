from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select
from typing import List, Any
from app.database import engine
from app.models.product import Category, CategoryRead
from app.dependencies import get_db

@router.get("/", response_model=List[CategoryRead])
def read_categories(
    db: SQLSession = Depends(get_db), skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve categories.
    """
    statement = select(Category).offset(skip).limit(limit)
    categories = db.exec(statement).all()
    return categories

@router.post("/", response_model=CategoryRead)
def create_category(
    *, db: SQLSession = Depends(get_db), category_in: Category
) -> Any:
    """
    Create new category.
    """
    db.add(category_in)
    db.commit()
    db.refresh(category_in)
    return category_in
