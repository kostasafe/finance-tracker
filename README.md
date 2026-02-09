 # 🚧 Project Status: In Progress 🚧
 
# Finance Tracker – Backend API

This repository contains the backend for a **Finance Tracker application** built with **FastAPI**.  
The project is under active development and currently implements a **secure, user-isolated finance system** with authentication, categories, and transactions.

---

## 🧱 Tech Stack
- FastAPI
- SQLAlchemy (ORM)
- SQLite (development)
- Pydantic v2
- Passlib (bcrypt) for password hashing
- JWT (JSON Web Tokens)
- Uvicorn ASGI server

---


## 🏗️ Project Structure
- `app/`
  - `main.py` – FastAPI app entry point
  - `db.py` – Database engine, session, and Base
  - `models.py` – SQLAlchemy models
  - `schemas.py` – Pydantic schemas
  - `routes/` – API route modules
  - `dependencies/` – Authentication dependencies

---

## ✅ Completed Features

### Project & Infrastructure
- Clean package-based project structure
- Virtual environment setup
- Git repository initialized
- Environment variables support via `.env`
- SQLite development database (`dev.db`)
- SQLAlchemy engine, session, and Base configuration
- Automatic table creation on application startup

---

### 🔐 Authentication System
- User model implemented
- Secure password hashing with bcrypt
- JWT access token creation
- Token expiration handling
- OAuth2 Password flow integration
- Dependency-based authentication system
- User-specific data isolation enforced at query level

---

### 🗂️ Categories
- Category model linked to user
- Supports `income` and `expense` types
- Full CRUD operations:
  - Create category
  - List user categories
  - Delete category
- Ownership validation (users can only access their own categories)

---

### 💸 Transactions
- Transaction model linked to user and category
- Stores:
  - Amount (Decimal)
  - Date
  - Description
  - Optional category
- Full CRUD operations:
  - Create transaction
  - List user transactions
  - Update transaction
  - Delete transaction
- Secure ownership checks on all operations
- Category ownership validation when assigning categories
- Filtering support:
  - By date range
  - By category
  - By category type (income / expense)

---

## 🌐 API Endpoints (Implemented)

### 🔐 Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT access token
- `GET /auth/me` – Get current authenticated user

---

### 🗂️ Categories
- `POST /categories/` – Create category
- `GET /categories/` – List user categories
- `DELETE /categories/{id}` – Delete category

---


### 💸 Transactions
- `POST /transaction/` – Create transaction
- `GET /transaction/` – List transactions (with filters)
- `PUT /transaction/{id}` – Update transaction
- `DELETE /transaction/{id}` – Delete transaction

All protected routes require: Authorization: Bearer <access_token>

---

## 📘 API Documentation
- Interactive Swagger UI available at: http://127.0.0.1:8000/docs
- OAuth2 “Authorize” button fully functional
- JWT tokens correctly applied to protected routes

---

## 📊 Current Progress
- Authentication system complete
- Category system complete
- Transaction system complete (CRUD + filtering)
- Secure multi-user data isolation fully enforced

This backend is now a **solid, production-ready foundation** for finance features.

---

## 🔜 Planned Features

### Finance Features
- Monthly summaries
- Income vs expense analytics
- Account balances
- Pagination & advanced reporting

---


- Deployment configuration

---

## 🚀 Getting Started (Development)

```bash
# activate virtual environment
source venv/bin/activate  # Linux / macOS
venv\Scripts\activate     # Windows

# install dependencies
pip install -r requirements.txt

# run development server
uvicorn app.main:app --reload
