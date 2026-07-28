import bcrypt

from app.config.mongodb import user_collection


def register_user(username: str, password: str):

    existing_user = user_collection.find_one({
        "username": username
    })

    if existing_user:
        raise ValueError("이미 존재하는 사용자입니다.")

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user_collection.insert_one({
        "username": username,
        "password_hash": password_hash,
        "created_at": datetime.now()
    })

    return {
        "message": "회원가입 성공"
    }
import os
import jwt

from datetime import datetime, timedelta, timezone


def create_access_token(username: str):

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
        )
    )

    payload = {
        "sub": username,
        "exp": expire
    }

    return jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm=os.getenv("JWT_ALGORITHM")
    )
import uuid

from app.config.redis import redis_client


def login_user(username: str, password: str):

    user = user_collection.find_one({
        "username": username
    })

    if not user:
        raise ValueError("사용자가 존재하지 않습니다.")

    password_valid = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not password_valid:
        raise ValueError("비밀번호가 일치하지 않습니다.")

    access_token = create_access_token(username)

    refresh_token = str(uuid.uuid4())

    redis_client.set(
        f"refresh:{refresh_token}",
        username,
        ex=int(os.getenv("REFRESH_TOKEN_EXPIRE_SECONDS"))
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }