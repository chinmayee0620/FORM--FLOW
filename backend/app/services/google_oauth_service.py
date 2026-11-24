"""Google OAuth 2.0 Service for FormFlow.

Implements real OAuth 2.0 authorization-code flow using Google's official endpoints.
Enforces CSRF protection with cryptographic state validation.
Encrypts refresh tokens and manages user credentials.
"""

import secrets
import time
from typing import Dict, Any, Optional, Tuple
import httpx
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from app.config import settings
from app.database.token_store import token_store
from app.services.activity_service import activity_service

# Ephemeral state cache for CSRF protection with timestamp
_STATE_CACHE: Dict[str, Dict[str, Any]] = {}
STATE_TTL_SECONDS = 600  # 10 minutes


class GoogleOAuthService:
    """Manages Google OAuth 2.0 lifecycle."""

    def is_configured(self) -> bool:
        """Checks if real Google Client ID and Secret are configured."""
        return bool(
            settings.GOOGLE_CLIENT_ID
            and settings.GOOGLE_CLIENT_SECRET
            and not settings.GOOGLE_CLIENT_ID.startswith("your-google-client-id")
        )

    def generate_authorization_url(self, user_id: str) -> Tuple[str, str]:
        """Generates Google OAuth authorization URL with anti-CSRF state."""
        state = secrets.token_urlsafe(32)
        # Clean expired states
        now = time.time()
        expired = [s for s, data in _STATE_CACHE.items() if now - data["created_at"] > STATE_TTL_SECONDS]
        for s in expired:
            _STATE_CACHE.pop(s, None)

        _STATE_CACHE[state] = {
            "user_id": user_id,
            "created_at": now
        }

        if not self.is_configured():
            # When unconfigured, return demo/setup notice URL pointing to callback with setup notice
            redirect_uri = settings.GOOGLE_REDIRECT_URI
            return (
                f"{redirect_uri}?state={state}&unconfigured=true",
                state
            )

        # Standard client config for official google-auth-oauthlib
        client_config = {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI],
            }
        }

        flow = Flow.from_client_config(
            client_config=client_config,
            scopes=settings.GOOGLE_DRIVE_SCOPES,
            redirect_uri=settings.GOOGLE_REDIRECT_URI
        )

        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",
            state=state
        )

        return auth_url, state

    async def handle_callback(
        self,
        code: Optional[str],
        state: Optional[str],
        error: Optional[str] = None
    ) -> Dict[str, Any]:
        """Handles OAuth redirect callback from Google."""
        if error:
            return {
                "success": False,
                "error": f"Google OAuth denied: {error}",
                "user_id": None
            }

        if not state or state not in _STATE_CACHE:
            return {
                "success": False,
                "error": "Invalid or expired OAuth state parameter (CSRF protection failed).",
                "user_id": None
            }

        state_data = _STATE_CACHE.pop(state)
        user_id = state_data["user_id"]

        # Handle unconfigured setup mode
        if not self.is_configured():
            # Setup demo connection so user can see UI & test flows while GCP credentials are pending
            demo_email = "connected.user@gmail.com"
            token_store.save_tokens(
                user_id=user_id,
                google_account_email=demo_email,
                refresh_token="demo_refresh_token_unconfigured_gcp",
                access_token="demo_access_token_unconfigured_gcp",
                token_expiry=time.time() + 3600,
                granted_scopes=" ".join(settings.GOOGLE_DRIVE_SCOPES),
                connection_status="CONNECTED"
            )
            activity_service.record_activity(
                user_id=user_id,
                action="Google Drive Connected",
                details=f"Authorized account: {demo_email} (GCP credentials pending in .env)"
            )
            return {
                "success": True,
                "user_id": user_id,
                "email": demo_email,
                "notice": "Connected in development mode. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env for production credentials."
            }

        if not code:
            return {
                "success": False,
                "error": "Missing authorization code from Google.",
                "user_id": user_id
            }

        client_config = {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI],
            }
        }

        flow = Flow.from_client_config(
            client_config=client_config,
            scopes=settings.GOOGLE_DRIVE_SCOPES,
            redirect_uri=settings.GOOGLE_REDIRECT_URI,
            state=state
        )

        try:
            flow.fetch_token(code=code)
            creds = flow.credentials

            # Fetch authenticated user profile email from Google UserInfo
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {creds.token}"}
                )
                user_email = "unknown@google.com"
                if res.status_code == 200:
                    info = res.json()
                    user_email = info.get("email", user_email)

            # Store tokens encrypted at rest
            expiry_timestamp = creds.expiry.timestamp() if creds.expiry else (time.time() + 3600)
            token_store.save_tokens(
                user_id=user_id,
                google_account_email=user_email,
                refresh_token=creds.refresh_token,
                access_token=creds.token,
                token_expiry=expiry_timestamp,
                granted_scopes=" ".join(creds.scopes or settings.GOOGLE_DRIVE_SCOPES),
                connection_status="CONNECTED"
            )

            # Record privacy-conscious activity (Zero document scanning!)
            activity_service.record_activity(
                user_id=user_id,
                action="Google Drive Connected",
                details=f"Authorized read-only Drive access for {user_email}. No documents were scanned or extracted."
            )

            return {
                "success": True,
                "user_id": user_id,
                "email": user_email
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to exchange token with Google: {str(e)}",
                "user_id": user_id
            }

    async def get_valid_credentials(self, user_id: str) -> Optional[Credentials]:
        """Retrieves and automatically refreshes user Google credentials."""
        if not self.is_configured():
            return None

        token_data = token_store.get_tokens(user_id)
        if not token_data or not token_data.get("access_token"):
            return None

        # Check for demo mode tokens
        if token_data["access_token"].startswith("demo_access_token"):
            return None

        creds = Credentials(
            token=token_data["access_token"],
            refresh_token=token_data.get("refresh_token"),
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
            scopes=token_data.get("granted_scopes", "").split()
        )

        # Refresh if expired
        now = time.time()
        expiry = token_data.get("token_expiry") or 0
        if expiry <= now + 60:
            if creds.refresh_token:
                try:
                    creds.refresh(Request())
                    new_expiry = creds.expiry.timestamp() if creds.expiry else (now + 3600)
                    token_store.update_access_token(user_id, creds.token, new_expiry)
                except Exception as e:
                    print(f"[GoogleOAuth] Token refresh failed for user {user_id}: {e}")
                    return None
            else:
                return None

        return creds

    async def disconnect(self, user_id: str) -> bool:
        """Disconnects user and deletes stored tokens."""
        success = token_store.disconnect_user(user_id)
        if success:
            activity_service.record_activity(
                user_id=user_id,
                action="Google Drive Disconnected",
                details="Drive credentials and session tokens cleared from server."
            )
        return success

    async def revoke_access(self, user_id: str) -> bool:
        """Revokes token directly with Google and purges storage."""
        token_data = token_store.get_tokens(user_id)
        if token_data and token_data.get("access_token"):
            token_to_revoke = token_data.get("refresh_token") or token_data.get("access_token")
            try:
                async with httpx.AsyncClient() as client:
                    await client.post(
                        "https://oauth2.googleapis.com/revoke",
                        params={"token": token_to_revoke},
                        headers={"content-type": "application/x-www-form-urlencoded"}
                    )
            except Exception as e:
                print(f"[GoogleOAuth] Remote revoke notice: {e}")

        token_store.delete_user(user_id)
        activity_service.record_activity(
            user_id=user_id,
            action="Google Authorization Revoked",
            details="Revoked Google token with Google accounts server and deleted record."
        )
        return True


google_oauth_service = GoogleOAuthService()
