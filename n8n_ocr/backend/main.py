import requests

url = "http://localhost:5678/webhook-test/menu-ocr"
image_path = "./data/메뉴판.jpeg"

try:
    with open(image_path, "rb") as f:
        response = requests.post(
            url,
            files={
                "file": (
                    "메뉴판.jpeg",
                    f,
                    "image/jpeg",
                )
            },
            timeout=120,
        )

    print("상태 코드:", response.status_code)
    print("응답:", response.text)

except requests.exceptions.Timeout:
    print("요청 시간이 초과되었습니다.")

except requests.exceptions.ConnectionError:
    print("n8n 서버에 연결할 수 없습니다.")

except Exception as error:
    print("오류:", error)