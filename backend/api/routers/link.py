from typing import Annotated

from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user_or_none
from ..auth.models import User
from ..database import Cursor, get_cursor
from ..schemas.link import LinkCreate, LinkCreateResponse, LinkRead
from ..services import link as service

router = APIRouter(prefix="/links", tags=["links"])


@router.post("/", response_model=LinkCreateResponse, status_code=201)
async def create_link(
    cursor: Annotated[Cursor, Depends(get_cursor)],
    link_data: LinkCreate,
    user: Annotated[User | None, Depends(get_current_user_or_none)],
):
    return await service.create_link(
        cursor,
        link=link_data,
        user_id=user and user.id,
    )


@router.get("/{link_id}")
async def get_link(
    cursor: Annotated[Cursor, Depends(get_cursor)],
    user: Annotated[User | None, Depends(get_current_user_or_none)],
    link_id: int,
) -> LinkRead:
    return await service.get_link(cursor, link_id, user_id=user and user.id)


@router.get("/alias/{alias}")
async def redirect_by_alias(
    cursor: Annotated[Cursor, Depends(get_cursor)],
    alias: str,
) -> LinkRead:
    return await service.get_link_by_alias(cursor, alias)
