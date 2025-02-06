from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.core.security import verify_password, create_access_token, create_password_reset_token, get_password_hash, jwt, SECRET_KEY, ALGORITHM, JWTError
from app.schemas import Token
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

def send_password_reset_email(email: str, token: str):
    sender_email = "seu_email@gmail.com"
    receiver_email = email
    subject = "Recuperação de Senha"
    body = f"Use o seguinte link para redefinir sua senha: http://localhost:8000/reset-password?token={token}"

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, "sua_senha")
            server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao enviar email de recuperação.")

@router.post("/password-recovery")
def password_recovery(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    token = create_password_reset_token(data={"sub": email})
    send_password_reset_email(email, token)
    return {"message": "Email de recuperação enviado."}

@router.post("/reset-password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Token inválido.")
        
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado.")
        
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
        return {"message": "Senha redefinida com sucesso."}
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado.")
