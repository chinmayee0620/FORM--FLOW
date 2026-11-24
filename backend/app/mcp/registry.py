"""Dynamic MCP Server Registry for FormFlow.

Loads MCP server definitions from configuration files and supports dynamic
runtime registration, connection, disconnection, tool discovery, and tool execution.
"""

import importlib
import json
import os
from typing import Any, Dict, List, Optional
from app.config import settings
from app.mcp.base import BaseMCPServer
from app.models.schemas import (
    MCPServerRegistrationRequest,
    MCPServerStatus,
    MCPToolDefinition,
    MCPToolExecutionResult,
)


class MCPServerRegistry:
    """Central registry and lifecycle manager for all MCP servers."""

    def __init__(self):
        self._servers: Dict[str, BaseMCPServer] = {}
        self._configs: Dict[str, Dict[str, Any]] = {}

    def load_from_config(self, config_path: Optional[str] = None):
        """Loads MCP servers declaratively from config/mcp_servers.json."""
        path = config_path or settings.MCP_CONFIG_PATH
        if not os.path.exists(path):
            # Fallback path if run from root or app directory
            alt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "mcp_servers.json")
            if os.path.exists(alt_path):
                path = alt_path

        if not os.path.exists(path):
            return

        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                servers = data.get("servers", [])
                for s_cfg in servers:
                    self.register_from_dict(s_cfg)
        except Exception as e:
            print(f"[MCP Registry] Warning: Failed to load config from {path}: {e}")

    def register_from_dict(self, cfg: Dict[str, Any]):
        """Instantiates and registers a server from a config dict."""
        server_id = cfg.get("server_id")
        if not server_id:
            return

        self._configs[server_id] = cfg
        adapter_class_path = cfg.get("adapter_class")

        if adapter_class_path:
            try:
                module_name, class_name = adapter_class_path.rsplit(".", 1)
                mod = importlib.import_module(module_name)
                cls = getattr(mod, class_name)
                instance: BaseMCPServer = cls(server_id=server_id)
                self._servers[server_id] = instance
            except Exception as e:
                print(f"[MCP Registry] Could not load adapter {adapter_class_path}: {e}")

    async def initialize_all(self):
        """Connects all configured servers on startup."""
        for server in self._servers.values():
            try:
                await server.connect()
            except Exception as e:
                server.last_error = str(e)
                server.is_connected = False

    async def connect_server(self, server_id: str) -> bool:
        """Connects to a specific MCP server dynamically."""
        if server_id not in self._servers:
            raise KeyError(f"Server '{server_id}' not found in registry.")
        server = self._servers[server_id]
        success = await server.connect()
        return success

    async def disconnect_server(self, server_id: str) -> bool:
        """Disconnects a specific MCP server dynamically."""
        if server_id not in self._servers:
            raise KeyError(f"Server '{server_id}' not found in registry.")
        server = self._servers[server_id]
        success = await server.disconnect()
        return success

    async def discover_tools(self, server_id: Optional[str] = None) -> List[MCPToolDefinition]:
        """Discovers tools across all connected MCP servers or a specific one."""
        tools: List[MCPToolDefinition] = []
        if server_id:
            if server_id in self._servers:
                return await self._servers[server_id].list_tools()
            return []

        for server in self._servers.values():
            if server.is_connected:
                s_tools = await server.list_tools()
                tools.extend(s_tools)
        return tools

    async def execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        server_id: Optional[str] = None
    ) -> MCPToolExecutionResult:
        """Executes a tool on the target or matching MCP server."""
        if server_id:
            if server_id not in self._servers:
                return MCPToolExecutionResult(
                    tool_name=tool_name,
                    server_id=server_id,
                    status="error",
                    result=None,
                    error=f"Server '{server_id}' not found."
                )
            return await self._servers[server_id].call_tool(tool_name, arguments)

        # Search across servers for matching tool
        for sid, server in self._servers.items():
            if server.is_connected:
                tools = await server.list_tools()
                if any(t.name == tool_name for t in tools):
                    return await server.call_tool(tool_name, arguments)

        return MCPToolExecutionResult(
            tool_name=tool_name,
            server_id="unknown",
            status="error",
            result=None,
            error=f"Tool '{tool_name}' not found on any connected MCP server."
        )

    def get_server_status(self, server_id: str) -> MCPServerStatus:
        """Retrieves live status of a single MCP server."""
        if server_id not in self._servers:
            raise KeyError(f"Server '{server_id}' not registered.")
        return self._servers[server_id].get_status()

    def get_all_statuses(self) -> List[MCPServerStatus]:
        """Retrieves status of all registered MCP servers."""
        return [s.get_status() for s in self._servers.values()]

    def register_dynamic_server(self, req: MCPServerRegistrationRequest) -> MCPServerStatus:
        """Registers a new server dynamically via API without restart."""
        # For demonstration of dynamic runtime registration
        self._configs[req.server_id] = req.model_dump()
        # In a real environment, can instantiate Stdio or SSE transport
        # Here we map to a test server or generic adapter
        from app.mcp.servers.test_server import TestMCPServer
        new_server = TestMCPServer(server_id=req.server_id)
        new_server.name = req.name
        new_server.description = req.description
        new_server.transport = req.transport
        new_server.is_mock = req.is_mock
        self._servers[req.server_id] = new_server
        return new_server.get_status()


# Global singleton registry
mcp_registry = MCPServerRegistry()
