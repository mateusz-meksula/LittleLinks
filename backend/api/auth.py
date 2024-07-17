from typing import Annotated

import jwt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel

from .config import Config, get_config
from .database import Cursor, get_cursor

ALGORITHM = "HS256"
REFRESH_TOKEN_LIFETIME = 3600 * 24 * 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["auth"])


class AccessToken(BaseModel):
    value: str
    type: str
    # expires: datetime TODO


class User(BaseModel):
    id: int
    username: str


class CredentialsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


class TokenCredentialsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_token(payload: dict, *, key: str) -> str:
    # TODO expiration logic
    return jwt.encode(payload, key, ALGORITHM)


def decode_token(token: str, *, key: str) -> str | None:
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
    username = decode_token(token, key=config.secret_key)
    if username is None:
        raise TokenCredentialsError

    user = await get_user(username, cursor)
    if user is None:
        raise TokenCredentialsError

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

    access_token = create_token({"sub": username}, key=config.secret_key)
    refresh_token = create_token({"sub": username}, key=config.refresh_secret_key)

    response.set_cookie(
        "refreshToken",
        refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_LIFETIME,
    )
    return AccessToken(value=access_token, type="Bearer")


@router.get("/refresh")
async def refresh_access_token(
    refreshToken: Annotated[str | None, Cookie()],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
):
    if refreshToken is None:
        raise TokenCredentialsError

    username = decode_token(refreshToken, key=config.refresh_secret_key)
    if username is None:
        raise TokenCredentialsError

    user = await get_user(username, cursor)
    if user is None:
        raise CredentialsError

    access_token = create_token({"sub": username}, key=config.secret_key)
    return AccessToken(value=access_token, type="Bearer")


@router.get("/logout", dependencies=[Depends(get_current_user)])
async def logout(response: Response):
    response.delete_cookie("refreshToken", httponly=True)
