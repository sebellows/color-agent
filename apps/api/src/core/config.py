"""Application configuration module."""

from enum import Enum
from functools import lru_cache, reduce
import os
from pathlib import Path
import sys

from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

# from pydantic import field_validator
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from starlette.config import Config as StarletteConfig


ROOT_DIR = str(Path(__file__).parent.parent.parent.parent)
load_dotenv(os.path.join(ROOT_DIR, ".env"))

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, ".env")
config = StarletteConfig(env_path)


class FastAPISettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        env_file_encoding="utf-8",
    )


class EnvironmentOption(Enum):
    DEV = "development"
    LOCAL = "local"
    PRODUCTION = "production"
    TEST = "test"


class AppSettings(BaseSettings):
    APP_NAME: str = config("API_APP_NAME", default="color_agent")
    APP_TITLE: str = config("API_APP_TITLE", default="Color Agent")
    APP_DESCRIPTION: str = config("API_APP_DESCRIPTION", default="")
    APP_VERSION: str = config("API_APP_VERSION", default="0.1.0")
    CONTACT_NAME: str | None = config("CONTACT_NAME", default=None)
    CONTACT_EMAIL: str | None = config("CONTACT_EMAIL", default=None)
    ENVIRONMENT: EnvironmentOption = config(
        "ENVIRONMENT", default=EnvironmentOption.LOCAL
    )

    @property
    def IS_DEV(self) -> bool:
        return self.ENVIRONMENT in [
            EnvironmentOption.DEV,
            EnvironmentOption.LOCAL,
        ]


def to_url(*paths: str | int) -> str:
    """
    Convert a path to a URL.

    Args:
        path (str): The path to convert.

    Returns:
        str: The converted URL.
    """
    proto = "http://" if AppSettings.IS_DEV else "https://"

    def prefix(p: str | int, init: str) -> str:
        if p is None:
            return ""
        if isinstance(p, int):
            return f":{p}"
        p = p.strip("/")
        return p if init == proto else f"/{p}"

    path: str = reduce(lambda acc, p: acc + prefix(p, acc), paths, proto)

    return path


class ApiSettings(BaseSettings):
    ENCODING: str = config("ENCODING", default="utf-8")
    API_BASE_URL: str = config("API_BASE_URL", default="http://localhost:8000")
    API_HTTP_PORT: int = config("API_HTTP_PORT", default=8000)
    API_PREFIX: str = config("API_PREFIX_V1", default="/api/v1")

    @property
    def API_URL(self) -> str:
        return f"{self.API_BASE_URL}{self.API_PREFIX}"


class AdminUserSettings(BaseSettings):
    ADMIN_NAME: str = config("ADMIN_NAME", default="admin")
    ADMIN_EMAIL: str = config("ADMIN_EMAIL", default="admin@admin.com")
    ADMIN_USERNAME: str = config("ADMIN_USERNAME", default="admin")
    ADMIN_PASSWORD: str = config("ADMIN_PASSWORD", default="!Ch4ng3Th1sP4ssW0rd!")


class AuthSettings(BaseSettings):
    _AUTH_PATH: str = config("AUTH_PATH", default="/auth")

    @property
    def AUTH_PATH(self) -> str:
        return f"{ApiSettings.API_PREFIX}{self.AUTH_PATH}"

    @property
    def EXCLUDE_PATHS(self) -> list[str]:
        return [
            "/docs",
            "/redoc",
            "/openapi",
            f"{self.AUTH_PATH}/token",
            f"{self.AUTH_PATH}/token/refresh",
            "/register",
        ]

    @property
    def OAUTH2_BEARER(self) -> OAuth2PasswordBearer:
        """
        OAuth2PasswordBearer instance for token authentication.

        @see: https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
        """
        return OAuth2PasswordBearer(tokenUrl=f"{ApiSettings.API_PREFIX}/auth/token")

    # docker run -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.1.2 start-dev
    class KeyCloak:
        REALM: str = config("KEYCLOAK_REALM", default="app")
        CLIENT_NAME: str = config("KEYCLOAK_CLIENT_NAME", default="app")
        ADMIN_USERNAME: str = config("KEYCLOAK_ADMIN_USERNAME", default="admin")
        ADMIN_PASSWORD: str = config("KEYCLOAK_ADMIN_PASSWORD", default="admin")

        HOST: str = config("KEYCLOAK_API_APP_HOST", default="localhost")
        PORT: int = config("KEYCLOAK_API_APP_PORT", default=8080)

        @property
        def URL(self) -> str:
            return f"http://{self.HOST}:{self.PORT}{AuthSettings.AUTH_PATH}"

    class JWT:
        """JWT settings for authentication."""

        # CLIENT_ID=color_agent
        ISSUER: str = config("JWT_ISSUER", default="http://localhost:8000")
        AUDIENCE: str = config("JWT_AUDIENCE", default="http://localhost:8000")
        SUBJECT: str = config("JWT_SUBJECT", default="user")
        ALGORITHM: str = config("JWT_ALGORITHM", default="HS256")
        SECRET_KEY: str = config("JWT_SECRET_KEY", default="SuperSecret")
        # CLIENT_SECRET=a55face2-b33f-fe3d-8645-867530990210
        REFRESH_SECRET_KEY: str = config(
            "JWT_REFRESH_SECRET_KEY", default="SuperSecretRefresh"
        )
        ACCESS_TOKEN_EXPIRE_SECONDS: int = config(
            "ACCESS_TOKEN_EXPIRE_SECONDS", default=60 * 60 * 24 * 1
        )
        REFRESH_TOKEN_EXPIRE_SECONDS: int = config(
            "REFRESH_TOKEN_EXPIRE_SECONDS", default=60 * 60 * 24 * 7
        )

        @property
        def ACCESS_TOKEN_EXPIRE_MINUTES(self) -> int:
            return self.ACCESS_TOKEN_EXPIRE_SECONDS // 60

        @property
        def REFRESH_TOKEN_EXPIRE_MINUTES(self) -> int:
            return self.REFRESH_TOKEN_EXPIRE_SECONDS // 60


