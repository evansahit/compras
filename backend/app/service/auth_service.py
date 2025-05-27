from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import jwt
from app.config import Settings
from app.schemas.token import TokenData
from app.schemas.user import UserInDB
from app.service.user_service import UserOutput, UserService
from app.service.utils import create_unauthorized_exception
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext
from sqlalchemy import Connection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{Settings.API_V1_STR}/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(plain_password: str) -> str:
        return pwd_context.hash(plain_password)

    @staticmethod
    def authenticate_user(
        conn: Connection, username: str, plain_password: str
    ) -> UserInDB | None:
        user: UserInDB = UserService.get_user_by_email(conn, username)

        if not user or not AuthService.verify_password(
            plain_password, user.hashed_password
        ):
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
        conn: Connection,
        token: Annotated[str, Depends(oauth2_scheme)],
    ) -> UserOutput:
        try:
            payload = jwt.decode(token, Settings.SECRET, algorithms=Settings.ALGORITHM)  # type: ignore
            email = payload.get("sub")
            if email is None:
                raise create_unauthorized_exception("Could not validate credentials")

            token_data = TokenData(username=email)

        except InvalidTokenError:
            raise create_unauthorized_exception("Could not validate credentials")

        if not token_data.username:
            raise create_unauthorized_exception("Could not validate credentials")

        user: UserInDB = UserService.get_user_by_email(conn, token_data.username)
        if not user:
            raise create_unauthorized_exception("Could not validate credentials")

        return UserOutput(**user.model_dump())
