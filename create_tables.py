from app.db import engine, Base
import app.models #registers model metadata with Base

def create_all():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Done. Tables created (if they didn't exist).")

if __name__ == "__main__":
    create_all()