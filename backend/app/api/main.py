from fastapi import APIRouter

from app.api.routes import auth, items, products, users

router = APIRouter()
router.include_router(users.router, tags=["Users"])
router.include_router(items.router, tags=["Items"])
router.include_router(products.router, tags=["Products"])
router.include_router(auth.router, tags=["Auth"])
