from typing import Any

from app.database.db import engine
from app.models.user import UserCreate, UserOutput
from app.service.user_service import UserService
from fastapi import APIRouter

router = APIRouter()


@router.post("/users", response_model=UserOutput)
async def create_user(new_user: UserCreate) -> Any:
    with engine.connect() as conn:
        user = UserService.create_user(conn, new_user)

        if not user:
            return {"error": "Failed to create user"}

        return user
