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

## 🔐 Frontend authentication details (JWT)

- The frontend uses JWT access tokens returned by the backend `POST /auth/login` endpoint.
- Tokens are saved to `localStorage` under the key `access_token` for convenience during development.
- To make API requests authenticated after a page reload, the frontend restores the saved token on startup and sets the axios default `Authorization` header.

Files changed in this flow:
- `frontend/src/api.js` — creates a shared axios instance and restores `access_token` from `localStorage` on module load, setting `api.defaults.headers.common['Authorization']` when present.
- `frontend/src/pages/Login.jsx` — saves `access_token` returned by `/auth/login`, sets the default axios header immediately after login, and includes a `Logout` button that clears `localStorage` and the axios header.

Minimal example (already implemented in `frontend/src/api.js`):

```js
import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

// Restore saved JWT from localStorage on app start so axios keeps sending Authorization after reloads
const token = localStorage.getItem("access_token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default api;
```

Login handling (high-level):

- After a successful `POST /auth/login`, read `response.data.access_token`, save it to `localStorage`, and set `api.defaults.headers.common['Authorization'] = `Bearer ${token}`` so subsequent `api` calls include the header without manually adding it.

Logout handling:

- Remove the token and clear the header:

```js
localStorage.removeItem("access_token");
delete api.defaults.headers.common["Authorization"];
```

Verification steps in the browser:

- DevTools → Application → Local Storage: confirm `access_token` exists.
- DevTools → Network → select an authenticated request (e.g. `GET /auth/me`) → Request Headers → confirm `Authorization: Bearer <token>` is present.

Security note:

- Storing tokens in `localStorage` is simple and fine for local development, but it exposes the token to JavaScript and increases risk from XSS attacks. For production, prefer using secure, HttpOnly cookies with proper CSRF protection and refresh-token rotation.


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
