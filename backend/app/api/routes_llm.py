"""LLM Provider management endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings
from app.llm.registry import llm_registry

router = APIRouter(prefix="/api/llm", tags=["LLM Providers"])


class SetActiveProviderRequest(BaseModel):
    provider_id: str


@router.get("/providers")
async def list_providers():
    """Lists metadata for all registered LLM providers."""
    return {"providers": [p.model_dump() for p in llm_registry.list_metadata()]}


@router.get("/status")
async def get_provider_status():
    """Runs health checks on all registered LLM providers."""
    health_map = await llm_registry.get_all_health()
    active_provider = await llm_registry.get_active_provider()
    return {
        "active_provider": active_provider.provider_id,
        "is_mock": getattr(active_provider, "is_mock", False),
        "statuses": {k: v.model_dump() for k, v in health_map.items()}
    }


@router.post("/active")
async def set_active_provider(req: SetActiveProviderRequest):
    """Dynamically switches active LLM provider."""
    try:
        provider = llm_registry.get_provider(req.provider_id)
        status = await provider.health_check()
        settings.ACTIVE_LLM_PROVIDER = req.provider_id.lower()
        return {
            "success": True,
            "active_provider": req.provider_id,
            "status": status.model_dump()
        }
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to switch provider: {str(e)}")
