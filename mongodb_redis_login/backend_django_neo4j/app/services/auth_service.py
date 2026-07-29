import uuid

from django.contrib.auth.hashers import (
    check_password,
    make_password,
)
from rest_framework.exceptions import (
    AuthenticationFailed,
    ValidationError,
)

from app.repositories import (
    auth_repository,
)
from common.jwt import (
    TokenException,
    create_access_token,
    create_refresh_token,
    decode_token,
    refresh_expiration_seconds,
)
from common.redis_client import (
    delete_refresh_token,
    get_refresh_token,
    save_refresh_token,
)


def convert_public_user(
    user: dict,
) -> dict:
    return {
        "userId": user["userId"],
        "username": user["username"],
        "email": user.get("email", ""),
    }


def register_user(
    data: dict,
) -> dict:
    username = data["username"].strip()
    email = data["email"].strip().lower()
    password = data["password"]

    if auth_repository.find_by_username(
        username
    ):
        raise ValidationError({
            "username": (
                "이미 사용 중인 아이디입니다."
            )
        })

    if auth_repository.find_by_email(email):
        raise ValidationError({
            "email": (
                "이미 사용 중인 이메일입니다."
            )
        })

    user = auth_repository.create_user(
        user_id=str(uuid.uuid4()),
        username=username,
        email=email,
        password_hash=make_password(
            password
        ),
    )

    return convert_public_user(user)


def login_user(
    data: dict,
) -> dict:
    user = auth_repository.find_by_username(
        data["username"].strip()
    )

    if not user:
        raise AuthenticationFailed(
            "아이디 또는 비밀번호가 "
            "올바르지 않습니다."
        )

    if not check_password(
        data["password"],
        user["password"],
    ):
        raise AuthenticationFailed(
            "아이디 또는 비밀번호가 "
            "올바르지 않습니다."
        )

    if not user.get("isActive", True):
        raise AuthenticationFailed(
            "비활성화된 사용자입니다."
        )

    access_token = create_access_token(user)

    refresh_token, token_id = (
        create_refresh_token(user)
    )

    save_refresh_token(
        user_id=user["userId"],
        token_id=token_id,
        refresh_token=refresh_token,
        expires_seconds=(
            refresh_expiration_seconds()
        ),
    )

    return {
        "access": access_token,
        "refresh": refresh_token,
        "user": convert_public_user(user),
    }


def refresh_access_token(
    refresh_token: str,
) -> dict:
    try:
        payload = decode_token(
            refresh_token,
            "refresh",
        )

    except TokenException as error:
        raise AuthenticationFailed(
            str(error)
        ) from error

    user_id = payload["sub"]
    token_id = payload["jti"]

    saved_token = get_refresh_token(
        user_id,
        token_id,
    )

    if (
        not saved_token
        or saved_token != refresh_token
    ):
        raise AuthenticationFailed(
            "로그아웃되었거나 "
            "폐기된 토큰입니다."
        )

    user = auth_repository.find_by_id(
        user_id
    )

    if not user:
        raise AuthenticationFailed(
            "사용자를 찾을 수 없습니다."
        )

    return {
        "access": create_access_token(
            user
        )
    }


def logout_user(
    refresh_token: str,
) -> None:
    try:
        payload = decode_token(
            refresh_token,
            "refresh",
        )

    except TokenException as error:
        raise AuthenticationFailed(
            str(error)
        ) from error

    delete_refresh_token(
        payload["sub"],
        payload["jti"],
    )


def get_current_user(
    user_id: str,
) -> dict:
    user = auth_repository.find_by_id(
        user_id
    )

    if not user:
        raise AuthenticationFailed(
            "사용자를 찾을 수 없습니다."
        )

    return convert_public_user(user)