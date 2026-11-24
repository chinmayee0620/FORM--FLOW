"""MCP Server, Client, and Tool Discovery Tests."""

import pytest
from mcp_servers.google_drive_server.server import GoogleDriveMCPServerAdapter
from app.database.token_store import token_store


@pytest.fixture(autouse=True)
def setup_mcp_test_user():
    token_store.save_tokens(
        user_id="mcp_test_user",
        google_account_email="mcp_tester@gmail.com",
        refresh_token="demo_refresh_token",
        access_token="demo_access_token",
        token_expiry=1990000000,
        granted_scopes="https://www.googleapis.com/auth/drive.readonly",
        connection_status="CONNECTED"
    )
    yield
    token_store.delete_user("mcp_test_user")


@pytest.mark.asyncio
async def test_mcp_server_connect_and_tool_discovery():
    adapter = GoogleDriveMCPServerAdapter()
    connected = await adapter.connect()
    assert connected is True

    tools = await adapter.list_tools()
    assert len(tools) == 8
    names = [t.name for t in tools]
    assert "search_drive_files" in names
    assert "list_drive_files" in names
    assert "get_drive_file_metadata" in names
    assert "read_drive_file" in names
    assert "export_google_document" in names
    assert "list_drive_folders" in names
    assert "get_drive_connection_status" in names
    assert "disconnect_drive" in names


@pytest.mark.asyncio
async def test_invoke_search_drive_files_tool():
    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()
    res = await adapter.call_tool(
        tool_name="search_drive_files",
        arguments={"user_id": "mcp_test_user", "query": "income"}
    )
    assert res.status == "success"
    assert "files" in res.result
    assert res.result["matches_count"] > 0


@pytest.mark.asyncio
async def test_invoke_read_drive_file_tool():
    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()
    res = await adapter.call_tool(
        tool_name="read_drive_file",
        arguments={"user_id": "mcp_test_user", "file_id": "gov_income_certificate_2025_03"}
    )
    assert res.status == "success"
    assert "extracted_text" in res.result
    assert "2,40,000" in res.result["extracted_text"]


@pytest.mark.asyncio
async def test_user_specific_authorization_enforced():
    adapter = GoogleDriveMCPServerAdapter()
    await adapter.connect()
    # Call with non-authorized user must return error
    res = await adapter.call_tool(
        tool_name="search_drive_files",
        arguments={"user_id": "unauthorized_attacker_id", "query": "confidential"}
    )
    assert res.status == "error"
