from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItemBase(SQLModel):
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    price_at_order: float

class OrderItem(OrderItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(default=None, foreign_key="order.id")
    
    order: Optional["Order"] = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="order_items")

class OrderBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    total_amount: float
    shipping_address: str
    customer_name: str
    customer_phone: str

class Order(OrderBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    items: List[OrderItem] = Relationship(back_populates="order")

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderRead(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItem]
