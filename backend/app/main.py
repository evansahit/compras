from fastapi import FastAPI

from app.api import users

app = FastAPI(
    title="Compras+",
    description="A shopping list that gives you up-to-date pricing information",
    version="0.0.1",
    contact={
        "name": "Evan Sahit",
        "email": "evansahit@hotmail.com",
    },
    license_info={"name": "MIT"},
)

app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "Hello Compras+"}
