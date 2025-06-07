from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ItemBase(BaseModel):
    name: str
    is_completed: bool = False
    is_archived: bool = False


class ItemCreate(BaseModel):
    user_id: UUID
    name: str


class ItemUpdate(ItemBase):
    pass


class ItemOutput(ItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
