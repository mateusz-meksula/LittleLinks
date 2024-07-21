from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from ..config import Config, get_config
from ..database import Cursor, get_cursor
from .dependencies import get_current_user
from .models import AccessToken, User
from .services import get_user_from_refresh_token, verify_user_credentials
from .utils import create_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
) -> AccessToken:
    username = form_data.username
    password = form_data.password
    await verify_user_credentials(username, password, cursor)

    expire_date = datetime.now() + config.access_token_lifetime
    access_token = create_token(
        {"sub": username, "expires": expire_date.isoformat()}, key=config.secret_key
    )
    refresh_token = create_token({"sub": username}, key=config.refresh_secret_key)

    response.set_cookie(
        "refreshToken",
        refresh_token,
        httponly=True,
        max_age=config.refresh_token_lifetime,
    )
    return AccessToken(token=access_token, type="Bearer", expires=expire_date)


@router.get("/refresh")
async def refresh_access_token(
    refreshToken: Annotated[str | None, Cookie()],
    config: Annotated[Config, Depends(get_config)],
    cursor: Annotated[Cursor, Depends(get_cursor)],
) -> AccessToken:
    user = await get_user_from_refresh_token(refreshToken, cursor, config)

    expire_date = datetime.now() + config.access_token_lifetime
    access_token = create_token({"sub": user.username}, key=config.secret_key)
    return AccessToken(token=access_token, type="Bearer", expires=expire_date)


@router.get("/logout")
async def logout(
    response: Response,
    refreshToken: Annotated[str | None, Cookie()],
    cursor: Annotated[Cursor, Depends(get_cursor)],
    config: Annotated[Config, Depends(get_config)],
) -> None:
    await get_user_from_refresh_token(refreshToken, cursor, config)
    response.delete_cookie("refreshToken", httponly=True)


@router.get("/me")
async def get_current_user_info(user: Annotated[User, Depends(get_current_user)]):
    return user
