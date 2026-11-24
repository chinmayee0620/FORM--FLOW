"""OAuth and Security Tests for Google Drive Authentication."""

import pytest
import time
from app.services.google_oauth_service import google_oauth_service
from app.database.token_store import token_store


@pytest.mark.asyncio
async def test_oauth_start_endpoint():
    auth_url, state = google_oauth_service.generate_authorization_url(user_id="test_user_oauth")
    assert auth_url is not None
    assert len(state) >= 32
    assert "state=" in auth_url


@pytest.mark.asyncio
async def test_callback_invalid_state_rejected():
    res = await google_oauth_service.handle_callback(code="some_code", state="invalid_fake_state_12345")
    assert res["success"] is False
    assert "CSRF" in res["error"] or "state" in res["error"]


@pytest.mark.asyncio
async def test_callback_permission_denial():
    _, state = google_oauth_service.generate_authorization_url(user_id="test_user_denial")
    res = await google_oauth_service.handle_callback(code=None, state=state, error="access_denied")
    assert res["success"] is False
    assert "denied" in res["error"].lower()


@pytest.mark.asyncio
async def test_successful_connection_and_token_storage():
    _, state = google_oauth_service.generate_authorization_url(user_id="test_user_connect")
    res = await google_oauth_service.handle_callback(code="valid_mock_code", state=state)
    assert res["success"] is True
    assert res["user_id"] == "test_user_connect"

    # Verify stored encrypted tokens
    status = token_store.get_status("test_user_connect")
    assert status["is_connected"] is True
    assert status["google_account_email"] is not None


@pytest.mark.asyncio
async def test_disconnect_and_token_purge():
    # Setup connected user
    token_store.save_tokens(
        user_id="user_to_disconnect",
        google_account_email="disc@example.com",
        refresh_token="ref_tok_disc",
        access_token="acc_tok_disc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    assert token_store.get_status("user_to_disconnect")["is_connected"] is True

    # Disconnect
    success = await google_oauth_service.disconnect("user_to_disconnect")
    assert success is True
    assert token_store.get_status("user_to_disconnect")["is_connected"] is False
    assert token_store.get_tokens("user_to_disconnect") is None


@pytest.mark.asyncio
async def test_revoke_handling():
    token_store.save_tokens(
        user_id="user_to_revoke",
        google_account_email="rev@example.com",
        refresh_token="ref_tok_rev",
        access_token="acc_tok_rev",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    rev_success = await google_oauth_service.revoke_access("user_to_revoke")
    assert rev_success is True
    assert token_store.get_tokens("user_to_revoke") is None
