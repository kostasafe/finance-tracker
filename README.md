# Finance Tracker App

A secure personal finance tracker with a FastAPI backend and a Vite + React frontend.

## Overview

- Backend: FastAPI REST API with JWT authentication and SQLite persistence
- Frontend: React + Vite user interface
- Database: SQLite by default, configurable via `.env`

## Features

- User registration and login
- JWT-secured routes for authenticated users
- CRUD categories for income and expenses
- User-owned transactions with optional categories
- Transaction listing and summary endpoints
- Local CORS support for frontend development
- Automatic DB table creation at startup

## Requirements

- Python 3.10+ or 3.11+
- Node.js 18+
- npm 10+ or yarn

## Backend setup

```bash
cd finance-tracker
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Optionally initialize the database explicitly:

```bash
python create_tables.py
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## Environment configuration

The backend loads environment variables from a `.env` file when present.

Supported variables:

- `DATABASE_URL` — database URL (default: `sqlite:///dev.db`)
- `SECRET_KEY` — JWT signing key (default: `super-secret-dev-key`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token expiration in minutes (default: `60`)

## Local URLs

- Backend API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Frontend UI: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/register` — register a new user
- `POST /auth/login` — authenticate and receive a JWT
- `GET /auth/me` — get the authenticated user's profile

### Categories
- `POST /categories/` — create a category
- `GET /categories/` — list the current user's categories
- `DELETE /categories/{id}` — delete a category

### Transactions
- `POST /transaction/` — create a transaction
- `GET /transaction/` — list transactions
- `PUT /transaction/{id}` — update a transaction
- `DELETE /transaction/{id}` — delete a transaction
- `GET /transaction/summary` — get income/expense summary

> Protected endpoints require `Authorization: Bearer <access_token>`

## Project structure

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

## Notes

- The backend automatically creates tables using SQLAlchemy `Base.metadata.create_all`
- Frontend auth is handled by JWT tokens stored in `localStorage` for development
- For production, consider secure HttpOnly cookies and refresh token rotation
