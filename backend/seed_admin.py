import os
from sqlmodel import Session, select
from app.database import engine
from app.models.user import User
from app.core.security import get_password_hash

def create_admin_user():
    with Session(engine) as session:
        statement = select(User).where(User.email == "admin@sellmasr.com")
        existing_user = session.exec(statement).first()
        
        if existing_user:
            print("Admin user already exists.")
            return

        # Read password from environment variable
        admin_password = os.getenv("ADMIN_DEFAULT_PASSWORD", "ChangeMe123!")
        
        admin_user = User(
            email="admin@sellmasr.com",
            hashed_password=get_password_hash(admin_password),
            full_name="System Administrator",
            role="admin",
            is_active=True
        )
        
        session.add(admin_user)
        session.commit()
        
        print("=" * 60)
        print("⚠️  تحذير أمان هام:")
        print(f"⚠️  تم إنشاء مستخدم ادمن افتراضي:")
        print(f"📧 البريد الإلكتروني: admin@sellmasr.com")
        print(f"🔑 كلمة المرور: {admin_password}")
        print("=" * 60)
        print("🚨 يرجى تغيير كلمة المرور فور تسجيل الدخول الأول!")
        print("🚨 للحذف، قم بتعيين متغير ADMIN_DEFAULT_PASSWORD أو تغييره في قاعدة البيانات.")
        print("=" * 60)

if __name__ == "__main__":
    create_admin_user()
