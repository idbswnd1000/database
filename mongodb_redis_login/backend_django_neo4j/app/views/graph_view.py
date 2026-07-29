from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.services.graph_service import (
    get_overview_graph,
)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def overview_graph(request):
    limit = min(
        int(request.query_params.get(
            "limit",
            100,
        )),
        500,
    )

    return Response(
        get_overview_graph(limit)
    )