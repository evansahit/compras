from typing import Annotated
from uuid import UUID

from app.schemas.item import ItemWithProducts
from app.schemas.user import (
    UserCreate,
    UserInDB,
    UserOutput,
    UserUpdate,
    UserWithItemsAndProducts,
)
from app.service.item_service import ItemService
from app.service.utils import get_password_hash
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


class UserService:
    @staticmethod
    async def create_user(
        conn: AsyncConnection,
        new_user: UserCreate,
    ) -> UserOutput:
        # check if email is taken
        sql_user_check = text("""
            SELECT email
            FROM users
            WHERE email = :email;
        """)
        user_check_result = await conn.execute(
            sql_user_check, {"email": new_user.email}
        )
        user = user_check_result.mappings().first()

        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email address already exists.",
            )

        # create user if email is not taken
        sql_create_user = text("""
            INSERT INTO users (first_name, last_name, email, hashed_password)
            VALUES (:first_name, :last_name, :email, :hashed_password)
            RETURNING id, first_name, last_name, email, created_at, updated_at;
        """)
        new_user_dict = new_user.model_dump()
        new_user_dict["hashed_password"] = get_password_hash(
            new_user_dict["plain_password"]
        )
        del new_user_dict["plain_password"]

        result = await conn.execute(
            sql_create_user,
            new_user_dict,
        )

        row = result.mappings().first()
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user {new_user.email}",
            )

        return UserOutput(**row)

    @staticmethod
    async def get_user_by_id(conn: AsyncConnection, user_id: UUID) -> UserOutput:
        sql = text("""
            SELECT id, first_name, last_name, email, created_at, updated_at
            FROM users
            WHERE id = :user_id;
        """)
        result = await conn.execute(sql, {"user_id": user_id})
        row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not find user with ID of {user_id}",
            )

        return UserOutput(**row)

    @staticmethod
    async def _get_user_by_email(conn: AsyncConnection, email: str) -> UserInDB | None:
        sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
            FROM users
            WHERE email = :email;
        """)
        result = await conn.execute(sql, {"email": email})
        row = result.mappings().first()

        return UserInDB(**row) if row else None

    @staticmethod
    async def get_user_by_email(conn: AsyncConnection, email: str) -> UserOutput:
        sql = text("""
            SELECT id, first_name, last_name, email, created_at, updated_at
            FROM users
            WHERE email = :email;
        """)
        result = await conn.execute(sql, {"email": email})
        row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not find user with email of {email}",
            )

        return UserOutput(**row)

    @staticmethod
    async def get_current_user_with_items_and_products(
        conn: AsyncConnection,
        user: UserOutput,
    ) -> UserWithItemsAndProducts:
        items_with_products: list[
            ItemWithProducts
        ] = await ItemService.get_all_items_with_products_by_user_id(conn, user.id)

        return UserWithItemsAndProducts.model_validate(
            {**user.model_dump(), "items_with_products": items_with_products}
        )

    @staticmethod
    async def update_user(conn: AsyncConnection, user: UserUpdate) -> UserOutput:
        sql = text("""
            UPDATE users
            SET first_name = :first_name,
                last_name = :last_name,
                email = :email
            WHERE id = :user_id
            RETURNING *;
        """)

        result = await conn.execute(
            sql,
            {
                "user_id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
        )
        row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Could not find this user"
            )

        return UserOutput(**row)
