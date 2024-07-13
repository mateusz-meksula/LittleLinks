from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class UserCreateResponse(BaseModel):
    id: int
