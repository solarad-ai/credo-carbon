from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(str, enum.Enum):
    DEVELOPER = "DEVELOPER"
    BUYER = "BUYER"
    ADMIN = "ADMIN"
    VVB = "VVB"
    REGISTRY = "REGISTRY"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    # Generic JSON for profile details to be flexible (name, company, etc.)
    profile_data = Column(JSON, default={})
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="developer")

class ProjectStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED_TO_VVB = "SUBMITTED_TO_VVB"
    VALIDATION_PENDING = "VALIDATION_PENDING"
    VALIDATION_APPROVED = "VALIDATION_APPROVED"
    VERIFICATION_PENDING = "VERIFICATION_PENDING"
    VERIFICATION_APPROVED = "VERIFICATION_APPROVED"
    REGISTRY_REVIEW = "REGISTRY_REVIEW"
    ISSUED = "ISSUED"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey("users.id"))
    
    # Section 7: Project Type (Solar, Wind, A/R, etc.)
    project_type = Column(String, index=True)
    
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    
    # Store wizard state here? Or in a separate table?
    # Spec mentions "Project Setup Wizard" and "Draft Management"
    # We can store the current wizard step and data
    wizard_step = Column(String, default="0")
    wizard_data = Column(JSON, default={}) # Stores partial data from wizard

    # Basic Info (Section 8)
    name = Column(String)
    code = Column(String, unique=True, index=True) # Auto-generated
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    developer = relationship("User", back_populates="projects")
    documents = relationship("Document", back_populates="project")

    @property
    def country(self):
        if self.wizard_data and isinstance(self.wizard_data, dict):
            return self.wizard_data.get("country")
        return None

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    category = Column(String) # e.g., "PDD", "Evidence", "LandTitle"
    file_name = Column(String)
    storage_uri = Column(String) # Path in local FS or GCS
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="documents")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Who did it
    action = Column(String) # "CREATE_PROJECT", "LOGIN", "SUBMIT_VVB"
    entity_type = Column(String) # "PROJECT", "USER"
    entity_id = Column(String) # ID of impacted entity
    details = Column(JSON) # Diff or extra info
    timestamp = Column(DateTime, default=datetime.utcnow)


# ============ New Models for Dynamic Pages ============

class NotificationType(str, enum.Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    ISSUANCE = "issuance"
    VERIFICATION = "verification"
    VALIDATION = "validation"
    PROJECT = "project"
    MARKET = "market"
    RETIREMENT = "retirement"
    SYSTEM = "system"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text)
    link = Column(String, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="notifications")


class CreditHolding(Base):
    """Represents a user's carbon credit holdings"""
    __tablename__ = "credit_holdings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    vintage = Column(Integer, nullable=False)  # Year
    quantity = Column(Integer, nullable=False)  # Total credits
    available = Column(Integer, nullable=False)  # Available for sale/transfer
    locked = Column(Integer, default=0)  # Locked in active orders
    serial_start = Column(String)
    serial_end = Column(String)
    acquired_date = Column(DateTime, default=datetime.utcnow)
    unit_price = Column(Integer, default=0)  # Cents per credit

    user = relationship("User", backref="holdings")
    project = relationship("Project", backref="holdings")


class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    TRANSFER_IN = "transfer_in"
    TRANSFER_OUT = "transfer_out"
    ISSUANCE = "issuance"
    RETIREMENT = "retirement"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Transaction(Base):
    """Tracks all credit movements"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    quantity = Column(Integer, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    counterparty_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    amount_cents = Column(Integer, nullable=True)  # Price in cents
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", foreign_keys=[user_id], backref="transactions")
    project = relationship("Project", backref="transactions")


class RetirementStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Retirement(Base):
    """Carbon credit retirements"""
    __tablename__ = "retirements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    holding_id = Column(Integer, ForeignKey("credit_holdings.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    certificate_id = Column(String, unique=True, index=True, nullable=True)
    quantity = Column(Integer, nullable=False)
    vintage = Column(Integer, nullable=False)
    beneficiary = Column(String, nullable=False)
    beneficiary_address = Column(String)
    purpose = Column(String)
    serial_range = Column(String)
    status = Column(Enum(RetirementStatus), default=RetirementStatus.PENDING)
    retirement_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="retirements")
    project = relationship("Project", backref="retirements")


class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    SOLD = "sold"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

class MarketListing(Base):
    """Marketplace sell orders"""
    __tablename__ = "market_listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    holding_id = Column(Integer, ForeignKey("credit_holdings.id"), nullable=False)
    vintage = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    quantity_sold = Column(Integer, default=0)
    price_per_ton_cents = Column(Integer, nullable=False)  # Price in cents
    min_quantity = Column(Integer, default=1)
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    seller = relationship("User", backref="listings")
    project = relationship("Project", backref="listings")
    holding = relationship("CreditHolding", backref="listings")


class OfferStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COUNTER = "counter"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class Offer(Base):
    """Purchase offers on listings"""
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("market_listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_ton_cents = Column(Integer, nullable=False)
    status = Column(Enum(OfferStatus), default=OfferStatus.PENDING)
    counter_price_cents = Column(Integer, nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    responded_at = Column(DateTime, nullable=True)

    listing = relationship("MarketListing", backref="offers")
    buyer = relationship("User", backref="offers_made")
