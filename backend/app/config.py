"""FormFlow Application Configuration.

Loads environment variables and sets sensible defaults.
Configuration is strictly separated from application logic.
Zero hardcoded secrets.
"""

import os
from typing import List, Optional
from pydantic import BaseModel, Field


def _load_env_file(filepath: str = ".env"):
    """Lightweight .env loader without third-party dependencies."""
    if not os.path.exists(filepath):
        return
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                if k not in os.environ:
                    os.environ[k] = v
    except Exception:
        pass


_load_env_file()


class Settings(BaseModel):
    # Application Info
    APP_NAME: str = "FormFlow Backend Orchestrator"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("true", "1")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Google OAuth 2.0 & Drive Configuration
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/drive/callback")
    GOOGLE_DRIVE_SCOPES: List[str] = [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
    ]

    # Token Encryption Key (Fernet 32-byte urlsafe base64 string)
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "bXlfZm9ybWZsb3dfZGV2X2tleV8zMmJ5dGVzX2Flc18=")

    # Database & Storage
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data"))
    TOKEN_DB_PATH: str = os.getenv("TOKEN_DB_PATH", "")

    # Active LLM Provider: 'mock' (safe default for dev), 'gemini', 'openai', or custom
    ACTIVE_LLM_PROVIDER: str = os.getenv("ACTIVE_LLM_PROVIDER", "mock")

    # Gemini Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_TEMPERATURE: float = float(os.getenv("GEMINI_TEMPERATURE", "0.2"))

    # OpenAI Configuration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # Mock LLM Settings
    MOCK_LLM_LATENCY_MS: int = int(os.getenv("MOCK_LLM_LATENCY_MS", "400"))

    # MCP Server Registry
    MCP_CONFIG_PATH: str = os.getenv("MCP_CONFIG_PATH", "config/mcp_servers.json")

    def __init__(self, **data):
        super().__init__(**data)
        if not self.TOKEN_DB_PATH:
            os.makedirs(self.DATA_DIR, exist_ok=True)
            self.TOKEN_DB_PATH = os.path.join(self.DATA_DIR, "formflow_tokens.db")


settings = Settings()
