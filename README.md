# Finance Tracker

A personal finance tracker with a FastAPI backend and a Vite + React frontend.

## What it does

- Secure user signup and login with JWT authentication
- Manage categories for income and expenses
- Add transactions with optional category assignment
- Display recent transactions and category summaries
- Separate backend API and frontend UI for fast local development

## Tech stack

- Backend: FastAPI, SQLAlchemy, SQLite, JWT auth
- Frontend: React, Vite, Axios
- Dev tools: Uvicorn for backend, Vite for frontend

## Requirements

- Python 3.10+
- Node.js 18+
- npm 10+ (or yarn)

## Quick start

### Backend

```bash
cd finance-tracker
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

If you want to create the database schema manually:

```bash
python create_tables.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the app in your browser at `http://localhost:5173`.

## Configuration

Create a `.env` file in the project root to override defaults.

Supported variables:

- `DATABASE_URL` — database connection string (default: `sqlite:///dev.db`)
- `SECRET_KEY` — JWT signing key (default: `super-secret-dev-key`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token expiration in minutes (default: `60`)

## API overview

### Authentication

- `POST /auth/register` — register a new user
- `POST /auth/login` — login and receive a JWT token
- `GET /auth/me` — get current user details

### Categories

- `GET /categories/` — list categories for the authenticated user
- `POST /categories/` — create a new category
- `DELETE /categories/{id}` — delete a category

### Transactions

- `GET /transaction/` — list transactions
- `POST /transaction/` — create a transaction
- `PUT /transaction/{id}` — update a transaction
- `DELETE /transaction/{id}` — delete a transaction
- `GET /transaction/summary` — get income/expense summary

> Note: protected endpoints require `Authorization: Bearer <access_token>`.

## Local URLs

- Backend API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Frontend: `http://localhost:5173`

## Project layout

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

- Backend tables are created automatically on startup
- Frontend stores JWT tokens in `localStorage` for development
- For production, use secure cookies and refresh token rotation
