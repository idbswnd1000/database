from app.repositories.auth_repository import (
    create_constraints,
)
from common.neo4j import (
    close_connection,
    verify_connection,
)


def main():
    try:
        verify_connection()
        print("Neo4j 연결 성공")

        create_constraints()
        print("User 제약조건 생성 완료")

    finally:
        close_connection()


if __name__ == "__main__":
    main()