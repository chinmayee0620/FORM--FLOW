"""Official Google Drive MCP Server using the Model Context Protocol SDK.

Exposes 8 real Drive tools using mcp.server.mcpserver.MCPServer.
Plugs into FormFlow's BaseMCPServer registry seamlessly.
"""

from typing import Dict, Any, List, Optional
from mcp.server.mcpserver import MCPServer
from app.mcp.base import BaseMCPServer
from app.models.schemas import MCPToolDefinition, MCPToolExecutionResult
import mcp_servers.google_drive_server.tools as drive_tools

# 1. Instantiate the official MCP Server
official_mcp_server = MCPServer(name="google-drive-mcp-server")


# 2. Register all 8 tools via official @official_mcp_server.tool() decorator

@official_mcp_server.tool()
async def search_drive_files(
    user_id: str,
    query: str,
    mime_type: Optional[str] = None,
    folder_id: Optional[str] = None,
    page_size: int = 10
) -> Dict[str, Any]:
    """Search the user's Google Drive using keywords and metadata. Does not read contents."""
    return await drive_tools.execute_search_drive_files(user_id, query, mime_type, folder_id, page_size)


@official_mcp_server.tool()
async def list_drive_files(
    user_id: str,
    mime_type: Optional[str] = None,
    folder_id: Optional[str] = None,
    page_size: int = 20
) -> Dict[str, Any]:
    """List files in a specified folder or matching a user-requested filter."""
    return await drive_tools.execute_list_drive_files(user_id, mime_type, folder_id, page_size)


@official_mcp_server.tool()
async def get_drive_file_metadata(
    user_id: str,
    file_id: str
) -> Dict[str, Any]:
    """Retrieve metadata for a particular file without reading content."""
    return await drive_tools.execute_get_drive_file_metadata(user_id, file_id)


@official_mcp_server.tool()
async def read_drive_file(
    user_id: str,
    file_id: str,
    purpose: Optional[str] = "user_query"
) -> Dict[str, Any]:
    """Read a specific authorized file only when the user has requested the information."""
    return await drive_tools.execute_read_drive_file(user_id, file_id, purpose)


@official_mcp_server.tool()
async def export_google_document(
    user_id: str,
    file_id: str,
    target_format: str = "text/plain"
) -> Dict[str, Any]:
    """Export a selected Google Workspace document into text or CSV."""
    return await drive_tools.execute_export_google_document(user_id, file_id, target_format)


@official_mcp_server.tool()
async def list_drive_folders(
    user_id: str,
    parent_folder_id: Optional[str] = None
) -> Dict[str, Any]:
    """Retrieve folder metadata when needed."""
    return await drive_tools.execute_list_drive_folders(user_id, parent_folder_id)


@official_mcp_server.tool()
async def get_drive_connection_status(
    user_id: str
) -> Dict[str, Any]:
    """Check the current user's Drive connection status."""
    return await drive_tools.execute_get_drive_connection_status(user_id)


@official_mcp_server.tool()
async def disconnect_drive(
    user_id: str
) -> Dict[str, Any]:
    """Disconnect the current user's Drive connection after an authorized request."""
    return await drive_tools.execute_disconnect_drive(user_id)


# 3. Adapter Class for FormFlow Host Registry integration
class GoogleDriveMCPServerAdapter(BaseMCPServer):
    """Adapter bridging the official MCPServer with FormFlow's server registry."""

    def __init__(self, server_id: str = "google-drive"):
        super().__init__(
            server_id=server_id,
            name="Official Google Drive MCP Server",
            description="Real Google Drive MCP server exposing 8 tools for metadata search and on-demand document reading.",
            transport="in_memory",
            is_mock=False
        )
        self.underlying_server = official_mcp_server

    async def connect(self) -> bool:
        self.is_connected = True
        self.last_error = None
        return True

    async def disconnect(self) -> bool:
        self.is_connected = False
        return True

    async def list_tools(self) -> List[MCPToolDefinition]:
        """Discovers tools dynamically from the official MCP server."""
        if not self.is_connected:
            return []
        
        mcp_tools = await self.underlying_server.list_tools()
        definitions: List[MCPToolDefinition] = []
        for t in mcp_tools:
            schema = t.inputSchema if hasattr(t, "inputSchema") and t.inputSchema else {}
            definitions.append(
                MCPToolDefinition(
                    name=t.name,
                    server_id=self.server_id,
                    description=t.description or "",
                    parameters=schema
                )
            )
        return definitions

    async def call_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> MCPToolExecutionResult:
        """Executes tool via the official MCP server."""
        import time
        start = time.time()
        try:
            res = await self.underlying_server.call_tool(tool_name, arguments)
            # Extract structured result from CallToolResult
            output = None
            if hasattr(res, "structured_content") and res.structured_content:
                output = res.structured_content.get("result", res.structured_content)
            elif hasattr(res, "content") and res.content:
                texts = [c.text for c in res.content if hasattr(c, "text")]
                output = "\n".join(texts)
            else:
                output = str(res)

            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="success",
                result=output,
                execution_time_ms=round((time.time() - start) * 1000, 2)
            )
        except Exception as e:
            cause = getattr(e, "__cause__", None)
            err_msg = f"{e}: {cause}" if cause else str(e)
            return MCPToolExecutionResult(
                tool_name=tool_name,
                server_id=self.server_id,
                status="error",
                result=None,
                error=err_msg,
                execution_time_ms=round((time.time() - start) * 1000, 2)
            )
