from datetime import datetime

from pydantic import BaseModel


class LinkCreate(BaseModel):
    url: str


class LinkCreateResponse(BaseModel):
    id: int


class LinkRead(BaseModel):
    id: int
    user_id: int | None
    url: str
    endpoint: str
    visit_count: int
    created: datetime
    modified: datetime | None
