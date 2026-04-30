from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class ReviewBase(SQLModel):
    product_id: int = Field(foreign_key="product.id")
    user_id: int = Field(foreign_key="user.id")
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class Review(ReviewBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    product: "Product" = Relationship(back_populates="reviews")
    user: "User" = Relationship()

class ReviewCreate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: int
    created_at: datetime
    user_name: Optional[str] = None # We'll populate this in the API
