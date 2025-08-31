from app.config import Settings
from sqlalchemy.ext.asyncio import create_async_engine


async def get_db_connection():
    engine = create_async_engine(Settings.DB_URL, echo=False)

    async with engine.connect() as conn:
        async with conn.begin():
            yield conn
