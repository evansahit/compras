from datetime import datetime
from uuid import UUID

from app.schemas.item import ItemWithProducts
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str | None
    email: EmailStr


class UserCreate(UserBase):
    plain_password: str


class UserOutput(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class UserInDB(UserOutput):
    hashed_password: str


class UserWithItemsAndProducts(UserOutput):
    items_with_products: list[ItemWithProducts]
