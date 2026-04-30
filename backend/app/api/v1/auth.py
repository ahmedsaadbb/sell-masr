from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.database import engine
from sqlmodel import Session as SQLSession, select
from app.models.user import User, UserCreate, UserRead

router = APIRouter()

def get_db():
    with SQLSession(engine) as session:
        yield session

@router.post("/login/access-token")
def login_access_token(
    db: SQLSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    statement = select(User).where(User.email == form_data.username)
    user = db.exec(statement).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserRead)
def register_user(
    *, db: SQLSession = Depends(get_db), user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    statement = select(User).where(User.email == user_in.email)
    user = db.exec(statement).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    db_obj = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        phone_number=user_in.phone_number
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
