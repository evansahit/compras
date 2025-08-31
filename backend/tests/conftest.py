import asyncio
from pathlib import Path

import pytest
import pytest_asyncio
from alembic import command
from alembic.config import Config
from app.config import Settings
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine

# @pytest.fixture(scope="session")
# def event_loop():
#     """Create an instance of the default event loop for the test session."""
#     loop = asyncio.get_event_loop_policy().new_event_loop()
#     yield loop
#     loop.close()


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()


def _run_alembic_migrations(sync_conn):
    """Run Alembic migrations in sync context."""
    alembic_ini_path = Path(__file__).parent.parent / "alembic.ini"
    alembic_cfg = Config(str(alembic_ini_path))
    alembic_cfg.config_file_name = str(alembic_ini_path)

    # Use the sync connection's URL
    sync_url = str(sync_conn.engine.url)
    print("[debug] sync_url:", sync_url)
    alembic_cfg.set_main_option("sqlalchemy.url", sync_url)

    # Run migrations
    alembic_cfg.attributes["connection"] = sync_conn
    command.upgrade(alembic_cfg, "head")


@pytest_asyncio.fixture(scope="session")
async def test_db_engine():
    # Create engine for migrations (separate from test engine)
    migration_engine = create_engine(Settings.TEST_DB_URL, echo=False)

    # Run migrations with a separate connection that can commit
    with migration_engine.connect() as migration_conn:
        _run_alembic_migrations(migration_conn)
        migration_conn.commit()  # Ensure migrations are committed

    migration_engine.dispose()

    # Create the engine that tests will use
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


# @pytest_asyncio.fixture(scope="session")
# async def test_db_engine():
#     engine = create_async_engine(Settings.TEST_DB_URL, echo=False)
#     alembic_ini_path = Path(__file__).parent.parent / "alembic.ini"
#     alembic_cfg = Config(str(alembic_ini_path))
#     alembic_cfg.config_file_name = str(alembic_ini_path)
#     alembic_cfg.set_main_option(
#         "sqlalchemy.url", Settings.TEST_DB_URL.replace("+psycopg", "")
#     )

#     # Debug: Check current revision
#     try:
#         current_head = command.current(alembic_cfg)
#         print(f"Current revision: {current_head}")
#     except Exception as e:
#         print(f"No current revision (fresh DB): {e}")

#     # Run migrations
#     print("Running Alembic upgrade...")
#     command.upgrade(alembic_cfg, "head")
#     print("Alembic upgrade completed")

#     yield engine
#     await engine.dispose()
