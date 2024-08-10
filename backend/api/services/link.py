import random
import string

from fastapi import HTTPException

from ..database import Cursor
from ..schemas.link import LinkCreate, LinkRead


class LinkNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Little Link not found",
        )


class LinkAliasInNotAuthenticatedRequestError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="Alias is only for authenticated users",
        )


async def create_link(
    cursor: Cursor,
    *,
    link: LinkCreate,
    user_id: int | None = None,
) -> dict[str, int]:
    if link.alias and not user_id:
        raise LinkAliasInNotAuthenticatedRequestError

    endpoint = link.alias or await generate_unique_endpoint(cursor)
    stmt = "INSERT INTO link (user_id, url, endpoint) VALUES (%s, %s, %s)"

    await cursor.execute(stmt, (user_id, link.url, endpoint))

    link_id = cursor.lastrowid
    assert link_id

    return {"id": link_id}


async def get_link(
    cursor: Cursor,
    link_id: int,
    user_id: int | None = None,
):
    stmt = "SELECT * FROM link WHERE id = %s"
    params = [link_id]
    if user_id is not None:
        stmt += " AND user_id = %s"
        params.append(user_id)

    await cursor.execute(stmt, params)
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
