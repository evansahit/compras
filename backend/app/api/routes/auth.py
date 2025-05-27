from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.config import Settings
from app.database.db import db
from app.schemas.token import Token
from app.schemas.user import UserInDB, UserOutput
from app.service.auth_service import AuthService
from app.service.utils import create_unauthorized_exception

router = APIRouter()


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    with db.connect() as conn:
        user: UserInDB | None = AuthService.authenticate_user(
            conn, form_data.username, form_data.password
        )
        if not user:
            raise create_unauthorized_exception("Incorrect username or password")

        access_token_expires = (
            float(Settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            if Settings.ACCESS_TOKEN_EXPIRE_MINUTES
            else float(30)
        )
        access_token_expires = timedelta(minutes=access_token_expires)

        access_token: str = AuthService.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return Token(access_token=access_token, token_type="Bearer")


@router.get("/users/me", response_model=UserOutput)
async def get_current_user(
    current_user: Annotated[UserOutput, Depends(AuthService.get_current_user)],
) -> UserOutput:
    return current_user
