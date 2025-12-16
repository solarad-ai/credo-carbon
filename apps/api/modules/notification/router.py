"""
Notification API Module
Handles user notifications - Database backed
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from apps.api.core.database import get_db
from apps.api.core.models import User, Notification as NotificationModel, NotificationType
from apps.api.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

# ============ Schemas ============

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: Optional[str]
    link: Optional[str]
    read: bool
    timestamp: str

    class Config:
        from_attributes = True

# ============ Endpoints ============

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all notifications for current user from database"""
    
    notifications = db.query(NotificationModel)\
        .filter(NotificationModel.user_id == current_user.id)\
        .order_by(NotificationModel.created_at.desc())\
        .all()
    
    return [
        NotificationResponse(
            id=n.id,
            type=n.type.value if hasattr(n.type, 'value') else str(n.type),
            title=n.title,
            message=n.message,
            link=n.link,
            read=n.read,
            timestamp=n.created_at.strftime("%Y-%m-%d %H:%M") if n.created_at else ""
        )
        for n in notifications
    ]

@router.get("/unread-count")
def get_unread_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get unread notification count from database"""
    
    count = db.query(NotificationModel)\
        .filter(NotificationModel.user_id == current_user.id, NotificationModel.read == False)\
        .count()
    
    return {"count": count}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Mark a notification as read"""
    
    notification = db.query(NotificationModel)\
        .filter(NotificationModel.id == notification_id, NotificationModel.user_id == current_user.id)\
        .first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    db.commit()
    
    return {"success": True}

@router.put("/mark-all-read")
def mark_all_as_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Mark all notifications as read"""
    
    count = db.query(NotificationModel)\
        .filter(NotificationModel.user_id == current_user.id, NotificationModel.read == False)\
        .update({"read": True})
    
    db.commit()
    
    return {"success": True, "count": count}

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a notification"""
    
    notification = db.query(NotificationModel)\
        .filter(NotificationModel.id == notification_id, NotificationModel.user_id == current_user.id)\
        .first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"success": True}
