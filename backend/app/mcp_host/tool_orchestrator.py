"""MCP Tool Orchestrator.

Coordinates intelligent Drive document retrieval, ensuring:
1. Search retrieves metadata first.
2. Read operations execute on demand only for the selected file.
3. User authorization context is securely attached.
4. Extracted text is never stored permanently.
"""

from typing import Dict, Any, List, Optional
from app.mcp_host.client_manager import mcp_client_manager
from app.models.schemas import MCPToolExecutionResult


class MCPToolOrchestrator:
    """High-level coordinator for multi-step MCP operations."""

    async def search_user_documents(
        self,
        user_id: str,
        keywords: str,
        page_size: int = 10
    ) -> List[Dict[str, Any]]:
        """Invokes search_drive_files tool through MCP Client."""
        res: MCPToolExecutionResult = await mcp_client_manager.execute_tool(
            tool_name="search_drive_files",
            arguments={"user_id": user_id, "query": keywords, "page_size": page_size},
            server_id="google-drive"
        )
        if res.status == "success" and isinstance(res.result, dict):
            return res.result.get("files", [])
        return []

    async def read_selected_document(
        self,
        user_id: str,
        file_id: str,
        purpose: str = "field_extraction"
    ) -> Optional[Dict[str, Any]]:
        """Invokes read_drive_file tool through MCP Client."""
        res: MCPToolExecutionResult = await mcp_client_manager.execute_tool(
            tool_name="read_drive_file",
            arguments={"user_id": user_id, "file_id": file_id, "purpose": purpose},
            server_id="google-drive"
        )
        if res.status == "success" and isinstance(res.result, dict):
            return res.result
        return None


mcp_tool_orchestrator = MCPToolOrchestrator()
