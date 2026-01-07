from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv() #load .env file 

# Resolve project root (finance-tracker/)
BASE_DIR = Path(__file__).resolve().parent.parent

# Use DB from .env if provided, otherwise fallback to dev.db in project root
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'dev.db'}")

#create sqlAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

#session factory for DB sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class for models
Base = declarative_base()

