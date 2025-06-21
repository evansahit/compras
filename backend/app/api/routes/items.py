from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.db import get_db_connection
from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate, ItemWithProducts
from app.schemas.product import ProductOutput
from app.schemas.user import UserOutput
from app.service.auth_service import AuthService
from app.service.item_service import ItemService

router = APIRouter(prefix="/items")


@router.post("", response_model=ItemWithProducts, status_code=status.HTTP_201_CREATED)
async def create_item(
    new_item: ItemCreate,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> Any:
    return await ItemService.create_item(conn, new_item)


@router.get(
    "/{item_id}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def get_item_by_id(
    item_id: UUID,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> Any:
    return await ItemService.get_item_by_id(conn, item_id)


@router.put(
    "/{item_id}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def update_item_by_id(
    item_id: UUID,
    updated_item: ItemUpdate,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> Any:
    return await ItemService.update_item_by_id(conn, item_id, updated_item)


@router.delete(
    "/{item_id}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def delete_item_by_id(
    item_id: UUID,
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> Any:
    return await ItemService.delete_item_by_id(conn, item_id)


@router.get(
    "/{item_id}/products",
    response_model=list[ProductOutput],
    status_code=status.HTTP_200_OK,
)
async def get_products_for_item_by_item_id(
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
    item_id: UUID,
    _: Annotated[UserOutput, Depends(AuthService.get_current_user)],
):
    return await ItemService.get_products_for_item_by_item_id(conn, item_id)
