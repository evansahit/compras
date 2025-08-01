from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.db import get_db_connection
from app.schemas.item import ItemWithProducts
from app.schemas.user import UserCreate, UserOutput, UserWithItemsAndProducts
from app.service.auth_service import AuthService
from app.service.item_service import ItemService
from app.service.user_service import UserService

router = APIRouter(prefix="/users")


@router.post("", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
async def create_user(
    conn: Annotated[AsyncConnection, Depends(get_db_connection)], new_user: UserCreate
):
    return await UserService.create_user(conn, new_user)


@router.get(
    "/{user_id}/items",
    response_model=list[ItemWithProducts],
    status_code=status.HTTP_200_OK,
)
async def get_all_items_with_products_by_user_id(
    user_id: UUID,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
):
    return await ItemService.get_all_items_with_products_by_user_id(conn, user_id)


@router.get(
    "/current-user-with-items-and-products",
    response_model=UserWithItemsAndProducts,
    status_code=status.HTTP_200_OK,
)
async def get_current_user_with_items_and_products(
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    user: Annotated[UserOutput, Depends(AuthService.get_current_user)],
):
    return await UserService.get_current_user_with_items_and_products(conn, user)
