from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str
    price: Decimal = Field(gt=0)
    grocery_store: str


class ProductCreate(ProductBase):
    item_id: UUID


class ProductOutput(ProductCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
