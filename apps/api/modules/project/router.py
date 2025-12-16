from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.models import Project, ProjectStatus, User
from apps.api.modules.auth.dependencies import get_current_user 
from pydantic import BaseModel
from typing import Optional, List, Any

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    # Step 1
    projectType: str
    registry: Optional[str]
    methodology: Optional[str]
    # Step 2
    name: Optional[str]
    description: Optional[str]
    startDate: Optional[str]
    creditingPeriodStart: Optional[str]
    creditingPeriodEnd: Optional[str]
    location: Optional[Any] # JSON
    # Step 3
    installedCapacity: Optional[str]
    estimatedGeneration: Optional[str] 
    
    # Allow extra fields for now
    class Config:
        extra = "allow"

class ProjectResponse(BaseModel):
    id: int
    code: Optional[str]
    project_type: str
    status: str
    name: Optional[str]
    wizard_data: Optional[Any]

    class Config:
        from_attributes = True

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "DEVELOPER":
        raise HTTPException(status_code=403, detail="Only developers can create projects")
    
    # Generate a simple code (C-100X)
    import random
    code = f"C-{random.randint(1000,9999)}"

    new_project = Project(
        developer_id=current_user.id,
        project_type=project.projectType,
        status=ProjectStatus.VALIDATION_PENDING, # Auto-submit for demo
        name=project.name,
        code=code,
        wizard_data=project.dict() # Store full wizard payload
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=List[ProjectResponse])
def get_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "DEVELOPER":
        return db.query(Project).filter(Project.developer_id == current_user.id).all()
    if current_user.role == "BUYER":
         return db.query(Project).filter(Project.status == ProjectStatus.ISSUED).all() # Buyers see issued projects
    return []

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # RBAC Check
    if current_user.role == "DEVELOPER" and project.developer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this project")
    
    return project
