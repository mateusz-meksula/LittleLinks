from dataclasses import dataclass, field
from typing import Generator

import httpx
import pytest
from fastapi.testclient import TestClient
from httpx import Request, Response


class JwtAuth(httpx.Auth):
    requires_request_body = True

    def __init__(self, client: TestClient, credentials: dict[str, str]):
        self.client = client
        self.credentials = credentials

    def auth_flow(self, request: Request) -> Generator[Request, Response, None]:
        access_token = self.get_access_token_request()
        request.headers["Authorization"] = f"Bearer {access_token}"
        yield request

    def get_access_token_request(self) -> str:
        response = self.client.post(
            url="/auth/login",
            data=self.credentials,
        )
        data = response.json()
        return data["token"]


@dataclass
class LinkTestData:
    url: str
    id: int
    credentials: dict[str, str] = field(default_factory=dict)
    alias: str = ""
    user_id: int = 0


@pytest.fixture
def link_test_data():
    return LinkTestData(
        url="https://www.test.com?test=yes",
        id=1,
    )


def test_create_link(client: TestClient, link_test_data: LinkTestData):
    response = client.post(
        "/links",
        json={"url": link_test_data.url},
    )
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": link_test_data.id}


def test_get_link(client: TestClient, link_test_data: LinkTestData):
    response = client.get(f"/links/{link_test_data.id}")
    data = response.json()

    assert response.status_code == 200
    assert "alias" in data
    assert "created" in data
    alias = data.pop("alias")
    data.pop("created")
    assert data == {
        "id": link_test_data.id,
        "user_id": None,
        "url": link_test_data.url,
        "visit_count": 0,
        "modified": None,
    }

    assert len(alias) == 5


@pytest.fixture
def link_test_data_with_user():
    return LinkTestData(
        credentials={"username": "test_01", "password": "securePassword123!"},
        url="https://www.test2.com?test=no",
        id=2,
        user_id=1,
    )


def test_create_link_with_user(
    client: TestClient, link_test_data_with_user: LinkTestData
):
    response = client.post(
        "/links",
        json={"url": link_test_data_with_user.url},
        auth=JwtAuth(client, link_test_data_with_user.credentials),
    )
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": link_test_data_with_user.id}


def test_get_user_link(client: TestClient, link_test_data_with_user: LinkTestData):
    response = client.get(
        f"/links/{link_test_data_with_user.id}",
        auth=JwtAuth(client, link_test_data_with_user.credentials),
    )
    data = response.json()

    assert response.status_code == 200
    alias = data.pop("alias")
    data.pop("created")
    assert data == {
        "id": link_test_data_with_user.id,
        "user_id": link_test_data_with_user.user_id,
        "url": link_test_data_with_user.url,
        "visit_count": 0,
        "modified": None,
    }

    assert len(alias) == 5


@pytest.fixture
def link_test_data_with_alias():
    return LinkTestData(
        credentials={"username": "test_01", "password": "securePassword123!"},
        url="https://www.test3.com?test=maybe",
        id=3,
        user_id=1,
        alias="abcAB",
    )


def test_create_link_with_alias(
    client: TestClient, link_test_data_with_alias: LinkTestData
):
    response = client.post(
        "/links",
        json={
            "url": link_test_data_with_alias.url,
            "alias": link_test_data_with_alias.alias,
        },
        auth=JwtAuth(client, link_test_data_with_alias.credentials),
    )
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": link_test_data_with_alias.id}


def test_get_link_with_alias(
    client: TestClient, link_test_data_with_alias: LinkTestData
):
    response = client.get(
        f"/links/{link_test_data_with_alias.id}",
        auth=JwtAuth(client, link_test_data_with_alias.credentials),
    )
    data = response.json()

    assert response.status_code == 200
    data.pop("created")
    assert data == {
        "id": link_test_data_with_alias.id,
        "user_id": link_test_data_with_alias.user_id,
        "url": link_test_data_with_alias.url,
        "alias": link_test_data_with_alias.alias,
        "visit_count": 0,
        "modified": None,
    }
