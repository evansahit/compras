from collections import defaultdict
from typing import Any
from uuid import UUID

from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate, ItemWithProducts
from app.schemas.product import ProductCreate, ProductOutput
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from supermarktconnector.ah import AHConnector  # type: ignore
from supermarktconnector.jumbo import JumboConnector  # type: ignore


# TODO: rewrite other functions to account for new Products table
class ItemService:
    @staticmethod
    async def create_item(
        conn: AsyncConnection,
        new_item: ItemCreate,
    ) -> ItemWithProducts:
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
        if not ah_products or len(ah_products) == 0:
            return ItemWithProducts(
                item=created_item,
                products=[],
            )

        sql_insert_products = text("""
            INSERT INTO products (item_id, name, grocery_store, price, price_discounted, weight, image_url)
            VALUES (:item_id, :name, :grocery_store, :price, :price_discounted, :weight, :image_url)
            RETURNING id, item_id, name, grocery_store, price, price_discounted, weight, image_url, created_at, updated_at;
        """)
        created_products: list[ProductOutput] = []
        for p in ah_products:
            result = await conn.execute(sql_insert_products, p.model_dump())
            row = result.mappings().first()
            if row:
                created_products.append(ProductOutput(**row))
        await conn.commit()

        if not created_products:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Something went wrong saving products for item {created_item.name}",
            )

        return ItemWithProducts(
            item=created_item,
            products=created_products if created_products else [],
        )

    @staticmethod
    async def get_all_items_by_user_id(
        conn: AsyncConnection, user_id: UUID
    ) -> list[ItemWithProducts]:
        sql_item = text("""
            SELECT id, user_id, name, is_completed, is_archived, created_at, updated_at
            FROM items
            WHERE user_id = :user_id
            ORDER BY created_at;
        """)
        items = await conn.execute(sql_item, {"user_id": user_id})
        items = items.mappings().all()
        items = [ItemOutput(**i) for i in items]

        # return early if user has no items and avoid making additional DB calls
        if not items:
            return []

        product_map: dict[UUID, list[ProductOutput]] = defaultdict(list)
        sql_products = text("""
            SELECT id, item_id, name, grocery_store, price, price_discounted, weight, image_url, created_at, updated_at
            FROM products
            WHERE item_id = ANY(:item_ids);
        """)
        item_ids = [i.id for i in items]
        products = await conn.execute(sql_products, {"item_ids": item_ids})
        products = products.mappings().all()
        products = [ProductOutput(**p) for p in products]
        for p in products:
            product_map[p.item_id].append(p)

        items_with_products = [
            ItemWithProducts(item=i, products=product_map.get(i.id, [])) for i in items
        ]

        return items_with_products

    @staticmethod
    async def get_item_by_id(conn: AsyncConnection, item_id: UUID) -> ItemOutput:
        sql = text("""
            SELECT id, user_id, name, is_completed, is_archived, created_at, updated_at
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
    ) -> ItemOutput:
        sql = text("""
            UPDATE items
            SET name = :name, is_completed = :is_completed, is_archived = :is_archived
            WHERE id = :item_id
            RETURNING id, user_id, name, is_completed, is_archived, created_at, updated_at;
        """)

        result = await conn.execute(
            sql,
            {
                "item_id": item_id,
                "name": updated_item.name,
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
    async def delete_item_by_id(conn: AsyncConnection, item_id: UUID) -> ItemOutput:
        sql = text("""
            DELETE FROM items 
            WHERE id = :item_id
            RETURNING *;            
        """)

        result = await conn.execute(sql, {"item_id": item_id})
        result = result.mappings().first()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found or already deleted",
            )

        print("result before commit: ", result)
        await conn.commit()
        print("result after commit: ", result)

        return ItemOutput(**result)


def get_ah_products(item_id: UUID, query: str, size: int = 10) -> list[ProductCreate]:
    """
    Searches for all products relevant to `query`.
    For some reason there's a bug with the `size` parameter: `size` + 2 products are returned instead of just `size` products
    """

    ah_connector = AHConnector()
    response: dict[Any, Any] = ah_connector.search_products(query=query, size=size)  # type: ignore
    all_products: list[dict[str, Any]] = response["products"]
    if not all_products or len(all_products) == 0:
        return []

    res: list[Any] = []
    for p in all_products:
        res.append(
            ProductCreate(
                item_id=item_id,
                name=p["title"],
                grocery_store="Albert Heijn",
                price=p["priceBeforeBonus"],
                price_discounted=p["currentPrice"] if "currentPrice" in p else None,
                weight=p["salesUnitSize"],
                image_url=p["images"][0]["url"],
            )
        )

    return res


# def get_cheapest_product_ah(products: list[dict]):
#     cheapest_product: dict | None = None
#     for p in products:
#         if "currentPrice" in p.keys():
#             if cheapest_product is None:
#                 cheapest_product = p

#             if p["currentPrice"] > cheapest_product["currentPrice"]:
#                 cheapest_product = p

#         if p["priceBeforeBonus"] > cheapest_product["priceBeforeBonus"]:
#             cheapest_product = p
