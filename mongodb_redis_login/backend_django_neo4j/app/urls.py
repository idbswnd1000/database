from django.urls import path

from app.views.auth_view import (
    login_view,
    logout_view,
    me_view,
    refresh_view,
    register_view,
)
from app.views.customer_view import (
    customer_graph,
    customer_list,
)
from app.views.cypher_view import (
    cypher_execute,
)
from app.views.dashboard_view import (
    dashboard_kpi,
    monthly_sales,
    top_products,
    category_sales,
    channel_sales,
)
from app.views.graph_view import (
    overview_graph,
)
from app.views.product_view import (
    product_graph,
    product_list,
)
from app.views.sale_view import (
    sale_graph,
    sale_list,
)

urlpatterns = [

    # ======================
    # Auth
    # ======================
    path(
        "auth/register/",
        register_view,
        name="register",
    ),
    path(
        "auth/login/",
        login_view,
        name="login",
    ),
    path(
        "auth/refresh/",
        refresh_view,
        name="refresh",
    ),
    path(
        "auth/logout/",
        logout_view,
        name="logout",
    ),
    path(
        "auth/me/",
        me_view,
        name="me",
    ),

    # ======================
    # Dashboard
    # ======================
    path(
        "dashboard/kpi/",
        dashboard_kpi,
    ),
    path(
        "dashboard/monthly-sales/",
        monthly_sales,
    ),
    path(
        "dashboard/top-products/",
        top_products,
    ),
    path(
        "dashboard/category-sales/",
        category_sales,
    ),
    path(
        "dashboard/channel-sales/",
        channel_sales,
    ),

    # ======================
    # Graph Explorer
    # ======================
    path(
        "graph/overview/",
        overview_graph,
    ),

    # ======================
    # Customer
    # ======================
    path(
        "customers/",
        customer_list,
    ),
    path(
        "customers/<str:customer_code>/graph/",
        customer_graph,
    ),

    # ======================
    # Product
    # ======================
    path(
        "products/",
        product_list,
    ),
    path(
        "products/<str:product_code>/graph/",
        product_graph,
    ),

    # ======================
    # Sale
    # ======================
    path(
        "sales/",
        sale_list,
    ),
    path(
        "sales/<str:sale_id>/graph/",
        sale_graph,
    ),

    # ======================
    # Cypher
    # ======================
    path(
        "cypher/execute/",
        cypher_execute,
    ),
]