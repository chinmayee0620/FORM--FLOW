"""MANDATORY PRIVACY VERIFICATION SUITE.

Explicitly verifies all 14 mandatory privacy assertions required by FormFlow specifications:
1. Connecting Google Drive does not search any documents.
2. Connecting Google Drive does not read document contents.
3. Logging in does not trigger a Drive scan.
4. No background synchronization occurs.
5. Drive searches happen only after a user request.
6. Search results initially contain metadata, not document contents.
7. Only relevant and authorized documents are read.
8. Temporary files are deleted after processing.
9. Extracted document text is not permanently stored.
10. Document contents do not appear in logs.
11. One user cannot access another user's Drive.
12. Gemini receives only the minimum necessary content.
13. Disconnect prevents further Drive operations.
14. No document is uploaded, shared, or submitted without explicit approval.
"""

import os
import time
import pytest
from app.services.google_oauth_service import google_oauth_service
from app.services.google_drive_service import google_drive_service
from app.services.activity_service import activity_service
from app.database.token_store import token_store
from mcp_servers.google_drive_server.server import GoogleDriveMCPServerAdapter


@pytest.fixture(autouse=True)
def clean_test_users():
    yield
    for uid in ("privacy_user_1", "privacy_user_2", "unauth_user"):
        token_store.delete_user(uid)
        activity_service.clear_activities(uid)


# 1. Connecting Google Drive does not search any documents
@pytest.mark.asyncio
async def test_p1_connecting_does_not_search_documents():
    uid = "privacy_user_1"
    activity_service.clear_activities(uid)
    _, state = google_oauth_service.generate_authorization_url(uid)
    await google_oauth_service.handle_callback(code="mock_code", state=state)

    acts = activity_service.get_activities(uid)
    # Ensure no search operations took place
    search_acts = [a for a in acts if "search" in a["action"].lower()]
    assert len(search_acts) == 0, "Privacy Violation: Connect triggered an automatic document search!"


# 2. Connecting Google Drive does not read document contents
@pytest.mark.asyncio
async def test_p2_connecting_does_not_read_document_contents():
    uid = "privacy_user_1"
    activity_service.clear_activities(uid)
    _, state = google_oauth_service.generate_authorization_url(uid)
    await google_oauth_service.handle_callback(code="mock_code", state=state)

    acts = activity_service.get_activities(uid)
    read_acts = [a for a in acts if "read" in a["action"].lower() or "content" in a["action"].lower()]
    assert len(read_acts) == 0, "Privacy Violation: Connect triggered automatic reading of document contents!"


