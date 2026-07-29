from rest_framework import serializers


class CypherExecuteSerializer(
    serializers.Serializer
):
    query = serializers.CharField()

    parameters = serializers.DictField(
        required=False,
        default=dict,
    )