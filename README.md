# Finance Tracker App

A secure, user-scoped finance tracking app with a FastAPI backend and a Vite + React frontend.

## 🚀 Project Overview

This repository includes:
- `app/` — FastAPI backend API with JWT authentication and SQLite persistence
- `frontend/` — Vite-powered React user interface
- `create_tables.py` — database initialization helper
- `requirements.txt` — Python dependencies
- `frontend/package.json` — frontend dependencies

## 🧱 Features

- User registration and login
- JWT-based authentication
- User-specific categories (`income` / `expense`)
- CRUD operations for categories
- User-owned transactions with optional categories
- Filtering and pagination for transactions
- Aggregated financial summary (income, expenses, balance)
- CORS enabled for local frontend integration

## 💻 Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic v2
- Auth: OAuth2 password flow, JWT, bcrypt
- Database: SQLite
- Frontend: React, Vite, Axios

## 📁 Project Structure

```
app/
├── main.py
├── db.py
├── models.py
├── schemas.py
├── routes/
└── dependencies/
frontend/
├── package.json
└── src/
```

## 🏁 Getting Started

### Backend

```bash
cd finance-tracker
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Local Development URLs

- Backend API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Frontend UI: `http://localhost:5173`

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` — Register new user
- `POST /auth/login` — Authenticate and get JWT
- `GET /auth/me` — Get current authenticated user

### Categories
- `POST /categories/` — Create category
- `GET /categories/` — List user categories
- `DELETE /categories/{id}` — Delete category

### Transactions
- `POST /transaction/` — Create transaction
- `GET /transaction/` — List transactions
- `PUT /transaction/{id}` — Update transaction
- `DELETE /transaction/{id}` — Delete transaction
- `GET /transaction/summary` — Financial summary

> Protected endpoints require `Authorization: Bearer <access_token>`

## 🔧 Notes

- CORS is configured for `http://localhost:5173`
- SQLite is used for development and can be replaced with PostgreSQL for production
- The backend creates tables automatically at startup via `Base.metadata.create_all`

## 📌 Recommended Improvements

- Add user registration and login UI in frontend
- Add transaction and category management pages
- Add monthly / yearly analytics dashboards
- Add deployment configuration for Docker or cloud hosting
