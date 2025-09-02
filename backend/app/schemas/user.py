from datetime import datetime
from uuid import UUID

from app.schemas.item import ItemWithProducts
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    first_name: str
    last_name: str | None
    # min length decided by a minimal possible email (a@a.a)
    email: EmailStr = Field(min_length=5, description="Email cannot be empty")


class UserCreate(UserBase):
    plain_password: str


class UserOutput(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    first_name: str
    last_name: str | None
    email: EmailStr


class UserUpdatePassword(BaseModel):
    old_plain_password: str
    new_plain_password: str


class UserInDB(UserOutput):
    hashed_password: str


class UserWithItemsAndProducts(UserOutput):
    items_with_products: list[ItemWithProducts]


class UserWithJWT(UserOutput):
    jwt: str
