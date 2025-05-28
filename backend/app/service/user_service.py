from uuid import UUID

from app.schemas.user import UserCreate, UserInDB, UserOutput
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
        sql = text("""
            INSERT INTO users (first_name, last_name, email, hashed_password)
            VALUES (:first_name, :last_name, :email, :hashed_password)
            RETURNING id, first_name, last_name, email, created_at, updated_at;
        """)

        async with conn.begin():
            new_user_dict = new_user.model_dump()
            new_user_dict["hashed_password"] = get_password_hash(
                new_user_dict["plain_password"]
            )
            del new_user_dict["plain_password"]

            result = await conn.execute(
                sql,
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
    async def get_user_by_id(conn: AsyncConnection, user_id: UUID):
        sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
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
    async def get_user_by_email(conn: AsyncConnection, email: str) -> UserInDB:
        sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
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

        return UserInDB(**row)
