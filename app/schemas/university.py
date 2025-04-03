from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UniversityBase(BaseModel):
    name: str
    acronym: str
    city: Optional[str] = None
    state: Optional[str] = None
    is_active: bool = True

class UniversityCreate(UniversityBase):
    pass

class UniversityUpdate(UniversityBase):
    pass

class University(UniversityBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 