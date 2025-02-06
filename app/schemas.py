from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        from_orm = True

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    profile_image: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CursoBase (BaseModel):
    name: str
    description: str
    time: int

class CursoCreate(CursoBase):
    pass

class CursoUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    time: Optional[int]

class Curso(CursoBase):
    id: int

    class Config:
        from_attributes = True
