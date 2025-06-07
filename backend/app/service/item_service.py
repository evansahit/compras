from typing import Any
from uuid import UUID

from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate
from app.schemas.product import ProductCreate, ProductOutput
from app.service.schemas import CreateItemResponse
from app.service.user_service import UserService
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from supermarktconnector.ah import AHConnector  # type: ignore
from supermarktconnector.jumbo import JumboConnector  # type: ignore


class ItemService:
    @staticmethod
    async def create_item(
        conn: AsyncConnection,
        new_item: ItemCreate,
    ) -> CreateItemResponse:
        sql_insert_item = text("""
            INSERT INTO items (name, user_id)
            VALUES (:name, :user_id)
            RETURNING id, user_id, name, is_completed, is_archived, created_at, updated_at;
        """)
        created_item = await conn.execute(sql_insert_item, new_item.model_dump())
        await conn.commit()
        created_item = created_item.mappings().first()
        if not created_item:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f'Something went wrong saving an item "{new_item.name}"',
            )
        created_item = ItemOutput(**created_item)

        ah_products: list[ProductCreate] = get_ah_products(
            created_item.id, new_item.name
        )
        sql_insert_products = text("""
            INSERT INTO products (item_id, name, grocery_store, price)
            VALUES (:item_id, :name, :grocery_store, :price)
            RETURNING id, item_id, name, grocery_store, price, created_at, updated_at;
        """)
        created_products = await conn.execute(
            sql_insert_products, [product.model_dump() for product in ah_products]
        )
        await conn.commit()
        created_products = created_products.mappings().all()
        if not created_products:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Something went wrong saving products",
            )
        created_products = [ProductOutput(**p) for p in created_products]

        return CreateItemResponse(
            item=created_item,
            products=created_products if created_products else [],
        )

    @staticmethod
    async def get_all_items_by_user_id(conn: AsyncConnection, user_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, price, is_completed, is_archived, created_at, updated_at
            FROM items
            WHERE user_id = :user_id
        """)

        result = await conn.execute(sql, {"user_id": user_id})
        result = result.mappings().all()

        return [ItemOutput(**res) for res in result]

    @staticmethod
    async def get_item_by_id(conn: AsyncConnection, item_id: UUID):
        sql = text("""
            SELECT id, user_id, name, grocery_store, price, is_completed, is_archived, created_at, updated_at
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
            SET name = :name, grocery_store = :grocery_store , price = :price, is_completed = :is_completed, is_archived = :is_archived
            WHERE id = :item_id
            RETURNING id, user_id, name, grocery_store, price, is_completed, is_archived, created_at, updated_at;
        """)

        result = await conn.execute(
            sql,
            {
                "item_id": item_id,
                "name": updated_item.name,
                "grocery_store": updated_item.grocery_store,
                "price": updated_item.price,
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


jumbo_connector = JumboConnector()


def get_ah_products(item_id: UUID, query: str, size: int = 8) -> list[ProductCreate]:
    """
    Searches for all products relevant to `query`.
    For some reason there's a bug with the `size` parameter: `size` + 2 products are returned instead of just `size`
    """

    ah_connector = AHConnector()
    all_products: dict[str, Any] = ah_connector.search_products(query=query, size=size)  # type: ignore
    all_products: list[dict[str, Any]] = all_products["products"]
    res: list[Any] = []
    for p in all_products:
        res.append(
            ProductCreate(
                item_id=item_id,
                name=p["currentPrice"],
                grocery_store="Albert Heijn",
                price=p["priceBeforeBonus"],
            )
        )

    return res


def get_cheapest_product_ah(products: list[dict]):
    cheapest_product: dict | None = None
    for p in products:
        if "currentPrice" in p.keys():
            if cheapest_product is None:
                cheapest_product = p

            if p["currentPrice"] > cheapest_product["currentPrice"]:
                cheapest_product = p

        if p["priceBeforeBonus"] > cheapest_product["priceBeforeBonus"]:
            cheapest_product = p
