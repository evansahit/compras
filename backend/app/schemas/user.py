from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str | None
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserOutput(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class UserInDB(UserOutput):
    hashed_password: str
