import re

from fastapi.testclient import TestClient

CREDENTIALS = {
    "username": "test_01",
    "password": "securePassword123!",
}


def test_sign_up(client: TestClient):
    response = client.post("/users", json=CREDENTIALS)
    data = response.json()

    assert response.status_code == 201
    assert data == {"id": 1}


def test_login_then_logout(client: TestClient):
    response = client.post("/auth/login", data=CREDENTIALS)
    data = response.json()

    assert response.status_code == 200
    assert "token" in data
    assert "type" in data
    assert "expires" in data

    refresh_token_header = response.headers.get("set-cookie")
    assert refresh_token_header is not None

    refresh_token_present = re.search(r"refreshToken=([^;]+)", refresh_token_header)
    assert refresh_token_present

    max_age = re.search(r"Max-Age=([^;]+)", refresh_token_header)
    assert max_age
    assert int(max_age.group(1)) == 3600 * 24 * 30

    assert "HttpOnly" in refresh_token_header

    refresh_token = refresh_token_present.group(1)
    logout_response = client.get(
        "/auth/logout", cookies={"refreshToken": refresh_token}
    )

    assert logout_response.status_code == 200
    refresh_token_header = logout_response.headers.get("set-cookie")
    assert refresh_token_header is not None
    max_age = re.search(r"Max-Age=([^;]+)", refresh_token_header)
    assert max_age
    assert int(max_age.group(1)) == 0
    assert "HttpOnly" in refresh_token_header
