from pathlib import Path
from uuid import UUID

import pytest
import pytest_asyncio
from alembic import command
from alembic.config import Config
from app.config import Settings
from app.schemas.user import UserCreate
from app.service.user_service import UserService
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine


def _run_alembic_migrations(sync_conn):
    """Run Alembic migrations in sync context."""
    alembic_ini_path = Path(__file__).parent.parent / "alembic.ini"
    alembic_cfg = Config(str(alembic_ini_path))
    alembic_cfg.config_file_name = str(alembic_ini_path)

    sync_url = str(sync_conn.engine.url)
    alembic_cfg.set_main_option("sqlalchemy.url", sync_url)

    alembic_cfg.attributes["connection"] = sync_conn
    command.upgrade(alembic_cfg, "head")


@pytest_asyncio.fixture(scope="session")
async def test_db_engine():
    migration_engine = create_engine(Settings.TEST_DB_URL, echo=False)

    with migration_engine.connect() as migration_conn:
        _run_alembic_migrations(migration_conn)
        migration_conn.commit()

    migration_engine.dispose()

    test_engine = create_async_engine(Settings.TEST_DB_URL, echo=False)
    yield test_engine
    await test_engine.dispose()


@pytest_asyncio.fixture
async def test_db_connection(test_db_engine):
    async with test_db_engine.connect() as conn:
        trans = await conn.begin()
        try:
            yield conn
        finally:
            await trans.rollback()


@pytest_asyncio.fixture
async def get_test_user(test_db_connection):
    return await UserService.create_user(
        test_db_connection,
        UserCreate(
            first_name="John",
            last_name="Doe",
            email="john@mail.com",
            plain_password="root",
        ),
    )


@pytest.fixture
def get_uuid(hex: str = "12345678123456781234567812345678"):
    return UUID(hex)