class LoggingSettings(BaseSettings):
    LOGGER_NAME: str = config("LOG_NAME", default="api.logger")
    LOG_LEVEL: str = config("LOG_LEVEL", default="DEBUG")
    LOG_JSON_FORMAT = (
        "time: {time:YYYY-MM-DD HH:mm:ss Z} | "
        "level: {level} | "
        "request_id: {extra[request_id]} | "
        "user: {extra[user]} | "
        "user_host: {extra[user_host]} | "
        "user_agent: {extra[user_agent]} | "
        "url: {extra[path]} | "
        "method: {extra[method]} | "
        "request_data: {extra[request_data]} | "
        "response_data: {extra[response_data]} | "
        "response_time: {extra[response_time]} | "
        "response_code: {extra[response_code]} | "
        "message: {message} | "
        "exception: {exception}"
    )


class DatabaseSettings(BaseSettings):
    DB_HOST: str = config("DB_HOST", default="localhost")
    DB_PORT: int = config("DB_PORT", default=5432)
    DB_NAME: str = config("DB_NAME", default="postgres")
    DB_USER: str = config("DB_USER", default="postgres")
    DB_PASSWORD: str = config("DB_PASSWORD", default="postgres")
    DB_ECHO_LOG: bool = bool(config("DB_ECHO_LOG", default=False))

    @property
    def DB_URL(self) -> str:
        try:
            return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        except KeyError as e:
            print(f"Missing environment variable: {e}")
            sys.exit(1)


class RedisSettings(BaseSettings):
    class Cache:
        # TODO: Add to Redis settings
        HOST: str = config("REDIS_HOST", default="localhost")
        # TODO: Add to Redis settings
        PORT: int = config("REDIS_PORT", default=6379)

        REDIS_URL: str = config("REDIS_URL", default="redis://localhost:6379")

        CLIENT_CACHE_MAX_AGE: int = config("CLIENT_CACHE_MAX_AGE", default=60)

        @property
        def URL(self) -> str:
            return f"redis://{self.HOST}:{self.PORT}"

    class Queue:
        """Settings for Arq Redis Job Queue."""

        HOST: str = config("REDIS_QUEUE_HOST", default="localhost")
        PORT: int = config("REDIS_QUEUE_PORT", default=6379)


class Settings(FastAPISettings):
    app: AppSettings = Field(default_factory=AppSettings)
    api: ApiSettings = Field(default_factory=ApiSettings)
    auth: AuthSettings = Field(default_factory=AuthSettings)
    logger: LoggingSettings = Field(default_factory=LoggingSettings)
    db: DatabaseSettings = Field(default_factory=DatabaseSettings)
    admin: AdminUserSettings = Field(default_factory=AdminUserSettings)
    redis: RedisSettings = Field(default_factory=RedisSettings)


@lru_cache()
def get_settings():
    return Settings()


settings = Settings()

# class Settings(BaseSettings):
#     """Application settings."""

#     # API settings
#     API_V1_STR: str = "/api/v1"
#     PROJECT_NAME: str = "Color Agent API"
#     VERSION: str = "0.0.1"
#     DEBUG: bool = Field(default=False)

#     # Database settings
#     DATABASE_URL: str = Field(
#         default=os.getenv(
#             "DB_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/coloragent"
#         )
#     )

#     # Redis settings
#     REDIS_URL: str = Field(default=os.getenv("REDIS_URL", "redis://localhost:6379/0"))

#     # CORS settings
#     CORS_ORIGINS: list[str] = Field(
#         default=[os.getenv("APP_BASE_URL", "http://localhost:3000")]
#     )

#     # JWT settings
#     JWT_SECRET: str = Field(default="supersecret")
#     JWT_ALGORITHM: str = "HS256"
#     JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

#     # Logging settings
#     LOG_LEVEL: str = Field(default="INFO")

#     model_config = SettingsConfigDict(
#         env_file=".env", env_file_encoding="utf-8", case_sensitive=True
#     )


# settings = Settings()
