from datetime import datetime
from uuid import UUID

from app.schemas.product import ProductOutput
from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str = Field(min_length=2)
    is_completed: bool = False
    is_archived: bool = False


class ItemCreate(BaseModel):
    user_id: UUID
    name: str = Field(min_length=2)


class ItemUpdate(ItemBase):
    id: UUID


class ItemOutput(ItemBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


class ItemWithProducts(BaseModel):
    item: ItemOutput
    products: list[ProductOutput]
