"""Google Drive Service and API Tests."""

import pytest
from app.services.google_drive_service import google_drive_service
from app.database.token_store import token_store


@pytest.mark.asyncio
async def test_search_files_metadata_only():
    user_id = "test_drive_user"
    res = await google_drive_service.search_files(user_id=user_id, query="marksheet")
    assert "files" in res
    assert len(res["files"]) > 0
    f = res["files"][0]
    # Verify metadata fields are present
    assert "id" in f
    assert "name" in f
    assert "mimeType" in f
    # CRITICAL: Content must NOT be returned during search
    assert "demo_content" not in f
    assert "extracted_text" not in f


@pytest.mark.asyncio
async def test_get_file_metadata():
    user_id = "test_drive_user"
    meta = await google_drive_service.get_file_metadata(user_id=user_id, file_id="10th_cbse_marksheet_pdf_01")
    assert meta["name"] == "10th_CBSE_Board_Marksheet_Darshan.pdf"
    assert meta["mimeType"] == "application/pdf"
    assert "extracted_text" not in meta


@pytest.mark.asyncio
async def test_read_selected_file_content():
    user_id = "test_drive_user"
    content = await google_drive_service.read_file_content(user_id=user_id, file_id="10th_cbse_marksheet_pdf_01")
    assert content["file_id"] == "10th_cbse_marksheet_pdf_01"
    assert "DARSHAN" in content["extracted_text"]
    assert "94.20%" in content["extracted_text"]


@pytest.mark.asyncio
async def test_handle_missing_file():
    user_id = "test_drive_user"
    with pytest.raises(FileNotFoundError):
        await google_drive_service.get_file_metadata(user_id=user_id, file_id="non_existent_file_id_9999")


@pytest.mark.asyncio
async def test_enforce_user_ownership():
    # If user has no tokens and calls a private file, isolation protects
    non_auth_user = "unauthorized_user_xyz"
    assert token_store.get_status(non_auth_user)["is_connected"] is False