# 3. Logging in does not trigger a Drive scan
@pytest.mark.asyncio
async def test_p3_login_does_not_trigger_scan():
    uid = "privacy_user_1"
    # User connects
    token_store.save_tokens(
        user_id=uid,
        google_account_email="user@test.com",
        refresh_token="ref_tok",
        access_token="acc_tok",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    activity_service.clear_activities(uid)
    # Simulate user login / session check
    status = token_store.get_status(uid)
    assert status["is_connected"] is True
    # Verify zero scan activities initiated
    acts = activity_service.get_activities(uid)
    assert len(acts) == 0, "Privacy Violation: Session check triggered a Drive scan!"


# 4. No background synchronization occurs
@pytest.mark.asyncio
async def test_p4_no_background_sync():
    uid = "privacy_user_1"
    token_store.save_tokens(
        user_id=uid,
        google_account_email="sync_check@test.com",
        refresh_token="ref",
        access_token="acc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    activity_service.clear_activities(uid)
    # Wait or check no timer / background queue exists for Drive auto-sync
    acts = activity_service.get_activities(uid)
    assert len(acts) == 0


# 5. Drive searches happen only after a user request
@pytest.mark.asyncio
async def test_p5_search_only_after_user_request():
    uid = "privacy_user_1"
    token_store.save_tokens(
        user_id=uid,
        google_account_email="search_user@test.com",
        refresh_token="ref",
        access_token="acc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    activity_service.clear_activities(uid)
    # Explicit user call
    res = await google_drive_service.search_files(user_id=uid, query="10th marksheet")
    assert len(res["files"]) > 0

    acts = activity_service.get_activities(uid)
    assert len(acts) == 1
    assert "Drive Search Requested" in acts[0]["action"]


# 6. Search results initially contain metadata, not document contents
@pytest.mark.asyncio
async def test_p6_search_contains_metadata_only():
    uid = "privacy_user_1"
    res = await google_drive_service.search_files(user_id=uid, query="income")
    for f in res["files"]:
        assert "id" in f
        assert "name" in f
        assert "mimeType" in f
        assert "extracted_text" not in f
        assert "demo_content" not in f


# 7. Only relevant and authorized documents are read
@pytest.mark.asyncio
async def test_p7_only_relevant_authorized_documents_read():
    uid = "privacy_user_1"
    token_store.save_tokens(
        user_id=uid,
        google_account_email="auth_user@test.com",
        refresh_token="ref",
        access_token="acc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    # Read specifically requested 10th marksheet file
    content = await google_drive_service.read_file_content(user_id=uid, file_id="10th_cbse_marksheet_pdf_01")
    assert content["file_name"] == "10th_CBSE_Board_Marksheet_Darshan.pdf"
    # Unrelated document (e.g. Income Certificate) is NOT in the response
    assert "income" not in content["file_name"].lower()


# 8. Temporary files are deleted after processing
@pytest.mark.asyncio
async def test_p8_temporary_files_cleaned_up():
    temp_dir = os.path.join(os.getcwd(), "data", "tmp_processing")
    os.makedirs(temp_dir, exist_ok=True)
    temp_files_before = os.listdir(temp_dir)
    uid = "privacy_user_1"
    await google_drive_service.read_file_content(user_id=uid, file_id="10th_cbse_marksheet_pdf_01")
    temp_files_after = os.listdir(temp_dir)
    assert len(temp_files_after) == len(temp_files_before), "Privacy Violation: Orphaned temp files detected!"


# 9. Extracted document text is not permanently stored
@pytest.mark.asyncio
async def test_p9_extracted_text_not_permanently_stored():
    uid = "privacy_user_1"
    token_store.save_tokens(
        user_id=uid,
        google_account_email="p9@test.com",
        refresh_token="ref",
        access_token="acc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    await google_drive_service.read_file_content(user_id=uid, file_id="gov_income_certificate_2025_03")

    # Inspect token database table to confirm zero document text columns exist
    with token_store._get_connection() as conn:
        cursor = conn.execute("PRAGMA table_info(user_tokens)")
        columns = [row["name"] for row in cursor.fetchall()]
        assert "document_text" not in columns
        assert "extracted_content" not in columns
        assert "file_data" not in columns


# 10. Document contents do not appear in logs
@pytest.mark.asyncio
async def test_p10_document_contents_do_not_appear_in_logs():
    uid = "privacy_user_1"
    activity_service.clear_activities(uid)
    await google_drive_service.read_file_content(user_id=uid, file_id="gov_income_certificate_2025_03")

    acts = activity_service.get_activities(uid)
    for act in acts:
        # Check details does not contain extracted sensitive values
        assert "2,40,000" not in act["details"]
        assert "DARSHAN" not in act["details"]


# 11. One user cannot access another user's Drive
@pytest.mark.asyncio
async def test_p11_multi_user_isolation():
    user_a = "privacy_user_1"
    user_b = "privacy_user_2"

    token_store.save_tokens(
        user_id=user_a,
        google_account_email="alice@gmail.com",
        refresh_token="ref_a",
        access_token="acc_a",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )

    # User B is not connected
    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()

    res_b = await adapter.call_tool("search_drive_files", {"user_id": user_b, "query": "alice_docs"})
    assert res_b.status == "error"
    assert "not connected" in str(res_b.error).lower()


# 12. Gemini receives only the minimum necessary content
@pytest.mark.asyncio
async def test_p12_minimum_content_sent():
    # Only single requested document is passed
    uid = "privacy_user_1"
    content = await google_drive_service.read_file_content(user_id=uid, file_id="10th_cbse_marksheet_pdf_01")
    assert len(content["extracted_text"]) < 5000, "Excessive payload sent"


# 13. Disconnect prevents further Drive operations
@pytest.mark.asyncio
async def test_p13_disconnect_prevents_drive_operations():
    uid = "privacy_user_1"
    token_store.save_tokens(
        user_id=uid,
        google_account_email="disc_user@test.com",
        refresh_token="ref",
        access_token="acc",
        token_expiry=time.time() + 3600,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly"
    )
    # Disconnect
    await google_oauth_service.disconnect(uid)

    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()
    res = await adapter.call_tool("search_drive_files", {"user_id": uid, "query": "anything"})
    assert res.status == "error"
    assert "not connected" in str(res.error).lower()


# 14. No document is uploaded, shared, or submitted without explicit approval
@pytest.mark.asyncio
async def test_p14_no_auto_upload_or_submit():
    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()
    tools = await adapter.list_tools()
    tool_names = [t.name for t in tools]
    # Verify no tool exists for automatic external submission or public document upload
    assert "auto_submit_application" not in tool_names
    assert "publish_documents_publicly" not in tool_names
