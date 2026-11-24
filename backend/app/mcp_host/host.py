"""MCP Host for FormFlow.

Coordinates user session context, active MCP servers, and dynamic client dispatching.
"""

from typing import Dict, Any, Optional
from app.mcp_host.client_manager import mcp_client_manager
from app.mcp_host.tool_orchestrator import mcp_tool_orchestrator


class MCPHost:
    """Central MCP Host orchestrating client sessions and tool execution."""

    def __init__(self):
        self.client_manager = mcp_client_manager
        self.orchestrator = mcp_tool_orchestrator

    async def get_tools_for_user(self, user_id: str):
        """Returns tools available to the user."""
        return await self.client_manager.list_available_tools()


mcp_host = MCPHost()
