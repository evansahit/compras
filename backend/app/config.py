import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    DB_URL: str = f"postgresql+psycopg://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"

    API_V1_STR = "/api/v1"

    PROJECT_TITLE = "Compras+"
    PROJECT_DESCRIPTION = (
        "A shopping list that gives you up-to-date pricing information"
    )
    PROJECT_VERSION = "0.0.1"
    CONTACT = {"name": "Evan Sahit", "email": "evansahit@hotmail.com"}
    LICENSE_INFO = {"name": "MIT"}

    SECRET = os.getenv("SECRET")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
