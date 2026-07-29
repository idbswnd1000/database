from typing import Any

from common.neo4j import execute_query


def create_constraints() -> None:
    queries = [
        """
        CREATE CONSTRAINT user_id_unique
        IF NOT EXISTS
        FOR (user:User)
        REQUIRE user.userId IS UNIQUE
        """,
        """
        CREATE CONSTRAINT username_unique
        IF NOT EXISTS
        FOR (user:User)
        REQUIRE user.username IS UNIQUE
        """,
        """
        CREATE CONSTRAINT user_email_unique
        IF NOT EXISTS
        FOR (user:User)
        REQUIRE user.email IS UNIQUE
        """,
    ]

    for query in queries:
        execute_query(query)


def find_by_username(
    username: str,
) -> dict[str, Any] | None:
    records = execute_query(
        """
        MATCH (user:User {
            username: $username
        })
        RETURN user{.*} AS user
        LIMIT 1
        """,
        {
            "username": username,
        },
    )

    return (
        records[0]["user"]
        if records
        else None
    )


def find_by_email(
    email: str,
) -> dict[str, Any] | None:
    records = execute_query(
        """
        MATCH (user:User {
            email: $email
        })
        RETURN user{.*} AS user
        LIMIT 1
        """,
        {
            "email": email,
        },
    )

    return (
        records[0]["user"]
        if records
        else None
    )


def find_by_id(
    user_id: str,
) -> dict[str, Any] | None:
    records = execute_query(
        """
        MATCH (user:User {
            userId: $userId
        })
        RETURN user{.*} AS user
        LIMIT 1
        """,
        {
            "userId": user_id,
        },
    )

    return (
        records[0]["user"]
        if records
        else None
    )


def create_user(
    user_id: str,
    username: str,
    email: str,
    password_hash: str,
) -> dict[str, Any]:
    records = execute_query(
        """
        CREATE (user:User {
            userId: $userId,
            username: $username,
            email: $email,
            password: $password,
            isActive: true,
            createdAt: datetime(),
            updatedAt: datetime()
        })
        RETURN user{.*} AS user
        """,
        {
            "userId": user_id,
            "username": username,
            "email": email,
            "password": password_hash,
        },
    )

    return records[0]["user"]