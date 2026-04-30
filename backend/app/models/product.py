from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class CategoryBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None
    slug: str = Field(unique=True, index=True)

class Category(CategoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    products: List["Product"] = Relationship(back_populates="category")

class ProductBase(SQLModel):
    name: str = Field(index=True)
    description: str
    price: float
    stock_quantity: int = Field(default=0)
    sku: str = Field(unique=True, index=True)
    image_url: Optional[str] = None
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    category: Optional[Category] = Relationship(back_populates="products")
    order_items: List["OrderItem"] = Relationship(back_populates="product")
    reviews: List["Review"] = Relationship(back_populates="product")

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: int
    created_at: datetime

class CategoryRead(CategoryBase):
    id: int
