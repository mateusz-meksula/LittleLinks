from datetime import datetime, timedelta
from typing import Annotated, NamedTuple, NotRequired, TypedDict

import jwt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel

from .config import Config, get_config
from .database import Cursor, get_cursor

ALGORITHM = "HS256"
ACCESS_TOKEN_LIFETIME = timedelta(minutes=15)
REFRESH_TOKEN_LIFETIME = 3600 * 24 * 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["auth"])


class AccessToken(BaseModel):
    token: str
    type: str
    expires: datetime


class User(BaseModel):
    id: int
    username: str


class TokenPayload(TypedDict):
    sub: str
    expires: NotRequired[str]


class DecodedPayload(NamedTuple):
    username: str | None
    expires: str | None


class AuthError(HTTPException):
    detail: str

    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=self.detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class CredentialsError(AuthError):
    detail = "Incorrect username or password"


class TokenCredentialsError(AuthError):
    detail = "Could not validate credentials"


class TokenExpiredError(AuthError):
    detail = "Access token has expired"


class InvalidTokenPayloadError(AuthError):
    detail = "Invalid access token payload"


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_token(payload: TokenPayload, *, key: str) -> str:
    to_encode = dict(payload.copy())
    return jwt.encode(to_encode, key, ALGORITHM)


def decode_access_token(token: str, *, key: str) -> DecodedPayload:
    try:
        payload = jwt.decode(token, key, [ALGORITHM])
    except InvalidTokenError:
        return DecodedPayload(None, None)

    return DecodedPayload(payload.get("sub"), payload.get("expires"))


def decode_refresh_token(token: str, *, key: str) -> str | None:
    try:
        payload = jwt.decode(token, key, [ALGORITHM])
    except InvalidTokenError:
        return None

    return payload.get("sub")


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


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
):
    username, expires = decode_access_token(token, key=config.secret_key)
    if not username or not expires:
        raise InvalidTokenPayloadError

    user = await get_user(username, cursor)
    if user is None:
        raise TokenCredentialsError

    try:
        expire_date = datetime.fromisoformat(expires)
    except ValueError:
        raise InvalidTokenPayloadError

    if datetime.now() > expire_date:
        raise TokenExpiredError

    return User(**user)


@router.post("/login")
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
) -> AccessToken:
    username = form_data.username
    password = form_data.password
    hash = await get_user_hash(username, cursor)
    if hash is None:
        raise CredentialsError

    if not verify_password(password, hash):
        raise CredentialsError

    expire_date = datetime.now() + ACCESS_TOKEN_LIFETIME
    access_token = create_token(
        {"sub": username, "expires": expire_date.isoformat()}, key=config.secret_key
    )
    refresh_token = create_token({"sub": username}, key=config.refresh_secret_key)

    response.set_cookie(
        "refreshToken",
        refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_LIFETIME,
    )
    return AccessToken(token=access_token, type="Bearer", expires=expire_date)


@router.get("/refresh")
async def refresh_access_token(
    refreshToken: Annotated[str | None, Cookie()],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
) -> AccessToken:
    if refreshToken is None:
        raise TokenCredentialsError

    username = decode_refresh_token(refreshToken, key=config.refresh_secret_key)
    if username is None:
        raise TokenCredentialsError

    user = await get_user(username, cursor)
    if user is None:
        raise CredentialsError

    expire_date = datetime.now() + ACCESS_TOKEN_LIFETIME
    access_token = create_token({"sub": username}, key=config.secret_key)
    return AccessToken(token=access_token, type="Bearer", expires=expire_date)


@router.get("/logout")
async def logout(
    response: Response,
    refreshToken: Annotated[str | None, Cookie()],
    cursor: Annotated[Cursor, Depends(get_cursor)],
    config: Annotated[Config, Depends(get_config)],
) -> None:
    if refreshToken is None:
        raise TokenCredentialsError

    username = decode_refresh_token(refreshToken, key=config.refresh_secret_key)
    if username is None:
        raise TokenCredentialsError

    user = await get_user(username, cursor)
    if user is None:
        raise CredentialsError

    response.delete_cookie("refreshToken", httponly=True)
