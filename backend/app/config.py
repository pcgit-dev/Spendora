
#provides centralized configuration management for our backend application.
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    app_name: str = "Spendora API"

    api_prefix: str = "/api/v1"

    database_url: str

    jwt_secret: str = Field(min_length=32)

    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 60

    jwt_issuer: str = "spendora"

    jwt_audience: str = "spendora-api"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
