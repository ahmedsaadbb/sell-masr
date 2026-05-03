from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select
from typing import List, Any, Optional
from app.database import engine
from app.models.product import Product, ProductCreate, ProductRead
from app.dependencies import admin_required

router = APIRouter()

def get_db():
    with SQLSession(engine) as session:
        yield session

@router.get("/", response_model=List[ProductRead])
def read_products(
    db: SQLSession = Depends(get_db), 
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> Any:
    """
    Retrieve products with search and filtering.
    """
    statement = select(Product)
    
    if search:
        statement = statement.where(
            (Product.name.contains(search)) | (Product.description.contains(search))
        )
    
    if category_id:
        statement = statement.where(Product.category_id == category_id)
        
    if min_price is not None:
        statement = statement.where(Product.price >= min_price)
        
    if max_price is not None:
        statement = statement.where(Product.price <= max_price)
        
    statement = statement.offset(skip).limit(limit)
    products = db.exec(statement).all()
    return products

@router.post("/", response_model=ProductRead)
def create_product(
    *, 
    db: SQLSession = Depends(get_db), 
    product_in: ProductCreate,
    current_admin: Any = Depends(admin_required)
) -> Any:
    """
    Create new product.
    """
    db_obj = Product.from_orm(product_in)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{id}", response_model=ProductRead)
def read_product(
    *, db: SQLSession = Depends(get_db), id: int
) -> Any:
    """
    Get product by ID.
    """
    product = db.get(Product, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{id}")
def delete_product(
    *, 
    db: SQLSession = Depends(get_db), 
    id: int,
    current_admin: Any = Depends(admin_required)
) -> Any:
    """
    Delete a product.
    """
    product = db.get(Product, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
