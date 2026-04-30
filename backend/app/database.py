from sqlmodel import SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    poolclass=StaticPool if "sqlite" in settings.DATABASE_URL else None,
)

# If you want to add models, import them here for metadata registration.
from app.models import User, Product, Category, Order, OrderItem, Review, StoreSettings


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    print("[OK] All database tables created successfully")
