"""base revision

Revision ID: b18c4e042ba7
Revises:
Create Date: 2025-05-25 13:56:31.577029

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b18c4e042ba7"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def create_updated_at_trigger(table_name: str):
    op.execute(f"""
        CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON {table_name}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)


def upgrade() -> None:
    # to enable the use of auto-generated UUIDs
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')

    # create function to update the "updated_at" column when a row is inserted or updated
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)

    # create all tables
    op.execute("""
        CREATE TABLE users (
            id                  UUID 
                                    PRIMARY KEY 
                                    DEFAULT gen_random_uuid(),
            first_name          TEXT NOT NULL,
            last_name           TEXT,
            email               TEXT UNIQUE NOT NULL,
            hashed_password     TEXT NOT NULL,
            created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    """)

    op.execute("""
        CREATE TABLE items (
            id                  UUID 
                                    PRIMARY KEY 
                                    DEFAULT gen_random_uuid(),
            user_id             UUID 
                                    NOT NULL 
                                    REFERENCES users(id) 
                                    ON DELETE CASCADE,
            name                TEXT NOT NULL,
            is_completed        BOOLEAN DEFAULT FALSE,
            is_archived         BOOLEAN DEFAULT FALSE,
            created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    """)

    op.execute("""
        CREATE TABLE products (
            id                  UUID
                                    PRIMARY KEY
                                    DEFAULT gen_random_uuid(),
            item_id             UUID 
                                    NOT NULL
                                    REFERENCES items(id)
                                    ON DELETE CASCADE,
            name                TEXT NOT NULL,
            grocery_store       TEXT NOT NULL,
            price               NUMERIC(5, 2) NOT NULL,
            price_discounted    NUMERIC(5, 2),
            weight              TEXT NOT NULL,
            image_url           TEXT,
            created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # create triggers for all tables to update timestamp for rows that are updated
    create_updated_at_trigger("users")
    create_updated_at_trigger("items")
    create_updated_at_trigger("products")


def downgrade() -> None:
    # drop all tables
    op.execute("""
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS users;
    """)

    # drop function
    op.execute("""
        DROP FUNCTION IF EXISTS update_updated_at_column();
    """)
