from app.schemas.user import UserInDB
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


def create_unauthorized_exception(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def create_not_found_exception(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=detail,
    )


# placed this here to circumvent circular import errors between AuthService and UserService
async def get_user_by_email(conn: AsyncConnection, email: str) -> UserInDB | None:  # noqa: F821
    sql = text("""
            SELECT id, first_name, last_name, email, hashed_password, created_at, updated_at
            FROM users
            WHERE email = :email;
        """)
    result = await conn.execute(sql, {"email": email})
    row = result.mappings().first()

    return UserInDB(**row) if row else None


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
