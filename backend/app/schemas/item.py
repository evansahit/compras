from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ItemBase(BaseModel):
    name: str
    grocery_store: str
    lowest_price: Decimal
    is_complete: bool
    is_archived: bool


class ItemCreate(ItemBase):
    user_id: UUID


class ItemOutput(ItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
