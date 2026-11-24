"""Google OAuth 2.0 Endpoints.

Handles authorization URL generation, Google OAuth callbacks, status checks,
disconnection, and token revocation.
"""

from typing import Optional
from fastapi import APIRouter, Header, Query, Request, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from app.services.google_oauth_service import google_oauth_service
from app.database.token_store import token_store

router = APIRouter(prefix="/api/auth/google/drive", tags=["Google OAuth"])


def get_current_user_id(x_user_id: Optional[str] = Header(None)) -> str:
    """Extracts authenticated user ID from header or falls back to default prototype session."""
    return x_user_id.strip() if x_user_id and x_user_id.strip() else "user_darshan"


@router.post("/start")
async def start_google_drive_oauth(
    x_user_id: Optional[str] = Header(None),
    redirect_override: Optional[str] = Query(None)
):
    """Starts Google OAuth 2.0 authorization-code flow.
    
    Returns authorization URL for popup or browser redirect.
    """
    user_id = get_current_user_id(x_user_id)
    auth_url, state = google_oauth_service.generate_authorization_url(user_id=user_id)

    return {
        "success": True,
        "auth_url": auth_url,
        "state": state,
        "user_id": user_id,
        "is_configured": google_oauth_service.is_configured(),
        "notice": (
            "Ready for Google OAuth. Once approved in the Google popup, your Drive will connect with read-only scope."
            if google_oauth_service.is_configured()
            else "GCP Credentials pending in .env. Running in interactive development mode."
        )
    }


@router.get("/callback")
async def google_drive_oauth_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    unconfigured: Optional[str] = Query(None)
):
    """Handles OAuth callback from Google.
    
    Renders an HTML response that posts an 'oauth_success' message to the opener window
    and automatically closes the popup cleanly.
    """
    res = await google_oauth_service.handle_callback(code=code, state=state, error=error)
    
    status_str = "SUCCESS" if res.get("success") else "ERROR"
    email = res.get("email", "")
    err_msg = res.get("error", "")

    html_content = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Drive Authorization - FormFlow</title>
        <style>
          body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f9f9f9;
            color: #18181b;
          }}
          .card {{
            background: #ffffff;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            border: 1px solid #e4e4e7;
            text-align: center;
            max-width: 420px;
          }}
          .title {{ font-size: 18px; font-weight: 600; margin-bottom: 8px; }}
          .desc {{ font-size: 13px; color: #71717a; margin-bottom: 20px; }}
          .badge {{ display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 500; }}
          .success {{ background: #ecfdf5; color: #047857; }}
          .error {{ background: #fef2f2; color: #b91c1c; }}
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">
            {'✅ Google Drive Connected!' if res.get("success") else '❌ Connection Failed'}
          </div>
          <div class="desc">
            {'Authorized Google Account: ' + email if res.get("success") else err_msg}
          </div>
          <div class="badge {'success' if res.get("success") else 'error'}">
            {status_str}
          </div>
          <p style="font-size: 11px; color: #a1a1aa; margin-top: 18px;">
            This window will close automatically...
          </p>
        </div>
        <script>
          if (window.opener) {{
            window.opener.postMessage({{
              type: 'GOOGLE_DRIVE_OAUTH_RESULT',
              success: {'true' if res.get("success") else 'false'},
              email: '{email}',
              error: '{err_msg}'
            }}, '*');
            setTimeout(function() {{ window.close(); }}, 1200);
          }} else {{
            setTimeout(function() {{ window.location.href = 'http://localhost:5173/documents'; }}, 1500);
          }}
        </script>
      </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200 if res.get("success") else 400)


@router.get("/status")
async def get_google_drive_status(x_user_id: Optional[str] = Header(None)):
    """Returns the authenticated user's Google Drive connection status."""
    user_id = get_current_user_id(x_user_id)
    status = token_store.get_status(user_id)
    return {
        "user_id": user_id,
        "is_configured_gcp": google_oauth_service.is_configured(),
        **status
    }


@router.post("/disconnect")
async def disconnect_google_drive(x_user_id: Optional[str] = Header(None)):
    """Disconnects Google Drive and purges credentials."""
    user_id = get_current_user_id(x_user_id)
    success = await google_oauth_service.disconnect(user_id)
    return {
        "success": success,
        "message": "Google Drive disconnected. Stored tokens cleared."
    }


@router.post("/revoke")
async def revoke_google_drive_access(x_user_id: Optional[str] = Header(None)):
    """Revokes token remotely with Google accounts server and deletes local tokens."""
    user_id = get_current_user_id(x_user_id)
    success = await google_oauth_service.revoke_access(user_id)
    return {
        "success": success,
        "message": "Google Drive access revoked with Google accounts server and deleted locally."
    }
