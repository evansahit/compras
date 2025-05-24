from app.api.users import user_router
from fastapi import FastAPI

app = FastAPI(
    title="Compras++",
    description="A shopping list that gives you up-to-date pricing information",
    version="0.0.1",
    contact={
        "name": "Evan Sahit",
        "email": "evansahit@hotmail.com",
    },
    license_info={"name": "MIT"},
)

app.include_router(user_router)


@app.get("/")
def root():
    return {"message": "Hello Compras++"}
