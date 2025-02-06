from sqlalchemy.orm import Session
from . import models, schemas
from .core.security import get_password_hash, verify_password
from app.models import User

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_item(db: Session, item_id: int):
    return db.query(models.Curso).filter(models.Curso.id == item_id).first()

def get_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Curso).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.CursoCreate):
    db_item = models.Curso(name=item.name, description=item.description, time=item.time)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: schemas.CursoUpdate):
    db_item = db.query(models.Curso).filter(models.Curso.id == item_id).first()
    if db_item:
        for key, value in item.dict(exclude_unset=True).items():
            setattr(db_item, key, value)
            db.commit()
            db.refresh(db_item)
        return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(models.Curso).filter(models.Curso.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()