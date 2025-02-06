from fastapi.responses import RedirectResponse
from fastapi import Form, APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.core.security import get_password_hash
from app.schemas import UserCreate

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    if db.query(models.User).filter(models.User.username == username).first():
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso.")
    
    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Email já está registrado.")

    hashed_password = get_password_hash(password)

    new_user = models.User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
