from typing import Annotated

from fastapi import APIRouter, Depends

from ..database import Cursor, get_cursor
from ..schemas.link import LinkCreate, LinkCreateResponse
from ..services import link as service

router = APIRouter(prefix="/links", tags=["links"])


@router.post("/", response_model=LinkCreateResponse, status_code=201)
async def create_link(
    cursor: Annotated[Cursor, Depends(get_cursor)], link_data: LinkCreate
):
    return await service.create_link(cursor, url=link_data.url)
