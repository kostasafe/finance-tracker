from fastapi import FastAPI
from dotenv import load_dotenv
import os
from app import models
from app.db import engine, Base

load_dotenv()

app = FastAPI(title="Finance Tracker")

#import and include routers
from app.routes import auth as auth_router #relative import of the file you created
app.include_router(auth_router.router)

@app.get("/")
def root():
    return {"message": "Hello Finance Tracker GG!"}

#create models for tables
Base.metadata.create_all(bind=engine)