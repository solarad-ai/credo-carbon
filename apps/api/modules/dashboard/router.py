"""
Dashboard API Module
Database-backed aggregated data for dashboards
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from apps.api.core.database import get_db
from apps.api.core.models import (
    User, Project, ProjectStatus,
    CreditHolding, Transaction, TransactionType, TransactionStatus,
    MarketListing, ListingStatus, Retirement, RetirementStatus
)
from apps.api.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# ============ Schemas ============

class DeveloperDashboardStats(BaseModel):
    total_projects: int
    active_projects: int
    total_credits_issued: int
    credits_available: int
    credits_sold: int
    revenue_mtd: float
    pending_verifications: int

class BuyerDashboardStats(BaseModel):
    total_credits: int
    total_value: float
    credits_retired: int
    pending_orders: int
    carbon_offset_tons: float
    active_offers: int

class ActivityItem(BaseModel):
    id: int
    type: str
    title: str
    description: str
    timestamp: str
    icon: str

class ProjectSummary(BaseModel):
    id: int
    name: str
    code: str
    status: str
    project_type: str
    progress: int
    credits_issued: Optional[int]
    next_action: str

# ============ Endpoints ============

@router.get("/developer/stats", response_model=DeveloperDashboardStats)
def get_developer_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get developer dashboard statistics from database"""
    
    projects = db.query(Project).filter(Project.developer_id == current_user.id).all()
    holdings = db.query(CreditHolding).filter(CreditHolding.user_id == current_user.id).all()
    
    total_credits = sum(h.quantity for h in holdings)
    available_credits = sum(h.available for h in holdings)
    
    # Get sales this month
    current_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    sales = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType.SALE,
        Transaction.status == TransactionStatus.COMPLETED,
        Transaction.created_at >= current_month
    ).all()
    
    credits_sold = sum(t.quantity for t in sales)
    revenue_mtd = sum(t.amount_cents / 100.0 for t in sales if t.amount_cents)
    
    # Count pending verifications
    pending_verifications = len([p for p in projects if p.status in [
        ProjectStatus.VERIFICATION_PENDING, ProjectStatus.VALIDATION_PENDING
    ]])
    
    return DeveloperDashboardStats(
        total_projects=len(projects),
        active_projects=len([p for p in projects if p.status != ProjectStatus.DRAFT]),
        total_credits_issued=total_credits,
        credits_available=available_credits,
        credits_sold=credits_sold,
        revenue_mtd=revenue_mtd,
        pending_verifications=pending_verifications
    )

@router.get("/buyer/stats", response_model=BuyerDashboardStats)
def get_buyer_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get buyer dashboard statistics from database"""
    
    holdings = db.query(CreditHolding).filter(CreditHolding.user_id == current_user.id).all()
    retirements = db.query(Retirement).filter(
        Retirement.user_id == current_user.id,
        Retirement.status == RetirementStatus.COMPLETED
    ).all()
    
    total_credits = sum(h.quantity for h in holdings)
    total_value = sum(h.quantity * (h.unit_price / 100.0) for h in holdings)
    credits_retired = sum(r.quantity for r in retirements)
    
    # Count pending and active items
    from apps.api.core.models import Offer, OfferStatus
    active_offers = db.query(Offer).filter(
        Offer.buyer_id == current_user.id,
        Offer.status.in_([OfferStatus.PENDING, OfferStatus.COUNTER])
    ).count()
    
    pending_retirements = db.query(Retirement).filter(
        Retirement.user_id == current_user.id,
        Retirement.status == RetirementStatus.PENDING
    ).count()
    
    return BuyerDashboardStats(
        total_credits=total_credits,
        total_value=total_value,
        credits_retired=credits_retired,
        pending_orders=pending_retirements,
        carbon_offset_tons=float(credits_retired),
        active_offers=active_offers
    )

@router.get("/activity", response_model=List[ActivityItem])
def get_recent_activity(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent activity from transactions"""
    
    transactions = db.query(Transaction)\
        .filter(Transaction.user_id == current_user.id)\
        .order_by(Transaction.created_at.desc())\
        .limit(limit)\
        .all()
    
    activities = []
    for i, t in enumerate(transactions):
        project = db.query(Project).filter(Project.id == t.project_id).first() if t.project_id else None
        project_name = project.name if project else "Unknown"
        
        type_config = {
            TransactionType.ISSUANCE: ("Credits Issued", f"{t.quantity:,} VCUs issued for {project_name}", "coins"),
            TransactionType.SALE: ("Sale Completed", f"Sold {t.quantity:,} credits", "dollar"),
            TransactionType.PURCHASE: ("Purchase Complete", f"Bought {t.quantity:,} credits", "cart"),
            TransactionType.RETIREMENT: ("Credits Retired", f"Retired {t.quantity:,} credits", "leaf"),
            TransactionType.TRANSFER_IN: ("Transfer Received", f"Received {t.quantity:,} credits", "arrow-down"),
            TransactionType.TRANSFER_OUT: ("Transfer Sent", f"Sent {t.quantity:,} credits", "arrow-up"),
        }
        
        title, description, icon = type_config.get(t.type, ("Transaction", f"{t.quantity} credits", "activity"))
        
        # Format timestamp
        if t.created_at:
            delta = datetime.utcnow() - t.created_at
            if delta.days == 0:
                if delta.seconds < 3600:
                    timestamp = f"{delta.seconds // 60} minutes ago"
                else:
                    timestamp = f"{delta.seconds // 3600} hours ago"
            elif delta.days == 1:
                timestamp = "Yesterday"
            elif delta.days < 7:
                timestamp = f"{delta.days} days ago"
            else:
                timestamp = t.created_at.strftime("%b %d")
        else:
            timestamp = ""
        
        activities.append(ActivityItem(
            id=t.id,
            type=t.type.value,
            title=title,
            description=description,
            timestamp=timestamp,
            icon=icon
        ))
    
    return activities

