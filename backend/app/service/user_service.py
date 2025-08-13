from datetime import timedelta
from uuid import UUID

from app.config import Settings
from app.schemas.item import ItemWithProducts
from app.schemas.user import (
    UserCreate,
    UserInDB,
    UserOutput,
    UserUpdate,
    UserWithItemsAndProducts,
    UserWithJWT,
)
from app.service.auth_service import AuthService
from app.service.item_service import ItemService
from app.service.utils import get_password_hash, verify_password
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
    async def update_user(
        conn: AsyncConnection, user_id: UUID, user: UserUpdate
    ) -> UserOutput | UserWithJWT:
        sql_get_user = text("""
            SELECT *
            FROM users
            WHERE id = :user_id;
        """)
        get_user_res = await conn.execute(sql_get_user, {"user_id": user_id})
        get_user_res = get_user_res.mappings().first()
        if not get_user_res:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Could not find this user"
            )
        get_user_obj = UserOutput(**get_user_res)

        # create new JWT token as the user's email might have changed.
        if get_user_obj.email != user.email:
            access_token_expires = (
                float(Settings.ACCESS_TOKEN_EXPIRE_DAYS)
                if Settings.ACCESS_TOKEN_EXPIRE_DAYS
                else float(3)
            )
            access_token_expires = timedelta(days=access_token_expires)
            jwt = f"Bearer {
                AuthService.create_access_token(
                    data={'sub': user.email}, expires_delta=access_token_expires
                )
            }"

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
                    "user_id": user_id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },
            )
            row = result.mappings().first()

            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find this user",
                )

            return UserWithJWT(**row, jwt=jwt)
        else:
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
                    "user_id": user_id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },
            )
            row = result.mappings().first()

            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find this user",
                )

            return UserOutput(**row)

    @staticmethod
    async def update_password(
        conn: AsyncConnection,
        user_id: UUID,
        old_plain_password: str,
        new_plain_password: str,
    ):
        if not old_plain_password or not new_plain_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Something went wrong changing your password. Make sure to fill in both your old and new passwords.",
            )

        if old_plain_password == new_plain_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Something went wrong changing your password. Your old and new passwords are the same.",
            )

        # check if user exists and if old password matches with the old hashed password
        sql_find_user = text("""
            SELECT *
            FROM users
            WHERE id = :user_id;
        """)
        row_find_user = await conn.execute(sql_find_user, {"user_id": user_id})
        row_res = row_find_user.mappings().first()
        if not row_res:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Something went wrong changing your password. Could not find this user.",
            )
        row_res = UserInDB(**row_res)
        if not verify_password(old_plain_password, row_res.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Wrong password, please try again.",
            )

        # update password with new password
        sql = text("""
            UPDATE users
            SET hashed_password = :hashed_password
            WHERE id = :user_id
            RETURNING id, first_name, last_name, email, created_at, updated_at;
        """)
        hashed_password = get_password_hash(new_plain_password)
        result = await conn.execute(
            sql,
            {
                "user_id": user_id,
                "hashed_password": hashed_password,
            },
        )
        row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Something went wrong changing your password.",
            )
