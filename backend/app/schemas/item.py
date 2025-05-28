from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str
    grocery_store: str
    lowest_price: Decimal = Field(gt=0)
    is_completed: bool = False
    is_archived: bool = False


class ItemCreate(ItemBase):
    user_id: UUID


class ItemUpdate(ItemBase):
    pass


class ItemOutput(ItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
