from fastapi import FastAPI

from app.api.main import router
from app.config import Settings

app = FastAPI(
    title=Settings.PROJECT_TITLE,
    description=Settings.PROJECT_DESCRIPTION,
    version=Settings.PROJECT_VERSION,
    contact=Settings.CONTACT,
    license_info=Settings.LICENSE_INFO,
)

app.include_router(router, prefix=Settings.API_V1_STR)
