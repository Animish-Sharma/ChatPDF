import os
from database import create_tables

async def startup_event():
    os.makedirs("uploads", exist_ok=True)
    create_tables()
    print("PDF Q&A backend started. Uploads directory is ready.")
