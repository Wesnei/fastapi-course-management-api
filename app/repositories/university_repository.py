from sqlalchemy.orm import Session
from app.models.university import University
from app.schemas.university import UniversityCreate, UniversityUpdate
from typing import List, Optional

class UniversityRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, university: UniversityCreate) -> University:
        db_university = University(**university.model_dump())
        self.db.add(db_university)
        self.db.commit()
        self.db.refresh(db_university)
        return db_university

    def get_all(self, skip: int = 0, limit: int = 100) -> List[University]:
        return self.db.query(University).offset(skip).limit(limit).all()

    def get_by_id(self, university_id: int) -> Optional[University]:
        return self.db.query(University).filter(University.id == university_id).first()

    def update(self, university_id: int, university: UniversityUpdate) -> Optional[University]:
        db_university = self.get_by_id(university_id)
        if db_university:
            for key, value in university.model_dump(exclude_unset=True).items():
                setattr(db_university, key, value)
            self.db.commit()
            self.db.refresh(db_university)
        return db_university

    def delete(self, university_id: int) -> bool:
        db_university = self.get_by_id(university_id)
        if db_university:
            self.db.delete(db_university)
            self.db.commit()
            return True
        return False 