from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Any
from datetime import timedelta

from apps.api.core.database import get_db
from apps.api.modules.auth.schemas import UserCreate, UserLogin, Token, UserResponse, ForgotPasswordRequest, ResetPasswordRequest
from apps.api.modules.auth.service import AuthService, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

def get_auth_service(db: Session = Depends(get_db)):
    from apps.api.core.container import container
    return AuthService(db, container.email_service, container.event_bus)

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, service: AuthService = Depends(get_auth_service)):
    db_user = service.create_user(user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = service.create_access_token(
        data={"sub": db_user.email, "role": db_user.role, "id": db_user.id}, expires_delta=access_token_expires
    )
    refresh_token = service.create_refresh_token(
        data={"sub": db_user.email, "role": db_user.role, "id": db_user.id}
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "refresh_token": refresh_token,
        "user": db_user
    }

@router.post("/login", response_model=Token)
def login(form_data: UserLogin, service: AuthService = Depends(get_auth_service)):
    user = service.authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = service.create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}, expires_delta=access_token_expires
    )
    refresh_token = service.create_refresh_token(
        data={"sub": user.email, "role": user.role, "id": user.id}
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "refresh_token": refresh_token,
        "user": user
    }

@router.post("/developer/login", response_model=Token)
def developer_login(form_data: UserLogin, service: AuthService = Depends(get_auth_service)):
    # Specifically for Developer portal to ensure role check
    user = service.authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.role != "DEVELOPER":
        raise HTTPException(status_code=403, detail="Not authorized as Developer")
    
    access_token = service.create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    refresh_token = service.create_refresh_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token, "user": user}

@router.post("/buyer/login", response_model=Token)
def buyer_login(form_data: UserLogin, service: AuthService = Depends(get_auth_service)):
    # Specifically for Buyer portal
    user = service.authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.role != "BUYER":
        raise HTTPException(status_code=403, detail="Not authorized as Buyer")
    
    access_token = service.create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    refresh_token = service.create_refresh_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token, "user": user}

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    # Always return success message
    # TODO: Implement actual email logic invocation
    return {"message": "If this email is registered, a reset link has been sent."}
