import os

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Menu Backend API",
    version="1.0.0",
)

N8N_BASE_URL = os.getenv(
    "N8N_BASE_URL",
    "http://n8n:5678",
).rstrip("/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://43.201.77.70",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "n8n_url": N8N_BASE_URL,
    }


async def proxy_to_n8n(
    request: Request,
    webhook_path: str,
) -> Response:
    n8n_url = f"{N8N_BASE_URL}/webhook/{webhook_path}"

    body = await request.body()

    headers = {}

    content_type = request.headers.get("content-type")

    if content_type:
        headers["content-type"] = content_type

    try:
        async with httpx.AsyncClient(
            timeout=180.0,
        ) as client:
            result = await client.request(
                method=request.method,
                url=n8n_url,
                content=body,
                headers=headers,
                params=request.query_params,
            )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="n8n 요청 시간이 초과되었습니다.",
        )

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=502,
            detail=f"n8n 연결 실패: {error}",
        )

    response_headers = {}

    response_content_type = result.headers.get(
        "content-type",
    )

    if response_content_type:
        response_headers["content-type"] = (
            response_content_type
        )

    return Response(
        content=result.content,
        status_code=result.status_code,
        headers=response_headers,
    )


@app.post("/menu/analyze")
async def menu_analyze(request: Request):
    return await proxy_to_n8n(
        request,
        "menu-analyze",
    )


@app.post("/menu/detail")
async def menu_detail(request: Request):
    return await proxy_to_n8n(
        request,
        "menu-detail",
    )


@app.post("/menu/chat")
async def menu_chat(request: Request):
    return await proxy_to_n8n(
        request,
        "menu-chat",
    )