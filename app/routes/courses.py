from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from app.dependecies import get_current_user  
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=list[schemas.Curso])
def read_cursos(
    skip: int = 0, limit: int = 10,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)  
):
    try:
        cursos = crud.get_items(db, skip=skip, limit=limit)
        return cursos
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro ao listar cursos.")

@router.get("/{curso_id}", response_model=schemas.Curso)
def read_curso(
    curso_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)  
):
    try:
        db_curso = crud.get_item(db, item_id=curso_id)
        if db_curso is None:
            raise HTTPException(status_code=404, detail="Curso não encontrado")
        return db_curso
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar o curso.")

@router.post("/", response_model=schemas.Curso)
def create_curso(
    curso: schemas.CursoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)  
):
    try:
        return crud.create_item(db=db, item=curso)
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar curso.")

@router.put("/{curso_id}", response_model=schemas.Curso)
def update_curso(
    curso_id: int,
    curso: schemas.CursoUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)  
):
    try:
        db_curso = crud.get_item(db, item_id=curso_id)
        if db_curso is None:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        updated_curso = crud.update_item(db=db, item_id=curso_id, item=curso)
        return updated_curso
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o curso.")

@router.delete("/{curso_id}")
def delete_curso(
    curso_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user) 
):
    try:
        db_curso = crud.get_item(db, item_id=curso_id)
        if db_curso is None:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        crud.delete_item(db=db, item_id=curso_id)
        return {"detail": "Curso removido com sucesso"}
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro ao remover o curso.")
