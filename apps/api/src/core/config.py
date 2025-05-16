"""Application configuration module."""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ColorAgent API"
    VERSION: str = "0.0.1"
    DEBUG: bool = Field(default=False)

    # Database settings
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/coloragent"
    )

    # Redis settings
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # CORS settings
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"])

    # JWT settings
    JWT_SECRET: str = Field(default="supersecret")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Logging settings
    LOG_LEVEL: str = Field(default="INFO")

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )


settings = Settings()
