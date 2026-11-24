"""Configuration for Google Drive MCP Server."""

import os
from pydantic import BaseModel


class GoogleDriveMCPSettings(BaseModel):
    SERVER_NAME: str = "Google Drive MCP Server"
    SERVER_VERSION: str = "1.0.0"
    DEFAULT_TRANSPORT: str = "in_memory"  # supports in_memory, streamable_http, sse


mcp_drive_settings = GoogleDriveMCPSettings()
