from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import jwt
from app.config import Settings
from app.database.db import get_db_connection
from app.schemas.token import TokenData
from app.schemas.user import UserInDB
from app.service.user_service import UserOutput, UserService
from app.service.utils import (
    create_not_found_exception,
    create_unauthorized_exception,
    verify_password,
)
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncConnection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{Settings.API_V1_STR}/token")


class AuthService:
    @staticmethod
    async def authenticate_user(
        conn: AsyncConnection, email: str, plain_password: str
    ) -> UserInDB | None:
        user: UserInDB = await UserService.get_user_by_email(conn, email)

        if not user or not verify_password(plain_password, user.hashed_password):
            return None

        return user

    @staticmethod
    def create_access_token(
        data: dict[str, Any], expires_delta: timedelta | None = None
    ):
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)

        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(  # type: ignore
            to_encode, Settings.SECRET, algorithm=Settings.ALGORITHM
        )

        return encoded_jwt

    @staticmethod
    async def get_current_user(
        conn: Annotated[AsyncConnection, Depends(get_db_connection)],
        token: Annotated[str, Depends(oauth2_scheme)],
    ) -> UserOutput:
        exception = create_unauthorized_exception("Could not validate credentials")

        try:
            payload = jwt.decode(  # type: ignore
                token,
                Settings.SECRET,
                algorithms=Settings.ALGORITHM,
            )
            email = payload.get("sub")
            if email is None:
                raise exception

            token_data = TokenData(username=email)

        except InvalidTokenError:
            raise exception

        if not token_data.username:
            raise exception

        user: UserInDB = await UserService.get_user_by_email(conn, token_data.username)
        if not user:
            raise create_not_found_exception("User not found.")

        return UserOutput(**user.model_dump())
