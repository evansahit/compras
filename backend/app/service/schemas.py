from app.schemas.item import ItemOutput
from app.schemas.product import ProductOutput
from pydantic import BaseModel


class CreateItemResponse(BaseModel):
    item: ItemOutput
    products: list[ProductOutput]
