from dataclasses import dataclass

from rest_framework.authentication import (
    BaseAuthentication,
    get_authorization_header,
)
from rest_framework.exceptions import (
    AuthenticationFailed,
)

from common.jwt import (
    TokenException,
    decode_token,
)


@dataclass
class AuthenticatedUser:
    userId: str
    username: str
    email: str = ""

    @property
    def is_authenticated(self) -> bool:
        return True


class JWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        authorization = (
            get_authorization_header(
                request
            ).decode("utf-8")
        )

        if not authorization:
            return None

        parts = authorization.split()

        if (
            len(parts) != 2
            or parts[0] != self.keyword
        ):
            raise AuthenticationFailed(
                "Authorization 형식은 "
                "Bearer <token>입니다."
            )

        token = parts[1]

        try:
            payload = decode_token(
                token,
                "access",
            )

        except TokenException as error:
            raise AuthenticationFailed(
                str(error)
            ) from error

        user = AuthenticatedUser(
            userId=payload["sub"],
            username=payload.get(
                "username",
                "",
            ),
            email=payload.get(
                "email",
                "",
            ),
        )

        return user, payload