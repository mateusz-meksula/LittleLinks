from fastapi import FastAPI

from .auth.router import router as auth_router
from .routers.link import router as link_router
from .routers.user import router as user_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(link_router)
app.include_router(user_router)


@app.get("/")
def root():
    return "Hello World"
