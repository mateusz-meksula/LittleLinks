from ..auth import get_password_hash
from ..database import Cursor


async def create_user(
    cursor: Cursor, *, username: str, password: str
) -> dict[str, int]:
    hash = get_password_hash(password)

    stmt = "INSERT INTO user (username, hash) VALUES (%s, %s)"
    await cursor.execute(stmt, (username, hash))

    user_id = cursor.lastrowid
    if user_id is None:
        raise ValueError

    return {"id": user_id}
