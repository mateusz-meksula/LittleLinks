from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from mysql.connector import connect

from ..config import get_config
from ..main import app
from .commons import DB_NAME, DB_PASSWORD, DB_PORT, DB_USER


class MockConfig:
    def __init__(self) -> None:
        self.secret_key = "secret"
        self.refresh_secret_key = "refresh_secret"
        self.db_host = "localhost"
        self.db_port = DB_PORT
        self.db_user = DB_USER
        self.db_password = DB_PASSWORD
        self.db_name = DB_NAME
        self.access_token_lifetime = timedelta(minutes=15)
        self.refresh_token_lifetime = 3600 * 24 * 30


@pytest.fixture(scope="session", autouse=True)
def populate_database():
    config = MockConfig()
    connection = connect(
        host=config.db_host,
        port=config.db_port,
        user=config.db_user,
        password=config.db_password,
        database=config.db_name,
    )
    cursor = connection.cursor()

    stmt = """
    CREATE TABLE user (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
        username varchar(20) UNIQUE NOT NULL,
        hash varchar(60) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id)
    );
    """
    cursor.execute(stmt)
    connection.commit()
    cursor.close()

    yield

    cursor = connection.cursor()
    stmt = "DROP TABLE user;"
    cursor.execute(stmt)
    connection.commit()
    cursor.close()
    connection.close()


@pytest.fixture(name="client")
def client_fixture():
    def get_mock_config():
        return MockConfig()

    app.dependency_overrides[get_config] = get_mock_config
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()