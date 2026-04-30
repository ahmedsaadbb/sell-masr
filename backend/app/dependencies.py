from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

from app.core.config import settings
from app.core.security import verify_password
from app.database import engine
from sqlmodel import Session as SQLSession, select
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/access-token")

def get_db():
    with SQLSession(engine) as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: SQLSession = Depends(get_db)
) -> User:
    """Validate JWT token and return the authenticated user.
    Raises 401 if token is invalid or user not found.
    """
    try:
        from jose import jwt, JWTError
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    statement = select(User).where(User.id == user_id)
    user = db.exec(statement).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def admin_required(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Ensures the current user has ADMIN role.
    Raises 403 if not admin.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
