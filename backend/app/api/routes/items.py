from typing import Any
from uuid import UUID

from fastapi import APIRouter, status

from app.database.db import db
from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate
from app.service.item_service import ItemService

router = APIRouter()

ITEMS_ENDPOINT_NAME = "/items"


@router.post(
    ITEMS_ENDPOINT_NAME, response_model=ItemOutput, status_code=status.HTTP_201_CREATED
)
async def create_item(new_item: ItemCreate) -> Any:
    with db.connect() as conn:
        return ItemService.create_item(conn, new_item)


@router.get(
    f"{ITEMS_ENDPOINT_NAME}/{{item_id}}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def get_item_by_id(item_id: UUID) -> Any:
    with db.connect() as conn:
        return ItemService.get_item_by_id(conn, item_id)


@router.get(
    f"{ITEMS_ENDPOINT_NAME}/{{user_id}}",
    response_model=list[ItemOutput],
    status_code=status.HTTP_200_OK,
)
async def get_all_items_by_user_id(user_id: UUID) -> Any:
    with db.connect() as conn:
        return ItemService.get_all_items_by_user_id(conn, user_id)


@router.put(
    f"{ITEMS_ENDPOINT_NAME}/{{item_id}}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def update_item_by_id(item_id: UUID, updated_item: ItemUpdate) -> Any:
    with db.connect() as conn:
        return ItemService.update_item_by_id(conn, item_id, updated_item)


@router.delete(
    f"{ITEMS_ENDPOINT_NAME}/{{item_id}}",
    response_model=ItemOutput,
    status_code=status.HTTP_200_OK,
)
async def delete_item_by_id(item_id: UUID) -> Any:
    with db.connect() as conn:
        return ItemService.delete_item_by_id(conn, item_id)
