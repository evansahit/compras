from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
