from fastapi import APIRouter, HTTPException

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(request: RegisterRequest):
    try:
        return register_user(
            request.username,
            request.password
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(request: LoginRequest):
    try:
        return login_user(
            request.username,
            request.password
        )
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )