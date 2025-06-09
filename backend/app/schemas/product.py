from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str
    grocery_store: str


class ProductCreate(ProductBase):
    item_id: UUID
    price: Decimal = Field(gt=0)
    price_discounted: Decimal | None = Field(gt=0)
    weight: str
    image_url: str


class ProductOutput(ProductCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
