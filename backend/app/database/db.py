from app.config import Settings
from sqlalchemy import create_engine

engine = create_engine(Settings.DB_URL)
