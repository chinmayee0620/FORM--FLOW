"""Drive Activity Service.

Maintains a privacy-conscious, user-isolated log of Google Drive operations.
CRITICAL: Never logs document contents, extracted values, or sensitive payload data.
"""

import time
import uuid
from typing import List, Dict, Any, Optional
from collections import defaultdict


class ActivityService:
    """Manages in-memory activity logs per user with rotation."""

    def __init__(self, max_per_user: int = 50):
        self._logs: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.max_per_user = max_per_user

    def record_activity(
        self,
        user_id: str,
        action: str,
        details: str,
        status: str = "success",
        doc_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Records a privacy-conscious activity entry."""
        entry = {
            "id": f"act_{uuid.uuid4().hex[:8]}",
            "timestamp": time.time(),
            "timestamp_formatted": time.strftime("%I:%M:%S %p", time.localtime()),
            "action": action,
            "details": details,
            "status": status,
            "document_name": doc_name
        }
        user_list = self._logs[user_id]
        user_list.insert(0, entry)
        if len(user_list) > self.max_per_user:
            user_list.pop()
        return entry

    def get_activities(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Returns recent activity entries for the user."""
        return self._logs[user_id][:limit]

    def clear_activities(self, user_id: str) -> None:
        """Clears user activities."""
        self._logs[user_id].clear()


activity_service = ActivityService()
