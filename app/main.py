from fastapi import FastAPI
from dotenv import load_dotenv
import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from app import models
from app.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Finance Tracker")
# Allow overriding CORS origins via environment (comma-separated)
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
allow_origins = [o.strip() for o in cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#create models for tables
Base.metadata.create_all(bind=engine)

# If a frontend build exists, serve it as static files (convenience for demo/CV deployments)
FRONTEND_BUILD_DIR = os.getenv("FRONTEND_BUILD_DIR", str(Path(__file__).resolve().parent.parent / "frontend" / "dist"))
if Path(FRONTEND_BUILD_DIR).exists():
    app.mount("/", StaticFiles(directory=FRONTEND_BUILD_DIR, html=True), name="frontend")

#import and include routers
from app.routes import auth as auth_router 
app.include_router(auth_router.router)

from app.routes import categories as categories_router
app.include_router(categories_router.router)

from app.routes import transactions as transactions_router
app.include_router(transactions_router.router)

@app.get("/")
def root():
    return {"message": "Hello Finance Tracker GG!"}

