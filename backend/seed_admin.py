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

        admin_user = User(
            email="admin@sellmasr.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            role="admin",
            is_active=True
        )
        
        session.add(admin_user)
        session.commit()
        print("Admin user created successfully. Email: admin@sellmasr.com, Password: admin123")

if __name__ == "__main__":
    create_admin_user()
