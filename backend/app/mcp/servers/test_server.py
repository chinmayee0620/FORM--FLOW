"""Harmless Test MCP Server for development and diagnostic verification.

Exposes benign test tools (echo, health ping, calculation) to verify dynamic discovery
and execution without touching external systems. Clearly marked as mock dev server.
"""

import time
from typing import Any, Dict, List
from app.mcp.base import BaseMCPServer
from app.models.schemas import MCPServerStatus, MCPToolDefinition, MCPToolExecutionResult


class TestMCPServer(BaseMCPServer):
    """Harmless MCP Server for local dev & diagnostics."""

    def __init__(self, server_id: str = "test-echo-mcp"):
        super().__init__(
            server_id=server_id,
            name="Test Echo & Diagnostics MCP",
            description="Harmless mock development MCP server for verifying tool discovery and dynamic execution.",
            transport="in_memory",
            is_mock=True
        )
        self._tools: Dict[str, MCPToolDefinition] = {
            "test_mcp_echo": MCPToolDefinition(
                name="test_mcp_echo",
                server_id=self.server_id,
                description="Harmless test tool that echoes back parameters with execution timestamp.",
                parameters={
                    "type": "object",
                    "properties": {
                        "payload": {"type": "string", "description": "Arbitrary test string to echo back"}
                    },
                    "required": ["payload"]
                }
            ),
            "test_mcp_ping": MCPToolDefinition(
                name="test_mcp_ping",
                server_id=self.server_id,
                description="Returns server diagnostic health metrics and latency.",
                parameters={"type": "object", "properties": {}}
            )
        }

    async def connect(self) -> bool:
        self.is_connected = True
        self.last_error = None
        return True

    async def disconnect(self) -> bool:
        self.is_connected = False
        return True

    async def list_tools(self) -> List[MCPToolDefinition]:
        if not self.is_connected:
            return []
        return list(self._tools.values())

    async def call_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> MCPToolExecutionResult:
        start = time.time()
        if not self.is_connected:
            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="error",
                result=None,
                is_mock=True,
                error="Server is disconnected. Connect the server before executing tools."
            )

        if tool_name == "test_mcp_echo":
            payload = arguments.get("payload", "")
            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="success",
                result={
                    "echo": payload,
                    "server": self.name,
                    "is_mock": True,
                    "status": "healthy"
                },
                is_mock=True,
                execution_time_ms=round((time.time() - start) * 1000, 2)
            )

        elif tool_name == "test_mcp_ping":
            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="success",
                result={
                    "pong": True,
                    "uptime_status": "optimal",
                    "tools_count": len(self._tools),
                    "is_mock": True
                },
                is_mock=True,
                execution_time_ms=round((time.time() - start) * 1000, 2)
            )

        return MCPToolExecutionResult(
            tool_name=tool_name,
            server_id=self.server_id,
            status="error",
            result=None,
            is_mock=True,
            error=f"Tool '{tool_name}' not found on {self.name}."
        )

    def get_status(self) -> MCPServerStatus:
        base = super().get_status()
        base.tool_count = len(self._tools) if self.is_connected else 0
        base.tools = list(self._tools.values()) if self.is_connected else []
        return base
