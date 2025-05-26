from typing import Any

from app.database.db import engine
from app.schemas.item import ItemCreate, ItemOutput
from app.service.item_service import ItemService
from fastapi import APIRouter

router = APIRouter()


@router.post("/items", response_model=ItemOutput)
async def create_item(new_item: ItemCreate) -> Any:
    with engine.connect() as conn:
        item = ItemService.create_item(conn, new_item)

        if not item:
            return {"error": "Failed to create item"}

        return item
