import mimetypes
from pathlib import Path

import requests

url = "http://localhost:5678/webhook/plate_detect"
image_path = Path("./data/자동차번호판.jpeg")

try:
    if not image_path.exists():
        raise FileNotFoundError(f"이미지 파일이 없습니다: {image_path.resolve()}")

    mime_type = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"

    with image_path.open("rb") as f:
        response = requests.post(
            url,
            files={
                "data": (
                    "자동차번호판.jpeg",
                    f,
                    "image/jpeg"
                )
            },
            timeout=60,
        )

    print("상태 코드:", response.status_code)

    try:
        print("응답 JSON:", response.json())
    except requests.exceptions.JSONDecodeError:
        print("응답 본문:", response.text)

    response.raise_for_status()

except FileNotFoundError as e:
    print("파일 오류:", e)

except requests.exceptions.Timeout:
    print("요청 시간이 초과되었습니다.")

except requests.exceptions.ConnectionError:
    print("n8n 서버에 연결할 수 없습니다.")
    print("Docker와 n8n이 실행 중인지 확인하세요.")

except requests.exceptions.HTTPError as e:
    print("HTTP 오류:", e)

except requests.exceptions.RequestException as e:
    print("요청 오류:", e)