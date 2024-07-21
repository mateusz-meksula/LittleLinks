from datetime import datetime
from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from ..config import Config, get_config
from ..database import Cursor, get_cursor
from .errors import (
    InvalidTokenPayloadKeysError,
    InvalidTokenPayloadValuesError,
    TokenExpiredError,
)
from .models import User
from .services import get_user
from .utils import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
):
    username, expires = decode_access_token(token, key=config.secret_key)
    if not username or not expires:
        raise InvalidTokenPayloadKeysError

    user = await get_user(username, cursor)
    if user is None:
        raise InvalidTokenPayloadValuesError

    try:
        expire_date = datetime.fromisoformat(expires)
    except ValueError:
        raise InvalidTokenPayloadKeysError

    if datetime.now() > expire_date:
        raise TokenExpiredError

    return User(**user)
