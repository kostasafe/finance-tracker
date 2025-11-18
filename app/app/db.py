from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv() #load .env file 

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

#create sqlAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

#session factory for DB sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class for models
Base = declarative_base()