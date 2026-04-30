from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database import create_db_and_tables
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.products import router as products_router
from app.api.v1.categories import router as categories_router
from app.api.v1.media import router as media_router
from app.api.v1.orders import router as orders_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.settings import router as settings_router
from app.api.v1.ai import router as ai_router
from fastapi.staticfiles import StaticFiles
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[START] SellMasr application starting...")
    create_db_and_tables()
    print("[OK] Database setup complete")
    yield
    print("[STOP] SellMasr application shutting down...")

app = FastAPI(
    title="SellMasr API",
    description="منصة دروبشيبنج للسوق المصري - API الخلفي",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(products_router, prefix="/api/v1/products", tags=["products"])
app.include_router(categories_router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(media_router, prefix="/api/v1/media", tags=["media"])
app.include_router(orders_router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(reviews_router, prefix="/api/v1/reviews", tags=["reviews"])
app.include_router(settings_router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])

# Serve static files from uploads folder
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "مرحبا بك في منصة SellMasr", "status": "running"}
