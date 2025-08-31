import pytest
from app.schemas.user import UserCreate
from app.service.user_service import UserService
from tests.conftest import test_db_connection


@pytest.mark.asyncio
async def test_create_user(test_db_connection):
    user = await UserService.create_user(
        test_db_connection,
        UserCreate(
            first_name="John",
            last_name="Doe",
            email="john@mail.com",
            plain_password="root",
        ),
    )

    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john@mail.com"

    assert hasattr(user, "id")
    assert hasattr(user, "created_at")
    assert hasattr(user, "updated_at")

    assert not hasattr(user, "plain_password")
    assert not hasattr(user, "hashed_password")
