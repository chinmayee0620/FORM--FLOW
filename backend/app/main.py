"""FormFlow Backend Orchestrator - Main FastAPI Application.

Modular LLM Provider Interface + Dynamic MCP Server Registry + Real Google Drive Integration.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.llm.registry import llm_registry
from app.mcp.registry import mcp_registry
from app.api.routes_health import router as health_router
from app.api.routes_llm import router as llm_router
from app.api.routes_mcp import router as mcp_router
from app.api.routes_chat import router as chat_router
from app.api.routes_auth import router as auth_router
from app.api.routes_drive import router as drive_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    print(f"==================================================")
    print(f"🚀 Initializing {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"==================================================")

    # 1. Load declarative MCP servers
    mcp_registry.load_from_config()
    await mcp_registry.initialize_all()
    connected_mcp = sum(1 for s in mcp_registry.get_all_statuses() if s.status == "CONNECTED")
    print(f"📦 [MCP Registry] Loaded & connected {connected_mcp} MCP servers.")

    # 2. Check active LLM provider
    active_llm = await llm_registry.get_active_provider()
    status = await active_llm.health_check()
    print(f"🤖 [LLM Registry] Active Provider: '{active_llm.provider_id}' (Status: {status.status})")
    if getattr(active_llm, "is_mock", False):
        print(f"⚠️ [LLM Registry] Note: Running in safe offline Development Mock Mode.")
    print(f"==================================================")

    yield

    print("🛑 Shutting down FormFlow Backend Orchestrator...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "FormFlow Application Assistant Backend with modular LLM provider interface "
        "(Gemini, OpenAI, Mock) and dynamic MCP Server Registry."
    ),
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(drive_router)
app.include_router(llm_router)
app.include_router(mcp_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    return {
        "message": "FormFlow Backend Orchestrator is operational.",
        "docs": "/docs",
        "health": "/api/health",
        "auth_status": "/api/auth/google/drive/status",
        "drive_search": "/api/drive/search",
        "mcp_servers": "/api/mcp/servers",
        "llm_providers": "/api/llm/providers"
    }
