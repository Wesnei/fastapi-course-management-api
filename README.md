# API de Gerenciamento de Cursos

Uma API RESTful para gerenciamento de cursos e usuários, desenvolvida com FastAPI e seguindo as melhores práticas de desenvolvimento.

## Características

- Autenticação e autorização de usuários
- Gerenciamento completo de cursos (CRUD)
- Validação de dados com Pydantic
- Logging detalhado
- Configuração via variáveis de ambiente
- Documentação automática com Swagger UI
- Testes unitários e de integração
- Código organizado seguindo padrões de projeto

## Tecnologias Utilizadas

- Python 3.8+
- FastAPI
- SQLAlchemy
- Pydantic
- Python-jose (JWT)
- Passlib (hash de senhas)
- Python-multipart
- pytest (testes)

## Estrutura do Projeto

```
app/
├── config/
│   ├── logging_config.py
│   └── settings.py
├── models/
│   ├── course_model.py
│   └── user_model.py
├── repositories/
│   ├── course_repository.py
│   └── user_repository.py
├── routes/
│   ├── auth.py
│   └── courses.py
├── schemas/
│   ├── course_schema.py
│   └── user_schema.py
├── services/
│   ├── course_service.py
│   └── user_service.py
├── static/
│   ├── css/
│   └── js/
├── templates/
├── utils/
├── database.py
└── main.py
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/fastapi-course-management-api.git
cd fastapi-course-management-api
```

2. Crie um ambiente virtual e ative-o:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

5. Configure as variáveis de ambiente no arquivo `.env`

## Executando a Aplicação

1. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

2. Acesse a documentação da API:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Autenticação
- POST `/api/auth/login` - Login de usuário
- POST `/api/auth/register` - Registro de novo usuário

### Cursos
- GET `/api/cursos/` - Lista todos os cursos
- POST `/api/cursos/` - Cria um novo curso
- GET `/api/cursos/{curso_id}` - Obtém um curso específico
- PUT `/api/cursos/{curso_id}` - Atualiza um curso
- DELETE `/api/cursos/{curso_id}` - Remove um curso

## Testes

Execute os testes com:
```bash
pytest
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/fastapi-course-management-api](https://github.com/seu-usuario/fastapi-course-management-api)
