# Finance-Tracker (Work in Progress)

This repository contains the backend for an authentication system built with **FastAPI**.  
The project is currently under development and not yet feature-complete. It serves as the foundation for user registration, login, and future secure API operations.

---

# 🚧 Project Status: In Progress

### ✅ Completed So Far
- Project structure created  
- Virtual environment + Git repo initialized  
- FastAPI application running with Uvicorn  
- SQLite development database added  
- Database models for `User`  
- Password hashing using Passlib (bcrypt)  
- `/auth/register` endpoint implemented  
- Duplicate username/email validation working  
- `/auth/login` endpoint implemented (testing in progress)  
- Interactive Swagger API documentation available at `/docs`

---

## 🔜 Upcoming Features
The following features will be added as the project continues:

### Authentication Improvements
- JWT access tokens  
- Refresh tokens  
- Token expiration logic  
- Route protection using authentication dependencies  

### User System Expansions
- `/me` profile endpoint  
- Role-based permissions (optional)  
- Email verification (optional)  
- Password reset (optional)

### Infrastructure & Project Setup
- Environment variables using `.env`  
- Database migration system (Alembic)  
- Docker containerization  
- Custom error handling  
- Logging system

### Production Prep
- Security hardening  
- Rate limiting  
- Deployme
