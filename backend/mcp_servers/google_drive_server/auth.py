"""Authorization and user context validator for Google Drive MCP Server."""

from typing import Optional
from app.database.token_store import token_store


class UserSecurityContext:
    """Represents the validated user session context passed to MCP tools."""

    def __init__(self, user_id: str):
        if not user_id or not isinstance(user_id, str):
            raise PermissionError("MCP Security Violation: Invalid or missing user_id in tool context.")
        self.user_id = user_id.strip()

    def validate_connection(self) -> dict:
        """Validates that this specific user has an active, authorized Drive connection."""
        status = token_store.get_status(self.user_id)
        if not status or not status.get("is_connected"):
            raise PermissionError(
                f"Google Drive is not connected for user '{self.user_id}'. "
                "The user must authorize Google Drive via OAuth before accessing Drive tools."
            )
        return status
