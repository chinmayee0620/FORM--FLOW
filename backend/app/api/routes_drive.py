"""Google Drive API Endpoints for FormFlow.

Enforces strict privacy and consent:
- Searches only on explicit request.
- Search returns metadata only.
- Read operations process in memory without database persistence.
- Zero automatic background indexing.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel, Field
from app.services.google_drive_service import google_drive_service
from app.services.activity_service import activity_service
from app.api.routes_auth import get_current_user_id

router = APIRouter(prefix="/api/drive", tags=["Google Drive Operations"])


class DriveSearchRequest(BaseModel):
    query: str = Field(default="", description="Search keywords")
    mime_type: Optional[str] = Field(default=None, description="Optional MIME type filter")
    folder_id: Optional[str] = Field(default=None, description="Optional folder ID")
    page_size: int = Field(default=10, description="Max results")
    page_token: Optional[str] = Field(default=None, description="Pagination token")


class DriveReadRequest(BaseModel):
    purpose: Optional[str] = Field(default="user_query", description="Reason for reading document")


class DriveExportRequest(BaseModel):
    target_format: str = Field(default="text/plain", description="Export MIME format")


@router.post("/search")
async def search_drive_files(
    req: DriveSearchRequest,
    x_user_id: Optional[str] = Header(None)
):
    """Searches user's Google Drive only on explicit request.
    
    Returns metadata only. Does NOT read or extract file contents.
    """
    user_id = get_current_user_id(x_user_id)
    try:
        results = await google_drive_service.search_files(
            user_id=user_id,
            query=req.query,
            mime_type=req.mime_type,
            folder_id=req.folder_id,
            page_size=req.page_size,
            page_token=req.page_token
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/files/{file_id}/metadata")
async def get_file_metadata(
    file_id: str,
    x_user_id: Optional[str] = Header(None)
):
    """Retrieves metadata for an authorized file without reading content."""
    user_id = get_current_user_id(x_user_id)
    try:
        meta = await google_drive_service.get_file_metadata(user_id=user_id, file_id=file_id)
        return meta
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File '{file_id}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/files/{file_id}/read")
async def read_file_content(
    file_id: str,
    req: Optional[DriveReadRequest] = None,
    x_user_id: Optional[str] = Header(None)
):
    """Reads a particular file only when explicitly authorized by user.
    
    Processes text in memory; content is never persisted in database or logs.
    """
    user_id = get_current_user_id(x_user_id)
    try:
        content = await google_drive_service.read_file_content(user_id=user_id, file_id=file_id)
        return content
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File '{file_id}' not found.")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/files/{file_id}/export")
async def export_workspace_document(
    file_id: str,
    req: DriveExportRequest,
    x_user_id: Optional[str] = Header(None)
):
    """Exports supported Google Workspace document to text or CSV."""
    user_id = get_current_user_id(x_user_id)
    try:
        content = await google_drive_service.read_file_content(user_id=user_id, file_id=file_id)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/activity")
async def get_drive_activity(
    limit: int = Query(default=20, ge=1, le=100),
    x_user_id: Optional[str] = Header(None)
):
    """Returns a privacy-conscious record of recent Drive access operations."""
    user_id = get_current_user_id(x_user_id)
    activities = activity_service.get_activities(user_id=user_id, limit=limit)
    return {
        "user_id": user_id,
        "activities_count": len(activities),
        "activities": activities
    }


@router.delete("/temporary-data")
async def clear_temporary_data(x_user_id: Optional[str] = Header(None)):
    """Clears temporary processing records and activity logs for user."""
    user_id = get_current_user_id(x_user_id)
    activity_service.clear_activities(user_id=user_id)
    return {
        "success": True,
        "message": "Temporary processing data and activity records cleared."
    }
