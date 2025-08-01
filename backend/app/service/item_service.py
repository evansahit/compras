from collections import defaultdict
from decimal import Decimal
from typing import Any
from uuid import UUID

from app.schemas.item import ItemCreate, ItemOutput, ItemUpdate, ItemWithProducts
from app.schemas.product import ProductCreate, ProductOutput
from app.service.utils import create_not_found_exception
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
    ) -> ItemWithProducts:
        sql_insert_item = text("""
            INSERT INTO items (name, user_id)
            VALUES (:name, :user_id)
            RETURNING id, user_id, name, is_completed, is_archived, created_at, updated_at;
        """)
        created_item = await conn.execute(sql_insert_item, new_item.model_dump())
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
        jumbo_products = get_jumbo_products(created_item.id, new_item.name)
        products = ah_products + jumbo_products
        if not products or len(products) == 0:
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
        for p in products:
            result = await conn.execute(sql_insert_products, p.model_dump())
            row = result.mappings().first()
            if row:
                created_products.append(ProductOutput(**row))

        if len(created_products) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Something went wrong saving products for item {created_item.name}",
            )

        return ItemWithProducts(
            item=created_item,
            products=created_products if created_products else [],
        )

    @staticmethod
    async def get_all_items_with_products_by_user_id(
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
            raise create_not_found_exception("Could not find this item.")

        return ItemOutput(**result)

    @staticmethod
    async def update_item_by_id(
        conn: AsyncConnection,
        item_id: UUID,
        updated_item: ItemUpdate,
    ) -> ItemOutput:
        item_to_update: ItemOutput = await ItemService.get_item_by_id(conn, item_id)

        sql = text("""
            UPDATE items
            SET name = :name, is_completed = :is_completed, is_archived = :is_archived
            WHERE id = :item_id
            RETURNING id, user_id, name, is_completed, is_archived, created_at, updated_at;
        """)

        item_update_result = await conn.execute(
            sql,
            {
                "item_id": item_id,
                "name": updated_item.name,
                "is_completed": updated_item.is_completed,
                "is_archived": updated_item.is_archived,
            },
        )

        item_update_result = item_update_result.mappings().first()
        if not item_update_result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update item with name {updated_item.name}",
            )

        # update products if item name changed
        if item_to_update.name != updated_item.name:
            # delete all products previously associated with this item to replace later
            sql_delete_products = text("""
                DELETE FROM products
                WHERE item_id = :item_id;
            """)
            await conn.execute(sql_delete_products, {"item_id": item_id})

            # insert products found for newly updated item name
            ah_products: list[ProductCreate] = get_ah_products(
                item_id, updated_item.name
            )
            jumbo_products: list[ProductCreate] = get_jumbo_products(
                item_id, updated_item.name
            )
            products = ah_products + jumbo_products
            sql_insert_products = text("""
                INSERT INTO products (item_id, name, grocery_store, price, price_discounted, weight, image_url)
                VALUES (:item_id, :name, :grocery_store, :price, :price_discounted, :weight, :image_url)
                RETURNING id, item_id, name, grocery_store, price, price_discounted, weight, image_url, created_at, updated_at;
            """)
            for p in products:
                await conn.execute(sql_insert_products, p.model_dump())

        return ItemOutput(**item_update_result)

    @staticmethod
    async def get_products_for_item_by_item_id(
        conn: AsyncConnection, item_id: UUID
    ) -> list[ProductOutput]:
        _ = await ItemService.get_item_by_id(conn, item_id)

        sql = text("""
            SELECT id, item_id, name, grocery_store, price, price_discounted, weight, image_url, created_at, updated_at
            FROM products
            WHERE item_id = :item_id
            ORDER BY COALESCE(price_discounted, price);
        """)
        products = await conn.execute(sql, {"item_id": item_id})
        products = products.mappings().all()
        products = [ProductOutput(**p) for p in products]

        return products

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
            raise create_not_found_exception("Item not found or already deleted")

        return ItemOutput(**result)


def get_ah_products(item_id: UUID, query: str, size: int = 10) -> list[ProductCreate]:
    """
    Searches for all products relevant to `query`.
    For some reason there's sometimes a bug with the `size` parameter:
        `size` + 2 products are returned instead of just `size` products
    """

    ah_connector = AHConnector()
    response: dict[Any, Any] = ah_connector.search_products(query=query, size=size)  # type: ignore
    products: list[dict[str, Any]] = response["products"]
    if not products or len(products) == 0:
        return []

    res: list[ProductCreate] = []
    for p in products:
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


def get_jumbo_products(
    item_id: UUID, query: str, size: int = 10
) -> list[ProductCreate]:
    jumbo_connector = JumboConnector()
    response: Any = jumbo_connector.search_products(query=query, size=size)  # type: ignore
    products = response["products"]["data"]
    if not products or len(products) == 0:
        return []

    res: list[ProductCreate] = []
    for p in products:
        res.append(
            ProductCreate(
                item_id=item_id,
                name=p["title"],
                grocery_store="Jumbo",
                price=Decimal(str(float(p["prices"]["price"]["amount"] / 100))),
                price_discounted=Decimal(
                    str(float(p["prices"]["promotionalPrice"]["amount"]) / 100)
                )
                if "promotionalPrice" in p["prices"]
                else None,
                weight=p["quantity"] if "quantity" in p else "",
                image_url=p["imageInfo"]["primaryView"][0]["url"],
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
