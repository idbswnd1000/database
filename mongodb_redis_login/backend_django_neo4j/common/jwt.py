import os
import uuid
from datetime import (
    datetime,
    timedelta,
    timezone,
)
from typing import Any

import jwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "jwt-development-secret-key",
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256",
)

ACCESS_TOKEN_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_MINUTES",
        "30",
    )
)

REFRESH_TOKEN_DAYS = int(
    os.getenv(
        "REFRESH_TOKEN_DAYS",
        "7",
    )
)


class TokenException(Exception):
    pass


def create_token(
    user: dict[str, Any],
    token_type: str,
    expires_delta: timedelta,
    token_id: str | None = None,
) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": user["userId"],
        "username": user["username"],
        "email": user.get("email", ""),
        "type": token_type,
        "jti": token_id or str(uuid.uuid4()),
        "iat": now,
        "exp": now + expires_delta,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def create_access_token(
    user: dict[str, Any],
) -> str:
    return create_token(
        user=user,
        token_type="access",
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_MINUTES
        ),
    )


def create_refresh_token(
    user: dict[str, Any],
) -> tuple[str, str]:
    token_id = str(uuid.uuid4())

    refresh_token = create_token(
        user=user,
        token_type="refresh",
        expires_delta=timedelta(
            days=REFRESH_TOKEN_DAYS
        ),
        token_id=token_id,
    )

    return refresh_token, token_id


def decode_token(
    token: str,
    expected_type: str,
) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

    except jwt.ExpiredSignatureError as error:
        raise TokenException(
            "토큰이 만료되었습니다."
        ) from error

    except jwt.InvalidTokenError as error:
        raise TokenException(
            "유효하지 않은 토큰입니다."
        ) from error

    if payload.get("type") != expected_type:
        raise TokenException(
            f"{expected_type} 토큰이 아닙니다."
        )

    if not payload.get("sub"):
        raise TokenException(
            "사용자 정보가 없는 토큰입니다."
        )

    return payload


def refresh_expiration_seconds() -> int:
    return (
        REFRESH_TOKEN_DAYS
        * 24
        * 60
        * 60
    )