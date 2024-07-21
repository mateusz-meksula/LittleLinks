from ..config import Config
from ..database import Cursor
from .errors import (
    CredentialsError,
    InvalidTokenPayloadKeysError,
    InvalidTokenPayloadValuesError,
    TokenIsMissingError,
)
from .models import User
from .utils import decode_refresh_token, verify_password


async def get_user_hash(username: str, cursor: Cursor) -> str | None:
    stmt = "SELECT username, hash FROM user WHERE username = %s"
    await cursor.execute(stmt, (username,))
    data = await cursor.fetchone()
    if data is None:
        return None
    return data.get("hash")


async def get_user(username: str, cursor: Cursor):
    stmt = "SELECT id, username FROM user WHERE username = %s"
    await cursor.execute(stmt, (username,))
    return await cursor.fetchone()


async def verify_user_credentials(username: str, password: str, cursor: Cursor):
    hash = await get_user_hash(username, cursor)
    if hash is None:
        raise CredentialsError

    if not verify_password(password, hash):
        raise CredentialsError


async def get_user_from_refresh_token(
    token: str | None, cursor: Cursor, config: Config
) -> User:
    if token is None:
        raise TokenIsMissingError

    username = decode_refresh_token(token, key=config.refresh_secret_key)
    if username is None:
        raise InvalidTokenPayloadKeysError

    user = await get_user(username, cursor)
    if user is None:
        raise InvalidTokenPayloadValuesError

    return User(**user)
