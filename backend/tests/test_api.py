"""
اختبارات الـ API الأساسية
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session
from app.models.models import User, UserRole
from app.core.security import hash_password


# إنشاء قاعدة بيانات اختبار
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_root_endpoint(client: TestClient):
    """اختبار الصفحة الرئيسية"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "مرحبا بك في منصة SellMasr"


def test_health_check(client: TestClient):
    """اختبار فحص الصحة"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_api_health(client: TestClient):
    """اختبار فحص صحة API"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_user(client: TestClient):
    """اختبار تسجيل مستخدم جديد"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword123",
            "role": "customer"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    assert data["user"]["email"] == "test@example.com"


def test_register_duplicate_email(client: TestClient, session: Session):
    """اختبار تسجيل بريد إلكتروني مكرر"""
    # إنشاء مستخدم أول
    user = User(
        email="duplicate@example.com",
        full_name="Test User",
        password_hash=hash_password("testpassword123"),
        role=UserRole.CUSTOMER
    )
    session.add(user)
    session.commit()
    
    # محاولة تسجيل نفس البريد
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "Another User",
            "password": "testpassword123",
            "role": "customer"
        }
    )
    assert response.status_code == 400


def test_login_user(client: TestClient, session: Session):
    """اختبار تسجيل دخول المستخدم"""
    # إنشاء مستخدم
    user = User(
        email="login@example.com",
        full_name="Test User",
        password_hash=hash_password("testpassword123"),
        role=UserRole.CUSTOMER,
        is_active=True
    )
    session.add(user)
    session.commit()
    
    # محاولة الدخول
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    assert data["user"]["email"] == "login@example.com"


def test_login_invalid_password(client: TestClient, session: Session):
    """اختبار تسجيل الدخول بكلمة مرور خاطئة"""
    # إنشاء مستخدم
    user = User(
        email="test@example.com",
        full_name="Test User",
        password_hash=hash_password("testpassword123"),
        role=UserRole.CUSTOMER
    )
    session.add(user)
    session.commit()
    
    # محاولة الدخول بكلمة مرور خاطئة
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
