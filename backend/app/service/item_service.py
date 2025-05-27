from uuid import UUID

from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate
from app.service.user_service import UserService
from fastapi import HTTPException, status
from sqlalchemy import Connection, text


class ItemService:
    @staticmethod
    def create_item(conn: Connection, new_item: ItemCreate):
        sql = text("""
            INSERT INTO items (name, user_id, grocery_store, lowest_price)
            VALUES (:name, :user_id, :grocery_store, :lowest_price)
            RETURNING id, user_id, name, grocery_store, lowest_price, created_at, updated_at;
        """)

        with conn.begin():
            result = conn.execute(sql, new_item.model_dump())

            result = result.mappings().first()
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create item with name {new_item.name}",
                )

            return ItemOutput(**result)

    @staticmethod
    def get_all_items_by_user_id(conn: Connection, user_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, lowest_price, is_complete, is_archived, created_at, updated_at
            FROM items
            WHERE user_id = :user_id
        """)

        result = conn.execute(sql, {"user_id": user_id})
        result = result.mappings().all()

        return [ItemOutput(**res) for res in result]

    @staticmethod
    def get_item_by_id(conn: Connection, item_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, lowest_price, is_complete, is_archived, created_at, updated_at
            FROM items
            WHERE id = :item_id;
        """)

        result = conn.execute(sql, {"item_id": item_id})
        result = result.mappings().first()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with ID of {item_id} does cannot be found",
            )

        return ItemOutput(**result)

    @staticmethod
    def update_item_by_id(conn: Connection, item_id: UUID, updated_item: ItemUpdate):
        sql = text("""
            UPDATE items
            SET name = :name, grocery_store = :grocery_store , lowest_price = :lowest_price, is_complete = :is_complete, is_archived = :is_archived
            WHERE id = :item_id;
        """)

        with conn.begin():
            result = conn.execute(
                sql,
                {
                    "item_id": item_id,
                    "name": updated_item.name,
                    "grocery_store": updated_item.grocery_store,
                    "lowest_price": updated_item.lowest_price,
                    "is_completed": updated_item.is_completed,
                    "is_archived": updated_item.is_archived,
                },
            )
            result = result.mappings().first()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to update item with name {updated_item.name}",
                )

            return ItemOutput(**result)

    @staticmethod
    def delete_item_by_id(conn: Connection, item_id: UUID):
        sql = text("""
            DELETE FROM items 
            WHERE id = :item_id
            RETURNING *;            
        """)

        with conn.begin():
            result = conn.execute(sql, {"item_id": item_id})
            result = result.mappings().first()

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to delete item with ID of {item_id}",
                )

            return ItemOutput(**result)
