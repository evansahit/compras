from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncConnection

from app.config import Settings
from app.database.db import get_db_connection
from app.schemas.token import Token
from app.schemas.user import UserInDB, UserOutput
from app.service.auth_service import AuthService
from app.service.utils import create_unauthorized_exception

router = APIRouter()


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    conn: Annotated[AsyncConnection, Depends(get_db_connection)],
) -> Token:
    user: UserInDB | None = await AuthService.authenticate_user(
        conn, form_data.username, form_data.password
    )
    if not user:
        raise create_unauthorized_exception("Incorrect username or password")

    access_token_expires = (
        float(Settings.ACCESS_TOKEN_EXPIRE_DAYS)
        if Settings.ACCESS_TOKEN_EXPIRE_DAYS
        else float(3)
    )
    access_token_expires = timedelta(days=access_token_expires)

    access_token: str = AuthService.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="Bearer")


@router.get("/users/me", response_model=UserOutput)
async def get_current_user(
    current_user: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> UserOutput:
    return current_user
