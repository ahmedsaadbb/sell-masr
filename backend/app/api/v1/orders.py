from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select
from typing import List, Any
from app.database import engine
from app.models.order import Order, OrderCreate, OrderRead, OrderItem
from app.models.product import Product

router = APIRouter()

def get_db():
    with SQLSession(engine) as session:
        yield session

@router.post("/", response_model=OrderRead)
def create_order(
    *, db: SQLSession = Depends(get_db), order_in: OrderCreate
) -> Any:
    """
    Create new order and deduct stock.
    """
    # 1. Calculate total amount and check stock
    total_amount = 0
    db_order_items = []
    
    for item in order_in.items:
        product = db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough stock for {product.name}. Available: {product.stock_quantity}"
            )
        
        # Deduct stock
        product.stock_quantity -= item.quantity
        db.add(product)
        
        item_total = product.price * item.quantity
        total_amount += item_total
        
        # Prepare OrderItem
        db_item = OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_order=product.price
        )
        db_order_items.append(db_item)

    # 2. Create the Order
    db_order = Order(
        user_id=order_in.user_id,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # 3. Link items to order
    for db_item in db_order_items:
        db_item.order_id = db_order.id
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderRead])
def read_orders(
    db: SQLSession = Depends(get_db), skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve orders.
    """
    statement = select(Order).offset(skip).limit(limit)
    orders = db.exec(statement).all()
    return orders

@router.get("/{id}", response_model=OrderRead)
def read_order(
    *, db: SQLSession = Depends(get_db), id: int
) -> Any:
    """
    Get order by ID.
    """
    order = db.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{id}/status")
def update_order_status(
    *, db: SQLSession = Depends(get_db), id: int, status: str
) -> Any:
    """
    Update order status.
    """
    order = db.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
