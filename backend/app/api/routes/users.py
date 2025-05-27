from typing import Any

from fastapi import APIRouter

from app.database.db import db
from app.schemas.user import UserCreate, UserOutput
from app.service.user_service import UserService

router = APIRouter()

USERS_ENDPOINT_NAME = "/users"


@router.post(USERS_ENDPOINT_NAME, response_model=UserOutput)
async def create_user(new_user: UserCreate) -> Any:
    with db.connect() as conn:
        return UserService.create_user(conn, new_user)
