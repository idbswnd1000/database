import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(
    __file__
).resolve().parent.parent

load_dotenv(
    BASE_DIR / ".env"
)

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-development-secret",
)

DEBUG = (
    os.getenv(
        "DEBUG",
        "True",
    ).lower()
    == "true"
)

ALLOWED_HOSTS = [
    value.strip()
    for value in os.getenv(
        "ALLOWED_HOSTS",
        "127.0.0.1,localhost",
    ).split(",")
    if value.strip()
]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "app",
]

MIDDLEWARE = [
    (
        "corsheaders.middleware."
        "CorsMiddleware"
    ),
    (
        "django.middleware.security."
        "SecurityMiddleware"
    ),
    (
        "django.middleware.common."
        "CommonMiddleware"
    ),
]

ROOT_URLCONF = "config.urls"

TEMPLATES = []

WSGI_APPLICATION = (
    "config.wsgi.application"
)

ASGI_APPLICATION = (
    "config.asgi.application"
)

DATABASES = {
    "default": {
        "ENGINE": (
            "django.db.backends.sqlite3"
        ),
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)

CORS_ALLOWED_ORIGINS = [
    value.strip()
    for value in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173",
    ).split(",")
    if value.strip()
]

REST_FRAMEWORK = {
    (
        "DEFAULT_AUTHENTICATION_"
        "CLASSES"
    ): [
        (
            "app.authentication."
            "jwt_authentication."
            "JWTAuthentication"
        )
    ],
    (
        "DEFAULT_PERMISSION_"
        "CLASSES"
    ): [
        (
            "rest_framework."
            "permissions.AllowAny"
        )
    ],
    "UNAUTHENTICATED_USER": None,
}