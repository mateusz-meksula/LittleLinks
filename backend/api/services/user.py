from fastapi import HTTPException, status
from mysql.connector import IntegrityError

from ..auth import get_password_hash
from ..database import Cursor


class UsernameAlreadyTakenError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )


async def create_user(
    cursor: Cursor, *, username: str, password: str
) -> dict[str, int]:
    hash = get_password_hash(password)
    stmt = "INSERT INTO user (username, hash) VALUES (%s, %s)"

    try:
        await cursor.execute(stmt, (username, hash))
    except IntegrityError:
        raise UsernameAlreadyTakenError

    user_id = cursor.lastrowid
    assert user_id

    return {"id": user_id}
