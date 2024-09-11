from typing import Annotated

from fastapi import APIRouter, Depends, status

from ..auth.dependencies import get_current_user_or_none
from ..auth.models import User
from ..database import Cursor, get_cursor
from ..schemas.link import LinkCreate, LinkCreateResponse, LinkRead, LinkSetCount
from ..services import link as service

router = APIRouter(prefix="/links", tags=["links"])


@router.post(
    "/", response_model=LinkCreateResponse, status_code=status.HTTP_201_CREATED
)
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
async def get_link_by_alias(
    cursor: Annotated[Cursor, Depends(get_cursor)],
    alias: str,
) -> LinkRead:
    return await service.get_link_by_alias(cursor, alias)


@router.patch("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def set_link_new_count(
    cursor: Annotated[Cursor, Depends(get_cursor)],
    link_id: int,
    body: LinkSetCount,
):
    await service.set_new_count(cursor, link_id, body.new_count)
