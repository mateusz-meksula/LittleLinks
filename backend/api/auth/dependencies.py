from typing import Annotated, NamedTuple

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from ..config import Config, get_config
from ..database import Cursor, get_cursor
from .errors import TokenIsMissingError
from .models import User
from .services import get_user_from_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


class Dependencies(NamedTuple):
    token: Annotated[str | None, Depends(oauth2_scheme)]
    config: Annotated[Config, Depends(get_config)]
    cursor: Annotated[Cursor, Depends(get_cursor)]


async def get_current_user(
    dependencies: Annotated[Dependencies, Depends(Dependencies)]
) -> User:
    token, config, cursor = dependencies
    if token is None:
        raise TokenIsMissingError

    return await get_user_from_access_token(token, cursor, config)


async def get_current_user_or_none(
    dependencies: Annotated[Dependencies, Depends(Dependencies)]
) -> User | None:
    token, config, cursor = dependencies
    if token is None:
        return None

    return await get_user_from_access_token(token, cursor, config)
