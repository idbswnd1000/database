import os
import uuid

import bcrypt

from common.mongodb import user_collection
from common.redis_client import redis_client
from common.jwt import create_access_token


def register_user(
    username: str,
    password: str
):

    existing_user = user_collection.find_one(
        {
            "username": username
        }
    )

    if existing_user:
        raise ValueError(
            "이미 존재하는 사용자입니다."
        )

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user_collection.insert_one(
        {
            "username": username,
            "password_hash": password_hash
        }
    )

    return {
        "message": "회원가입 성공"
    }


def login_user(
    username: str,
    password: str
):

    user = user_collection.find_one(
        {
            "username": username
        }
    )

    if not user:
        raise ValueError(
            "사용자가 존재하지 않습니다."
        )

    valid = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not valid:
        raise ValueError(
            "비밀번호가 일치하지 않습니다."
        )

    access_token = create_access_token(
        username
    )

    refresh_token = str(
        uuid.uuid4()
    )

    redis_client.set(
        f"refresh:{refresh_token}",
        username,
        ex=int(
            os.getenv(
                "REFRESH_TOKEN_EXPIRE_SECONDS",
                604800
            )
        )
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


def logout_user(refresh_token: str):

    redis_client.delete(
        f"refresh:{refresh_token}"
    )

    return {
        "message": "로그아웃 성공"
    }


def refresh_access_token(
    refresh_token: str
):

    username = redis_client.get(
        f"refresh:{refresh_token}"
    )

    if not username:
        raise ValueError(
            "Refresh Token이 만료되었거나 유효하지 않습니다."
        )

    return {
        "access_token":
            create_access_token(username)
    }