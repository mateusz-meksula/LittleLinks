import random
import string

from fastapi import HTTPException
from mysql.connector import IntegrityError

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


class LinkAliasAlreadyTakenError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail={
                "field": "alias",
                "message": "alias already taken",
            },
        )


async def create_link(
    cursor: Cursor,
    *,
    link: LinkCreate,
    user_id: int | None = None,
) -> dict[str, int]:
    if link.alias and not user_id:
        raise LinkAliasInNotAuthenticatedRequestError

    alias = link.alias or await generate_unique_alias(cursor)
    stmt = "INSERT INTO link (user_id, url, alias) VALUES (%s, %s, %s)"

    try:
        await cursor.execute(stmt, (user_id, link.url, alias))
    except IntegrityError:
        raise LinkAliasAlreadyTakenError

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


async def alias_exist(cursor: Cursor, alias: str) -> bool:
    stmt = "SELECT (alias) FROM link WHERE alias = %s"
    await cursor.execute(stmt, (alias,))
    result = await cursor.fetchone()
    return result is not None


def generate_alias() -> str:
    return "".join(random.choice(string.ascii_letters) for _ in range(5))


async def generate_unique_alias(cursor: Cursor) -> str:
    while True:
        alias = generate_alias()
        if not await alias_exist(cursor, alias):
            break
    return alias
