"""Base interface for all MCP (Model Context Protocol) servers in FormFlow."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from app.models.schemas import MCPServerStatus, MCPToolDefinition, MCPToolExecutionResult


class BaseMCPServer(ABC):
    """Abstract Base Class for an MCP Server connection.
    
    Can represent an in-process adapter, a stdio subprocess, or an SSE remote server.
    """

    def __init__(
        self,
        server_id: str,
        name: str,
        description: str,
        transport: str = "in_memory",
        is_mock: bool = False
    ):
        self.server_id = server_id
        self.name = name
        self.description = description
        self.transport = transport
        self.is_mock = is_mock
        self.is_connected = False
        self.last_error: Optional[str] = None

    @abstractmethod
    async def connect(self) -> bool:
        """Connects to the server and initializes transport."""
        pass

    @abstractmethod
    async def disconnect(self) -> bool:
        """Disconnects and tears down resources."""
        pass

    @abstractmethod
    async def list_tools(self) -> List[MCPToolDefinition]:
        """Discovers and returns all tools exposed by this MCP server."""
        pass

    @abstractmethod
    async def call_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> MCPToolExecutionResult:
        """Executes a specific tool on this MCP server."""
        pass

    def get_status(self) -> MCPServerStatus:
        """Returns the current status of the server."""
        status_str = "CONNECTED" if self.is_connected else "DISCONNECTED"
        if self.last_error:
            status_str = "ERROR"

        return MCPServerStatus(
            server_id=self.server_id,
            name=self.name,
            description=self.description,
            transport=self.transport,
            status=status_str,
            is_mock=self.is_mock,
            tool_count=0,
            tools=[],
            error_message=self.last_error
        )
