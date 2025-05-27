from app.config import Settings
from sqlalchemy import create_engine

db = create_engine(Settings.DB_URL)
