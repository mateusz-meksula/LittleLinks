from typing import Any

from fastapi import Depends
from mysql.connector.aio import connect
from mysql.connector.aio.cursor import MySQLCursorDict

from .config import Config, get_config


class Cursor(MySQLCursorDict):
    async def fetchone(
        self,
    ) -> dict[str, Any] | None:
        return await super().fetchone()

    async def fetchall(
        self,
    ) -> list[dict[str, Any] | None]:
        return await super().fetchall()


async def get_cursor(config: Config = Depends(get_config)):
    async with await connect(
        host=config.db_host,
        port=config.db_port,
        user=config.db_user,
        password=config.db_password,
        database=config.db_name,
    ) as cnx:
        async with await cnx.cursor(dictionary=True) as cursor:
            yield cursor
            await cnx.commit()
