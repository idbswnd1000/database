from fastapi import APIRouter

from app.services.sales_service import (
    get_dashboard,
    get_top_products,
    get_category_sales
)

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.get("/dashboard")
def dashboard():
    return get_dashboard()


@router.get("/top-products")
def top_products():
    return get_top_products()


@router.get("/categories")
def category_sales():
    return get_category_sales()