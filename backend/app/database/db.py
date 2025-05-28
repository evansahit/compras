from app.config import Settings
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(Settings.DB_URL, echo=False)


async def get_db_connection():
    async with engine.connect() as conn:
        yield conn
