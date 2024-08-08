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

    stmt = "INSERT INTO user (username, hash) VALUES (%s, %s)"
    cursor.execute(
        stmt,
        (
            "test_01",
            # securePassword123!
            "$2b$12$uHTW0asqFEr/XM9y9Y2vuemkylVa3t2aYchheMPcUZaqxErJ/MxxS",
        ),
    )
    connection.commit()

    stmt = """
    CREATE TABLE link (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id SMALLINT UNSIGNED,
        url varchar(250) NOT NULL,
        endpoint varchar(5) UNIQUE NOT NULL,
        visit_count SMALLINT NOT NULL DEFAULT 0,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user (id),
        INDEX idx_endpoint (endpoint)
    );
    """
    cursor.execute(stmt)
    connection.commit()

    cursor.close()

    yield

    cursor = connection.cursor()

    stmt = "DROP TABLE link;"
    cursor.execute(stmt)
    connection.commit()

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
