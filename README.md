# 💰 Finance Tracker – Backend API

A **secure, user-scoped finance tracking backend API** built with **FastAPI**.  
This project demonstrates real-world backend development practices including authentication, authorization, relational data modeling, filtering, pagination, and financial aggregation.

> **Status:** Backend feature-complete and ready for extension

---

## 🧱 Tech Stack

- FastAPI
- SQLAlchemy (ORM)
- SQLite (development database)
- Pydantic v2
- JWT (JSON Web Tokens)
- Passlib (bcrypt) for password hashing
- Uvicorn ASGI server

---

## 🏗️ Project Structure

```
app/
├── main.py            # FastAPI application entry point
├── db.py              # Database engine, session, and Base
├── models.py          # SQLAlchemy models
├── schemas.py         # Pydantic schemas
├── routes/            # API route modules
└── dependencies/      # Authentication & shared dependencies
```

---

## ✅ Implemented Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure password hashing with bcrypt
- JWT access token generation and expiration
- OAuth2 password flow
- Dependency-based authentication
- Strict user data isolation enforced at query level

---

### 🗂️ Categories
- User-owned categories
- Supports `income` and `expense` types
- CRUD operations:
  - Create category
  - List user categories
  - Delete category
- Ownership validation (users can only access their own categories)

---

### 💸 Transactions
- User-owned transactions with optional category
- Stores:
  - Amount
  - Date
  - Description
  - Category (optional)
- CRUD operations:
  - Create transaction
  - List transactions
  - Update transaction (partial updates supported)
  - Delete transaction
- Ownership validation on all operations
- Category ownership validation when assigning categories
- Filtering support:
  - Date range
  - Category
  - Category type (`income` / `expense`)
- Pagination support (`page`, `page_size`)

---

### 📊 Financial Summary
- Aggregated transaction summary endpoint
- Calculates:
  - Total income
  - Total expenses
  - Balance
- Implemented using SQL aggregation (`SUM`, `JOIN`, `COALESCE`)
- Fully user-scoped and filterable by date range

---

## 🌐 API Endpoints

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
- `GET /transaction/` – List transactions (filters + pagination)
- `PUT /transaction/{id}` – Update transaction
- `DELETE /transaction/{id}` – Delete transaction
- `GET /transaction/summary` – Financial summary

> 🔒 All protected routes require:  
> `Authorization: Bearer <access_token>`

---

## 📘 API Documentation

- Swagger UI available at: `http://127.0.0.1:8000/docs`
- OAuth2 “Authorize” button enabled
- JWT tokens automatically applied to protected routes

---

## 🚀 Getting Started (Development)

```bash
# activate virtual environment
source venv/bin/activate    # Linux / macOS
venv\Scripts\activate       # Windows

# install dependencies
pip install -r requirements.txt

# run development server
uvicorn app.main:app --reload
```

---

## 📌 Project Highlights

- Clean, modular architecture
- Strong separation of concerns
- Ownership-safe database queries
- Defensive validation and error handling
- Designed for easy extension:
  - Frontend integration
  - PostgreSQL migration
  - Deployment with Docker or cloud services

---

## 🔜 Possible Extensions

- Monthly and yearly analytics
- CSV export
- Account balances
- PostgreSQL support
- Deployment configuration

---

## 🧑‍💻 Purpose

This project was built to demonstrate **production-ready backend fundamentals**:
authentication, authorization, data isolation, relational modeling, pagination, filtering, and aggregation using FastAPI and SQLAlchemy.
