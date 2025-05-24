import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    DB_URL: str = f"postgresql+psycopg://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
