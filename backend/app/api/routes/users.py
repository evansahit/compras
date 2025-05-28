from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.db import get_db_connection
from app.schemas.item import ItemOutput
from app.schemas.user import UserCreate, UserOutput
from app.service.auth_service import AuthService
from app.service.item_service import ItemService
from app.service.user_service import UserService

router = APIRouter(prefix="/users")


@router.post("", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
async def create_user(
    conn: Annotated[AsyncConnection, Depends(get_db_connection)], new_user: UserCreate
) -> Any:
    return await UserService.create_user(conn, new_user)


@router.get(
    "/{user_id}/items", response_model=list[ItemOutput], status_code=status.HTTP_200_OK
)
async def get_all_items_by_user_id(
    user_id: UUID,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> Any:
    return await ItemService.get_all_items_by_user_id(conn, user_id)
