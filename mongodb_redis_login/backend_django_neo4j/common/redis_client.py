import os

import redis
from dotenv import load_dotenv

load_dotenv()

redis_client = redis.Redis(
    host=os.getenv(
        "REDIS_HOST",
        "localhost",
    ),
    port=int(
        os.getenv(
            "REDIS_PORT",
            "6379",
        )
    ),
    password=os.getenv(
        "REDIS_PASSWORD"
    ) or None,
    db=int(
        os.getenv(
            "REDIS_DB",
            "0",
        )
    ),
    decode_responses=True,
)


def verify_connection() -> bool:
    return bool(redis_client.ping())


def save_refresh_token(
    user_id: str,
    token_id: str,
    refresh_token: str,
    expires_seconds: int,
) -> None:
    redis_client.setex(
        name=f"refresh:{user_id}:{token_id}",
        time=expires_seconds,
        value=refresh_token,
    )


def get_refresh_token(
    user_id: str,
    token_id: str,
) -> str | None:
    return redis_client.get(
        f"refresh:{user_id}:{token_id}"
    )


def delete_refresh_token(
    user_id: str,
    token_id: str,
) -> int:
    return int(
        redis_client.delete(
            f"refresh:{user_id}:{token_id}"
        )
    )


def delete_all_refresh_tokens(
    user_id: str,
) -> int:
    keys = list(
        redis_client.scan_iter(
            match=f"refresh:{user_id}:*"
        )
    )

    if not keys:
        return 0

    return int(
        redis_client.delete(*keys)
    )