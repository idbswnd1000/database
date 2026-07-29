def parse_limit(
    value,
    default: int = 100,
    maximum: int = 500,
) -> int:
    try:
        parsed = int(value)

    except (
        TypeError,
        ValueError,
    ):
        parsed = default

    return max(
        1,
        min(parsed, maximum),
    )