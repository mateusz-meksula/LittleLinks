from fastapi import Depends
from mysql.connector.aio import connect

from .config import Config, get_config


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
