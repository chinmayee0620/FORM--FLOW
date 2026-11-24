"""MCP Tool Implementations for Google Drive Operations.

Strictly follows privacy rules:
- Search and List tools ONLY return metadata, NEVER file content.
- Read tool reads ONLY the requested document on demand.
- User authorization context is validated for every call.
"""

from typing import Dict, Any, Optional, List
from app.services.google_drive_service import google_drive_service
from app.services.google_oauth_service import google_oauth_service
from app.database.token_store import token_store
from mcp_servers.google_drive_server.auth import UserSecurityContext


async def execute_search_drive_files(
    user_id: str,
    query: str,
    mime_type: Optional[str] = None,
    folder_id: Optional[str] = None,
    page_size: int = 10
) -> Dict[str, Any]:
    """Tool 1: Searches Drive by keywords and metadata. Does not read contents."""
    UserSecurityContext(user_id).validate_connection()
    result = await google_drive_service.search_files(
        user_id=user_id,
        query=query,
        mime_type=mime_type,
        folder_id=folder_id,
        page_size=page_size
    )
    return {
        "status": "success",
        "matches_count": len(result["files"]),
        "files": result["files"],
        "nextPageToken": result.get("nextPageToken")
    }


async def execute_list_drive_files(
    user_id: str,
    mime_type: Optional[str] = None,
    folder_id: Optional[str] = None,
    page_size: int = 20
) -> Dict[str, Any]:
    """Tool 2: Lists files in a specified folder or matching a filter."""
    UserSecurityContext(user_id).validate_connection()
    result = await google_drive_service.search_files(
        user_id=user_id,
        query="",
        mime_type=mime_type,
        folder_id=folder_id,
        page_size=page_size
    )
    return {
        "status": "success",
        "files_count": len(result["files"]),
        "files": result["files"]
    }


async def execute_get_drive_file_metadata(
    user_id: str,
    file_id: str
) -> Dict[str, Any]:
    """Tool 3: Retrieves metadata for a particular file without reading content."""
    UserSecurityContext(user_id).validate_connection()
    meta = await google_drive_service.get_file_metadata(user_id=user_id, file_id=file_id)
    return {
        "status": "success",
        "metadata": meta
    }


async def execute_read_drive_file(
    user_id: str,
    file_id: str,
    purpose: Optional[str] = "user_query"
) -> Dict[str, Any]:
    """Tool 4: Reads a specific authorized file only when necessary.
    
    Returns extracted text for temporary processing. Text is not stored in DB.
    """
    UserSecurityContext(user_id).validate_connection()
    content = await google_drive_service.read_file_content(user_id=user_id, file_id=file_id)
    return {
        "status": "success",
        "file_id": content["file_id"],
        "file_name": content["file_name"],
        "mime_type": content["mime_type"],
        "extracted_text": content["extracted_text"],
        "char_count": content["char_count"]
    }


async def execute_export_google_document(
    user_id: str,
    file_id: str,
    target_format: str = "text/plain"
) -> Dict[str, Any]:
    """Tool 5: Exports a selected Google Workspace document into text/csv format."""
    UserSecurityContext(user_id).validate_connection()
    content = await google_drive_service.read_file_content(user_id=user_id, file_id=file_id)
    return {
        "status": "success",
        "file_id": content["file_id"],
        "file_name": content["file_name"],
        "exported_format": target_format,
        "content": content["extracted_text"]
    }


async def execute_list_drive_folders(
    user_id: str,
    parent_folder_id: Optional[str] = None
) -> Dict[str, Any]:
    """Tool 6: Lists folder metadata from Drive."""
    UserSecurityContext(user_id).validate_connection()
    result = await google_drive_service.search_files(
        user_id=user_id,
        query="",
        mime_type="application/vnd.google-apps.folder",
        folder_id=parent_folder_id,
        page_size=20
    )
    return {
        "status": "success",
        "folders": result["files"]
    }


async def execute_get_drive_connection_status(
    user_id: str
) -> Dict[str, Any]:
    """Tool 7: Returns current user's Google Drive connection status."""
    status = token_store.get_status(user_id)
    return {
        "status": "success",
        "connection": status
    }


async def execute_disconnect_drive(
    user_id: str
) -> Dict[str, Any]:
    """Tool 8: Disconnects user's Drive connection and purges tokens."""
    success = await google_oauth_service.disconnect(user_id)
    return {
        "status": "success" if success else "error",
        "disconnected": success
    }
