from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Vakeel Saab API"
    environment: str = "development"
    debug: bool = False

    database_url: str = Field(..., alias="DATABASE_URL")
    jwt_secret_key: str = Field(..., alias="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    gemini_api_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    gemini_qa_model: str = "gemini-2.5-flash"
    gemini_summary_model: str = "gemini-2.5-flash"

    frontend_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        alias="FRONTEND_ORIGINS",
    )

    upload_dir: Path = BASE_DIR / "uploads"
    max_upload_size_mb: int = 10

    tesseract_cmd: str | None = None

    @field_validator("frontend_origins", mode="before")
    @classmethod
    def parse_frontend_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if not value:
            return []
        return [origin.strip() for origin in value.split(",") if origin.strip()]

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value: bool | str) -> bool:
        if isinstance(value, bool):
            return value

        normalized = str(value).strip().lower()
        if normalized in {"1", "true", "yes", "on", "debug", "development"}:
            return True
        if normalized in {"0", "false", "no", "off", "release", "production"}:
            return False
        return False


@lru_cache
def get_settings() -> Settings:
    return Settings()
