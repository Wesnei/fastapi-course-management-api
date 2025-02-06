
# 👨🏻‍💻 FastAPI Project: Course Management API with JWT Authentication

## 📄 Project Description
This API, developed using **FastAPI**, offers a robust and efficient platform to manage a **catalog of courses**, along with support for user authentication using **JWT** (JSON Web Token).

The API allows the following operations:

- **User registration and authentication** (login with JWT).
- Add, list, update, and delete **courses**.
- Manage data for **students** and **teachers**, including adding, listing, updating, and removing them.

## 🚀 Technologies Used
- **Python 3.10+** - The programming language used for the project.
- **FastAPI** - A framework for creating fast and efficient APIs.
- **Uvicorn** - ASGI server to run the FastAPI application.
- **PostgreSQL** - Relational database used to store the data.
- **Postman** - Tool for testing the API routes during development.
- **Docker** - Used to containerize the application and database.
- **Jinja2** - Used to create templates in the API interface.
- **JWT (JSON Web Tokens)** - For user authentication.

## 📦 How to Run

### Prerequisites
Before running the API, make sure you have the following prerequisites installed on your machine:

- **Docker** (to run the application and database containers)
- **Docker Compose** (to orchestrate the containers)

If you prefer to run locally, you can follow the instructions to set up the Python environment manually.

### 1. Create and Activate a Virtual Environment (venv)
If you are running the application **without Docker**, create a virtual environment:

```bash
python -m venv venv
```

- **On Windows**:
```bash
.\venv\Scripts\activate
```

- **On macOS/Linux**:
```bash
source venv/bin/activate
```

### 2. Install Dependencies
With the virtual environment activated, install the required dependencies for the project:

```bash
pip install -r requirements.txt
```

### 3. Configure the PostgreSQL Database
If you're not using Docker for the database, ensure you have **PostgreSQL** installed and running. Create a database and user with the necessary permissions.

---

### 🐳 **Running the Project with Docker**

If you'd like to run the application with **Docker**, follow the steps below.

### Step 1: Create Docker Files

#### **Dockerfile**

```Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **docker-compose.yml**

```yaml
version: "3.9"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: fastapi-app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/fastAPI
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:17
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fastAPI
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 2: Run the Project

1. **Build and Run the Containers**: Use the command below to build the images and run the containers.

```bash
docker-compose up --build
```

2. **Access the API**: Once the containers are running, the application will be available at [http://localhost:8000](http://localhost:8000).

---

## 🔐 **JWT Authentication**

### User Registration Route
Allows new users to register in the system with a username and password. After registration, the user can log in to obtain a JWT token.

- **POST /register** – Register a new user.
  - Request body:
    ```json
    {
      "username": "example",
      "password": "password123"
    }
    ```

### Login Route
The login allows the user to obtain a **JWT** for authentication on other API routes.

- **POST /login** – Log in to get a JWT token.
  - Request body:
    ```json
    {
      "username": "example",
      "password": "password123"
    }
    ```

### JWT Protected Routes
The route to manage courses, students, and teachers will be protected with JWT authentication. The token must be sent in the `Authorization` header of the request.

- **GET /cursos** – List all registered courses (protected route).
- **POST /cursos** – Add a new course (protected route).

Example of request header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## 🚀 How to Test Routes with Postman

Use **Postman** or any other API tool to test the routes of the application. Here are the main routes available in the API:

### **Authentication Routes**
- **POST /register** – Register a new user.
- **POST /login** – Obtain a JWT token.

### **Course Routes (Protected by JWT)**
- **GET /cursos** – List all registered courses.
- **POST /cursos** – Add a new course.
- **PUT /cursos/{id}** – Update an existing course.
- **DELETE /cursos/{id}** – Delete a specific course.

---

## 📄 Contributing
Feel free to contribute with improvements or fixes. To do so, follow the steps below:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature-name).
3. Make your changes and commit them (git commit -m 'Adding new feature').
4. Push to the remote repository (git push origin feature/your-feature-name).
5. Open a **Pull Request** for review and possible merge.

---

## 📞 Contact
For questions, suggestions, or contributions, contact me via email: **wesneipaiva@gmail.com**
