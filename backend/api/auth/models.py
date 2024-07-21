from datetime import datetime

from pydantic import BaseModel


class AccessToken(BaseModel):
    token: str
    type: str
    expires: datetime


class User(BaseModel):
    id: int
    username: str
