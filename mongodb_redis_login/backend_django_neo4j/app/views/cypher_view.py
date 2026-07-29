from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.schemas.cypher_schema import (
    CypherExecuteSerializer,
)
from app.services.cypher_service import (
    execute_cypher,
)


@api_view(["POST"])
@permission_classes([IsAuthenticatedUser])
def cypher_execute(request):
    serializer = CypherExecuteSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    result = execute_cypher(
        query=serializer.validated_data[
            "query"
        ],
        parameters=serializer.validated_data[
            "parameters"
        ],
    )

    return Response(result)