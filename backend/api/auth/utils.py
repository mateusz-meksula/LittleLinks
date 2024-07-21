from typing import NamedTuple, NotRequired, TypedDict

import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenPayload(TypedDict):
    sub: str
    expires: NotRequired[str]


class DecodedPayload(NamedTuple):
    username: str | None
    expires: str | None


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
