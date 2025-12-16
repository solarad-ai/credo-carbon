from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.api.core.models import Base, User
from apps.api.modules.auth.service import AuthService
from apps.api.modules.auth.schemas import UserCreate, UserRole
from apps.api.core.container import container
import sys

# Setup DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./credo_carbon.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_flow():
    email = "test_repro_real_3@example.com"
    pwd = "password123"
    
    # 1. Signup
    print("Attempting Signup...")
    service = AuthService(db, container.email_service, container.event_bus)
    try:
        # Check if exists first
        existing = db.query(User).filter(User.email == email).first()
        if not existing:
            user_in = UserCreate(email=email, password=pwd, role=UserRole.DEVELOPER)
            user = service.create_user(user_in)
            print(f"User created: {user.id}")
        else:
            print("User already exists, proceeding to login")
            user = existing
    except Exception as e:
        print(f"Signup Failed: {e}")
        import traceback
        traceback.print_exc()
        return

    # 2. Login
    print("Attempting Login...")
    try:
        user_auth = service.authenticate_user(email, pwd)
        if user_auth:
            print(f"Login Success: {user_auth.email}")
        else:
            print("Login Failed: Invalid credentials")
    except Exception as e:
        print(f"Login Crash: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_flow()