@router.get("/projects/summary", response_model=List[ProjectSummary])
def get_projects_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get project summary from database"""
    
    projects = db.query(Project).filter(Project.developer_id == current_user.id).all()
    
    summaries = []
    for project in projects:
        progress_map = {
            ProjectStatus.DRAFT: 10,
            ProjectStatus.SUBMITTED_TO_VVB: 25,
            ProjectStatus.VALIDATION_PENDING: 40,
            ProjectStatus.VALIDATION_APPROVED: 55,
            ProjectStatus.VERIFICATION_PENDING: 70,
            ProjectStatus.VERIFICATION_APPROVED: 85,
            ProjectStatus.REGISTRY_REVIEW: 95,
            ProjectStatus.ISSUED: 100
        }
        
        next_action_map = {
            ProjectStatus.DRAFT: "Complete wizard",
            ProjectStatus.SUBMITTED_TO_VVB: "Awaiting VVB response",
            ProjectStatus.VALIDATION_PENDING: "Upload documents",
            ProjectStatus.VALIDATION_APPROVED: "Start verification",
            ProjectStatus.VERIFICATION_PENDING: "Submit monitoring report",
            ProjectStatus.VERIFICATION_APPROVED: "Submit to registry",
            ProjectStatus.REGISTRY_REVIEW: "Awaiting registration",
            ProjectStatus.ISSUED: "List for sale"
        }
        
        # Get credits issued for this project
        holdings = db.query(CreditHolding).filter(
            CreditHolding.user_id == current_user.id,
            CreditHolding.project_id == project.id
        ).all()
        credits_issued = sum(h.quantity for h in holdings) if project.status == ProjectStatus.ISSUED else None
        
        summaries.append(ProjectSummary(
            id=project.id,
            name=project.name or f"Project {project.id}",
            code=project.code or f"P-{project.id}",
            status=project.status.value if project.status else "DRAFT",
            project_type=project.project_type or "unknown",
            progress=progress_map.get(project.status, 10),
            credits_issued=credits_issued,
            next_action=next_action_map.get(project.status, "Continue setup")
        ))
    
    return summaries

@router.get("/marketplace/featured")
def get_featured_listings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get featured marketplace listings from database"""
    
    listings = db.query(MarketListing)\
        .filter(MarketListing.status == ListingStatus.ACTIVE)\
        .order_by(MarketListing.created_at.desc())\
        .limit(6)\
        .all()
    
    result = []
    for listing in listings:
        project = db.query(Project).filter(Project.id == listing.project_id).first()
        seller = db.query(User).filter(User.id == listing.seller_id).first()
        
        project_name = project.name if project else f"Project {listing.project_id}"
        project_type = project.project_type if project else "unknown"
        registry = "VCS"
        location = "India"
        if project and project.wizard_data:
            registry = project.wizard_data.get("credit_estimation", {}).get("registry", "VCS")
            location = project.wizard_data.get("basic_info", {}).get("location", "India")
        
        seller_name = seller.profile_data.get("company", seller.email) if seller and seller.profile_data else "Unknown"
        
        result.append({
            "id": listing.id,
            "project_name": project_name,
            "project_type": project_type,
            "registry": registry,
            "vintage": listing.vintage,
            "quantity_available": listing.quantity - listing.quantity_sold,
            "price_per_ton": listing.price_per_ton_cents / 100.0,
            "rating": 4.8,
            "location": location,
            "seller": seller_name
        })
    
    return result
