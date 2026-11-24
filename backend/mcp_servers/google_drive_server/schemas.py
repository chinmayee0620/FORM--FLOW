"""Pydantic schemas for Google Drive MCP tool arguments and outputs."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DriveFileMetadata(BaseModel):
    id: str
    name: str
    mimeType: str
    size: Optional[str] = None
    modifiedTime: Optional[str] = None
    category: Optional[str] = None
    webViewLink: Optional[str] = None


class SearchDriveFilesInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    query: str = Field(description="Keywords to search in file name and metadata")
    mime_type: Optional[str] = Field(default=None, description="Optional MIME type filter")
    folder_id: Optional[str] = Field(default=None, description="Optional folder ID")
    page_size: int = Field(default=10, description="Max results to return")


class ReadDriveFileInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    file_id: str = Field(description="Google Drive file ID to read")
    purpose: Optional[str] = Field(default="user_query", description="Reason for reading document")


class ExportGoogleDocumentInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    file_id: str = Field(description="Google Workspace document ID")
    target_format: str = Field(default="text/plain", description="Desired export format (text/plain, text/csv)")


class GetFileMetadataInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    file_id: str = Field(description="Google Drive file ID")


class ListDriveFoldersInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
    parent_folder_id: Optional[str] = Field(default=None, description="Optional parent folder ID")


class DisconnectDriveInput(BaseModel):
    user_id: str = Field(description="Authenticated user identifier")
