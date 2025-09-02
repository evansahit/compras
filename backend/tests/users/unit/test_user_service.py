from datetime import datetime
from uuid import UUID

import pytest
from app.schemas.item import ItemCreate
from app.schemas.user import UserCreate, UserOutput, UserUpdate
from app.service.item_service import ItemService
from app.service.user_service import UserService
from app.service.utils import verify_password
from fastapi import HTTPException


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


@pytest.mark.asyncio
async def test_create_user_existing_user(test_db_connection, get_test_user):
    with pytest.raises(HTTPException) as exception:
        await UserService.create_user(
            test_db_connection,
            UserCreate(
                first_name="John",
                last_name="Doe",
                email="john@mail.com",
                plain_password="root",
            ),
        )

    assert exception.value.status_code == 409
    assert exception.value.detail == "A user with this email address already exists."


@pytest.mark.asyncio
async def test_get_user_by_id(test_db_connection, get_test_user):
    user = await UserService.get_user_by_id(test_db_connection, get_test_user.id)

    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john@mail.com"

    assert hasattr(user, "id")
    assert hasattr(user, "created_at")
    assert hasattr(user, "updated_at")

    assert not hasattr(user, "plain_password")
    assert not hasattr(user, "hashed_password")


@pytest.mark.asyncio
async def test_get_user_by_id_not_found(test_db_connection, get_uuid):
    with pytest.raises(HTTPException) as exception:
        await UserService.get_user_by_id(test_db_connection, get_uuid)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Could not find this user"


@pytest.mark.asyncio
async def test_get_current_user_with_items_and_products(
    test_db_connection, get_test_user
):
    await ItemService.create_item(
        test_db_connection, ItemCreate(user_id=get_test_user.id, name="banana")
    )
    user = await UserService.get_current_user_with_items_and_products(
        test_db_connection, get_test_user
    )

    assert user.id == get_test_user.id
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john@mail.com"
    assert user.items_with_products[0].item.name == "banana"


@pytest.mark.asyncio
async def test_get_current_user_with_items_and_products_not_found(
    test_db_connection, get_uuid
):
    with pytest.raises(HTTPException) as exception:
        await UserService.get_current_user_with_items_and_products(
            test_db_connection,
            UserOutput(
                id=get_uuid,
                first_name="John",
                last_name="Doe",
                email="john@mail.com",
                created_at=datetime.now(),
                updated_at=datetime.now(),
            ),
        )

        assert exception.value.status_code == 404
        assert exception.value.detail == "Could not find this user"


@pytest.mark.asyncio
async def test_update_user(test_db_connection, get_test_user):
    user_updated = await UserService.update_user(
        test_db_connection,
        get_test_user.id,
        UserUpdate(
            first_name="Johnny",
            last_name=get_test_user.last_name,
            email=get_test_user.email,
        ),
    )

    assert user_updated.first_name == "Johnny"
    assert user_updated.last_name == "Doe"
    assert user_updated.email == "john@mail.com"


@pytest.mark.asyncio
async def test_update_user_not_found(test_db_connection, get_uuid):
    with pytest.raises(HTTPException) as exception:
        await UserService.update_user(
            test_db_connection,
            get_uuid,
            UserUpdate(first_name="Johnny", last_name="Doe", email="john@mail.com"),
        )

    assert exception.value.status_code == 404
    assert exception.value.detail == "Could not find this user"


@pytest.mark.asyncio
async def test_update_password(test_db_connection, get_test_user):
    await UserService.update_password(
        test_db_connection, get_test_user.id, "root", "rootroot"
    )
    user = await UserService._get_user_with_hashed_password(
        test_db_connection, get_test_user.id
    )

    assert verify_password("rootroot", user.hashed_password)


@pytest.mark.asyncio
async def test_update_password_user_not_found(test_db_connection, get_uuid):
    with pytest.raises(HTTPException) as exception:
        await UserService.update_password(
            test_db_connection, get_uuid, "root", "rootroot"
        )

    assert exception.value.status_code == 404
    assert (
        exception.value.detail
        == "Something went wrong changing your password. Could not find this user."
    )


@pytest.mark.asyncio
async def test_update_password_same_passwords(
    test_db_connection, get_test_user, get_uuid
):
    with pytest.raises(HTTPException) as exception:
        await UserService.update_password(
            test_db_connection, get_test_user.id, "root", "root"
        )

    assert exception.value.status_code == 400
    assert (
        exception.value.detail
        == "Something went wrong changing your password. Your old and new passwords are the same."
    )


@pytest.mark.asyncio
async def test_update_password_wrong_password(
    test_db_connection, get_test_user, get_uuid
):
    with pytest.raises(HTTPException) as exception:
        await UserService.update_password(
            test_db_connection, get_test_user.id, "rootroot", "rootroot"
        )

    assert exception.value.status_code == 401
    assert exception.value.detail == "Wrong password, please try again."
