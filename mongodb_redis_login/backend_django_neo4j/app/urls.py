from django.urls import path

from app import views

urlpatterns = [
    path(
        "auth/register/",
        views.register
    ),
    path(
        "auth/login/",
        views.login
    ),
    path(
        "auth/logout/",
        views.logout
    ),
    path(
        "auth/refresh/",
        views.refresh
    ),

    path(
        "sales/dashboard/",
        views.dashboard
    ),
    path(
        "sales/top-products/",
        views.top_products
    ),
    path(
        "sales/categories/",
        views.categories
    ),
]