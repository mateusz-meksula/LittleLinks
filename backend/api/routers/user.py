from typing import Annotated

from fastapi import APIRouter, Depends

from ..database import Cursor, get_cursor
from ..schemas.user import UserCreate, UserCreateResponse
from ..services import user as service

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserCreateResponse, status_code=201)
async def create_user(
    cursor: Annotated[Cursor, Depends(get_cursor)], user_data: UserCreate
):
    return await service.create_user(
        cursor, username=user_data.username, password=user_data.password
    )
