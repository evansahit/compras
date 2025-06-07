from uuid import UUID

from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate
from app.service.user_service import UserService
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


class ItemService:
    @staticmethod
    async def create_item(
        conn: AsyncConnection,
        new_item: ItemCreate,
    ):
        # TODO: here I would need to do the fancy stuff to search for product prices at multiple supermarkets
        #       this can be done by any available APIs or packages, or I need to do some webscraping

        print("NEW ITEM:", new_item)

        # sql = text("""
        #     INSERT INTO items (name, user_id, grocery_store, lowest_price)
        #     VALUES (:name, :user_id, :grocery_store, :lowest_price)
        #     RETURNING id, user_id, name, grocery_store, lowest_price, created_at, updated_at;
        # """)

        # result = await conn.execute(sql, new_item.model_dump())
        # await conn.commit()

        # result = result.mappings().first()
        # if result is None:
        #     raise HTTPException(
        #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #         detail=f"Failed to create item with name {new_item.name}",
        #     )

        # return ItemOutput(**result)

    @staticmethod
    async def get_all_items_by_user_id(conn: AsyncConnection, user_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, lowest_price, is_completed, is_archived, created_at, updated_at
            FROM items
            WHERE user_id = :user_id
        """)

        result = await conn.execute(sql, {"user_id": user_id})
        result = result.mappings().all()

        return [ItemOutput(**res) for res in result]

    @staticmethod
    async def get_item_by_id(conn: AsyncConnection, item_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, lowest_price, is_completed, is_archived, created_at, updated_at
            FROM items
            WHERE id = :item_id;
        """)

        result = await conn.execute(sql, {"item_id": item_id})
        result = result.mappings().first()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with ID of {item_id} cannot be found",
            )

        return ItemOutput(**result)

    @staticmethod
    async def update_item_by_id(
        conn: AsyncConnection,
        item_id: UUID,
        updated_item: ItemUpdate,
    ):
        sql = text("""
            UPDATE items
            SET name = :name, grocery_store = :grocery_store , lowest_price = :lowest_price, is_completed = :is_completed, is_archived = :is_archived
            WHERE id = :item_id
            RETURNING id, user_id, name, grocery_store, lowest_price, is_completed, is_archived, created_at, updated_at;
        """)

        result = await conn.execute(
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
        await conn.commit()

        result = result.mappings().first()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update item with name {updated_item.name}",
            )

        return ItemOutput(**result)

    @staticmethod
    async def delete_item_by_id(conn: AsyncConnection, item_id: UUID):
        sql = text("""
            DELETE FROM items 
            WHERE id = :item_id
            RETURNING *;            
        """)

        result = await conn.execute(sql, {"item_id": item_id})
        await conn.commit()

        result = result.mappings().first()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete item with ID of {item_id}",
            )

        return ItemOutput(**result)
