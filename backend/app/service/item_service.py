from app.schemas.item import ItemCreate, ItemOutput
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
                raise Exception("Failed to create item")
            result = ItemOutput(**result)

            return result
