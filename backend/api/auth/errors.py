from fastapi import HTTPException, status


class AuthError(HTTPException):
    detail: str

    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=self.detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class CredentialsError(AuthError):
    detail = "Incorrect username or password"


class InvalidTokenPayloadKeysError(AuthError):
    detail = "Invalid access token payload"


class InvalidTokenPayloadValuesError(AuthError):
    detail = "Could not validate credentials"


class TokenExpiredError(AuthError):
    detail = "Access token has expired"


class TokenIsMissingError(AuthError):
    detail = "Not authenticated"
