"""Health check endpoints for FormFlow."""

from fastapi import APIRouter
from app.config import settings
from app.llm.registry import llm_registry
from app.mcp.registry import mcp_registry

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
async def get_system_health():
    """System health check showing status of LLM providers and MCP servers."""
    llm_health = await llm_registry.get_all_health()
    active_provider = await llm_registry.get_active_provider()
    mcp_statuses = mcp_registry.get_all_statuses()

    connected_mcp_count = sum(1 for s in mcp_statuses if s.status == "CONNECTED")

    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "active_llm_provider": active_provider.provider_id,
        "is_mock_llm": getattr(active_provider, "is_mock", False),
        "llm_providers": {k: v.model_dump() for k, v in llm_health.items()},
        "mcp_servers_total": len(mcp_statuses),
        "mcp_servers_connected": connected_mcp_count,
        "mcp_servers": [s.model_dump() for s in mcp_statuses]
    }
