import random
import string

from fastapi import HTTPException

from ..database import Cursor
from ..schemas.link import LinkRead


class LinkNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Little Link not found",
        )


async def create_link(
    cursor: Cursor,
    *,
    url: str,
    user_id: int | None = None,
) -> dict[str, int]:
    endpoint = await generate_unique_endpoint(cursor)
    stmt = "INSERT INTO link (user_id, url, endpoint) VALUES (%s, %s, %s)"

    await cursor.execute(stmt, (user_id, url, endpoint))

    link_id = cursor.lastrowid
    assert link_id

    return {"id": link_id}


async def get_link(
    cursor: Cursor,
    link_id: int,
):
    stmt = "SELECT * FROM link WHERE id = %s"
    await cursor.execute(stmt, (link_id,))
    link_data = await cursor.fetchone()
    if link_data is None:
        raise LinkNotFoundError

    return LinkRead(**link_data)


async def endpoint_exist(cursor: Cursor, endpoint: str) -> bool:
    stmt = "SELECT (endpoint) FROM link WHERE endpoint = %s"
    await cursor.execute(stmt, (endpoint,))
    result = await cursor.fetchone()
    return result is not None


def generate_endpoint() -> str:
    return "".join(random.choice(string.ascii_letters) for _ in range(5))


async def generate_unique_endpoint(cursor: Cursor) -> str:
    while True:
        endpoint = generate_endpoint()
        if not await endpoint_exist(cursor, endpoint):
            break
    return endpoint
