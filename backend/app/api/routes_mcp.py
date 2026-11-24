"""MCP Server Registry & Tool execution endpoints."""

from typing import Optional
from fastapi import APIRouter, HTTPException
from app.mcp.registry import mcp_registry
from app.models.schemas import (
    MCPServerRegistrationRequest,
    MCPToolExecutionRequest,
    MCPToolExecutionResult,
)

router = APIRouter(prefix="/api/mcp", tags=["MCP Registry"])


@router.get("/servers")
async def list_servers():
    """Lists all registered MCP servers with live statuses."""
    statuses = mcp_registry.get_all_statuses()
    return {"servers": [s.model_dump() for s in statuses]}


@router.post("/servers")
async def register_server(req: MCPServerRegistrationRequest):
    """Registers a new MCP server dynamically via JSON config without restart."""
    new_status = mcp_registry.register_dynamic_server(req)
    await mcp_registry.connect_server(req.server_id)
    return {"success": True, "server": new_status.model_dump()}


@router.post("/servers/{server_id}/connect")
async def connect_server(server_id: str):
    """Dynamically connects an MCP server."""
    try:
        success = await mcp_registry.connect_server(server_id)
        status = mcp_registry.get_server_status(server_id)
        return {"success": success, "status": status.model_dump()}
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/servers/{server_id}/disconnect")
async def disconnect_server(server_id: str):
    """Dynamically disconnects an MCP server."""
    try:
        success = await mcp_registry.disconnect_server(server_id)
        status = mcp_registry.get_server_status(server_id)
        return {"success": success, "status": status.model_dump()}
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tools")
async def discover_tools(server_id: Optional[str] = None):
    """Discovers all tools across connected MCP servers or a specific server."""
    tools = await mcp_registry.discover_tools(server_id=server_id)
    return {"tool_count": len(tools), "tools": [t.model_dump() for t in tools]}


@router.post("/tools/{tool_name}/execute", response_model=MCPToolExecutionResult)
async def execute_tool(tool_name: str, req: MCPToolExecutionRequest):
    """Executes a specific MCP tool dynamically."""
    result = await mcp_registry.execute_tool(
        tool_name=tool_name,
        arguments=req.arguments,
        server_id=req.server_id
    )
    return result
