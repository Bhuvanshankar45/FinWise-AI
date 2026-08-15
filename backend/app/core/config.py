from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FinWise AI"
    secret_key: str = "demo-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./finwise.db"
    backend_cors_origins: str = "http://localhost:5173"
    frontend_url: str = "http://localhost:5173"
    ml_model_path: str = "./backend/ml/savings_model.joblib"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
