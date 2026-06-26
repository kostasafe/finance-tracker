# 💰 Finance Tracker

A full-stack personal finance tracker built with **FastAPI** and **React (Vite)** that helps users manage income, expenses, and categories with secure JWT authentication.

---

# ✨ Features

## 🔐 Authentication
- User registration
- Secure login with JWT authentication
- Retrieve the current authenticated user (`/auth/me`)
- Protected frontend routes

## 💳 Transactions
- Create, update, and delete transactions
- Optional category assignment
- Filter transactions by:
  - Date range
  - Category
  - Transaction type (Income / Expense)
- Pagination support
- View recent transactions
- Income/expense summaries
- Monthly aggregated statistics

## 📂 Categories
- Create categories
- List categories
- Delete categories

## 🌐 Frontend
- Built with React + Vite
- Axios API client
- Automatic JWT token handling
- Protected routes
- Token persistence using `localStorage` (development)

---

# 🛠 Tech Stack

| Backend | Frontend | Database | Tools |
|---------|----------|----------|------|
| FastAPI | React | SQLite | Docker |
| SQLAlchemy | Vite | | Axios |
| JWT Authentication | | | Uvicorn |

---

# 📋 Requirements

- Python **3.10+**
- Node.js **18+**
- npm **10+** (or Yarn)

---

# 🚀 Quick Start

## 1. Clone the repository

```bash
git clone <repository-url>
cd finance-tracker
```

---

## 2. Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

If you want to create the database manually:

```bash
python create_tables.py
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open your browser at:

```
http://localhost:5173
```

---

# 🐳 Docker

Build and run the backend:

```bash
docker compose build
docker compose up
```

The API will be available at:

```
http://localhost:8000
```

### Serve the Frontend with FastAPI

Build the frontend:

```bash
cd frontend
npm run build
```

Then set:

```env
FRONTEND_BUILD_DIR=frontend/dist
```

either in your `.env` file or in `docker-compose.yml` before starting the container.

---

# ⚙️ Configuration

Create a `.env` file in the project root.

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///dev.db` | Database connection string |
| `SECRET_KEY` | `super-secret-dev-key` | JWT signing key |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | JWT expiration time (minutes) |

---

# 📖 API Overview

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT token |
| `GET` | `/auth/me` | Retrieve the current authenticated user |

---

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories/` | List categories |
| `POST` | `/categories/` | Create a category |
| `DELETE` | `/categories/{id}` | Delete a category |

---

## Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/transaction/` | List transactions |
| `POST` | `/transaction/` | Create a transaction |
| `PUT` | `/transaction/{id}` | Update a transaction |
| `DELETE` | `/transaction/{id}` | Delete a transaction |
| `GET` | `/transaction/summary` | Income/expense summary |
| `GET` | `/transaction/summary/monthly` | Monthly summary |

### Supported Query Parameters

| Parameter | Description |
|-----------|-------------|
| `start_date` | Filter from date |
| `end_date` | Filter until date |
| `category_id` | Filter by category |
| `type` | Income or Expense |
| `page` | Page number |
| `page_size` | Items per page |

> **Note:** Protected endpoints require the following header:
>
> ```http
> Authorization: Bearer <access_token>
> ```

---

# 🌍 Local URLs

| Service | URL |
|----------|-----|
| Backend API | `http://127.0.0.1:8000` |
| Swagger Docs | `http://127.0.0.1:8000/docs` |
| Frontend | `http://localhost:5173` |

---

# 📁 Project Structure

```text
finance-tracker/
│
├── app/
│   ├── dependencies/
│   ├── routes/
│   ├── db.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── requirements.txt
├── docker-compose.yml
├── create_tables.py
└── README.md
```

---

# 📝 Notes

- ✅ Database tables are created automatically on startup.
- ✅ JWT tokens are stored in `localStorage` during development.
- 🔒 For production, use secure HTTP-only cookies and refresh token rotation.

---

# 🚀 Future Improvements

- Dashboard with charts
- Budget planning
- Recurring transactions
- Export to CSV/PDF
- Multi-currency support
- Dark mode
- Unit and integration tests

---
