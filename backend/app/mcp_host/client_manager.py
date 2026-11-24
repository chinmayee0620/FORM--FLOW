"""MCP Client Manager.

Manages connections to MCP servers, discovers available tools dynamically,
and coordinates tool invocations with safety timeouts and error handling.
"""

from typing import List, Dict, Any, Optional
from app.mcp.registry import mcp_registry
from app.models.schemas import MCPToolDefinition, MCPToolExecutionResult


class MCPClientManager:
    """Discovers and invokes tools across connected MCP servers."""

    async def list_available_tools(self, server_id: Optional[str] = None) -> List[MCPToolDefinition]:
        """Discovers tools dynamically from connected MCP servers."""
        return await mcp_registry.discover_tools(server_id=server_id)

    async def execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        server_id: Optional[str] = None
    ) -> MCPToolExecutionResult:
        """Executes a specific tool on the appropriate MCP server."""
        return await mcp_registry.execute_tool(
            tool_name=tool_name,
            arguments=arguments,
            server_id=server_id
        )


mcp_client_manager = MCPClientManager()
