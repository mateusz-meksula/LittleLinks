from typing import Generator

import httpx
from fastapi.testclient import TestClient
from httpx import Request, Response


class JwtAuth(httpx.Auth):
    requires_request_body = True

    def __init__(self, client: TestClient):
        self.client = client

    def auth_flow(self, request: Request) -> Generator[Request, Response, None]:
        access_token = self.get_access_token_request()
        request.headers["Authorization"] = f"Bearer {access_token}"
        yield request

    def get_access_token_request(self) -> str:
        response = self.client.post(
            url="/auth/login",
            data={"username": "test_01", "password": "securePassword123!"},
        )
        data = response.json()
        return data["token"]


def test_create_link(client: TestClient):
    response = client.post(
        "/links",
        json={"url": "https://www.test.com?test=yes"},
    )
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": 1}


def test_get_link(client: TestClient):
    response = client.get("/links/1")
    data = response.json()

    assert response.status_code == 200
    assert "endpoint" in data
    assert "created" in data
    endpoint = data.pop("endpoint")
    data.pop("created")
    assert data == {
        "id": 1,
        "user_id": None,
        "url": "https://www.test.com?test=yes",
        "visit_count": 0,
        "modified": None,
    }

    assert len(endpoint) == 5


def test_create_link_with_user(client: TestClient):
    response = client.post(
        "/links",
        json={"url": "https://www.test2.com?test=no"},
        auth=JwtAuth(client),
    )
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": 2}
