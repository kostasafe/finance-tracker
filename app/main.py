from fastapi import FastAPI
from dotenv import load_dotenv
import os
from app import models
from app.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Finance Tracker")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#create models for tables
Base.metadata.create_all(bind=engine)

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

