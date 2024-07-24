import random
import string

from ..database import Cursor


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
