import os
import redis
import uuid

from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)

users = [
    {"id": "admin", "password_hash": "1234"},
    {"id": "admin1", "password_hash": "1234"},
    {"id": "admin2", "password_hash": "1234"},
    {"id": "user1", "password_hash": "1111"},
    {"id": "user2", "password_hash": "2222"},
]

for user in users:
    user_key = f"user:{user['id']}"

    r.hset(
        user_key,
        mapping={
            "id": user["id"],
            "password_hash": user["password_hash"],
            "created_at": datetime.now().isoformat()
        }
    )

print("사용자 등록 완료")