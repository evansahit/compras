from uuid import UUID

from app.schemas.user import UserCreate, UserInDB, UserOutput
from fastapi import HTTPException, status
from sqlalchemy import Connection, text


class UserService:
    @staticmethod
    def create_user(conn: Connection, new_user: UserCreate) -> UserOutput:
        sql = text("""
            INSERT INTO users (first_name, last_name, email, hashed_password)
            VALUES (:first_name, :last_name, :email, :hashed_password)
            RETURNING id, first_name, last_name, email, created_at, updated_at;
        """)

        with conn.begin():
            result = conn.execute(
                sql,
                new_user.model_dump(),
            )

            result = result.mappings().first()
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create user {new_user.email}",
                )

            return UserOutput(**result)

    @staticmethod
    def get_user_by_id(conn: Connection, user_id: UUID):
        sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
            FROM users
            WHERE id = :user_id;
        """)

        result = conn.execute(sql, {"user_id": user_id})
        result = result.mappings().first()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not find user with ID of {user_id}",
            )

        return UserOutput(**result)

    @staticmethod
    def get_user_by_email(conn: Connection, email: str) -> UserInDB:
        sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
            FROM users
            WHERE email = :email;
        """)

        result = conn.execute(sql, {"email": email})
        result = result.mappings().first()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not find user with email of {email}",
            )

        return UserInDB(**result)
