# 🚧 Project Status: In Progress 🚧

# Finance Tracker – Backend API

This repository contains the backend for a **Finance Tracker application** built with **FastAPI**.  
The project is under active development and currently focuses on a **secure authentication system** using JWT, with a solid foundation for future finance-related features.

---

## 🧱 Tech Stack
- FastAPI
- SQLAlchemy (ORM)
- SQLite (development)
- Passlib (bcrypt) for password hashing
- JWT (JSON Web Tokens)
- Uvicorn ASGI server

---

## ✅ Completed Features

### Project & Infrastructure
- Clean project structure (`app/` package-based layout)
- Virtual environment setup
- Git repository initialized
- Environment variable support via `.env`
- SQLite development database (`dev.db`)
- SQLAlchemy engine, session, and Base configuration
- Automatic table creation on application startup

---

### Authentication System
- User model implemented
- Secure password hashing with bcrypt
- JWT access token creation
- Token expiration handling
- OAuth2 Password flow integration
- Dependency-based authentication system

---

### API Endpoints (Working & Tested)

#### 🔐 Authentication Routes
- `POST /auth/register`  
  Register a new user with duplicate username/email validation

- `POST /auth/login`  
  OAuth2-compatible login (`application/x-www-form-urlencoded`)  
  Returns a JWT access token

- `GET /auth/me`  
  Protected route  
  Requires `Authorization: Bearer <token>`  
  Returns the currently authenticated user

---

### Database Models
- **User**
- **Category**
  - Linked to user
  - Supports `income` and `expense` types
- **Transaction**
  - Linked to user and category
  - Stores amount, description, and date

All relationships and cascade rules are fully defined.

---

### API Documentation
- Interactive Swagger UI available at: http://127.0.0.1:8000/docs
- OAuth2 “Authorize” button fully functional
- JWT tokens correctly applied to protected routes

---

## 📊 Current Progress
Core authentication and data modeling are finished.  
The project now has a stable, secure foundation for finance features.

---

## 🔜 Planned Features

### Finance Features
- Category CRUD operations
- Transaction CRUD operations
- User-specific data isolation
- Monthly summaries
- Income vs expense analytics

---

### Authentication Enhancements (Optional)
- Refresh tokens
- Logout / token invalidation
- Role-based permissions
- Password reset flow
- Email verification

---

### Infrastructure & Production Prep
- Alembic database migrations
- Docker support
- Centralized error handling
- Logging system
- Rate limiting
- Security hardening
- Deployment configuration

---

## 🚀 Getting Started (Development)

```
# activate virtual environment
source venv/bin/activate  # Linux / macOS
venv\Scripts\activate     # Windows

# install dependencies
pip install -r requirements.txt

# run development server
uvicorn app.main:app --reload
```

