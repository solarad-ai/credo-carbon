from fastapi.testclient import TestClient
from apps.api.main import app
from apps.api.core.models import User, UserRole
from apps.api.core.database import SessionLocal
from apps.api.modules.auth.service import AuthService
from apps.api.core.container import container
from passlib.context import CryptContext

client = TestClient(app)

def test_crash():
    # 1. Ensure user exists
    db = SessionLocal()
    email = "crash_test@example.com"
    pwd = "password123"
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed = pwd_context.hash(pwd)
    
    # Clean up old
    db.query(User).filter(User.email == email).delete()
    db.commit()
    
    user = User(email=email, password_hash=hashed, role=UserRole.DEVELOPER)
    db.add(user)
    db.commit()
    db.close()
    
    # 2. Hit Endpoint with CLEAN payload
    print("Sending CLEAN payload...")
    res = client.post("/api/auth/developer/login", json={
        "email": email,
        "password": pwd
    })
    print(f"Clean Status: {res.status_code}")
    print(f"Clean Body: {res.text}")

    # 3. Hit Endpoint with DIRTY payload (extra fields)
    print("Sending DIRTY payload...")
    res = client.post("/api/auth/developer/login", json={
        "email": email,
        "password": pwd,
        "confirmPassword": pwd, 
        "role": "DEVELOPER",
        "name": "Test User"
    })
    print(f"Dirty Status: {res.status_code}")
    print(f"Dirty Body: {res.text}")

if __name__ == "__main__":
    test_crash()
