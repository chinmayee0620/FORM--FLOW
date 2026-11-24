# FormFlow – Intelligent Application & Form Assistant

> **"From scattered documents to intelligent application completion."**

FormFlow is an AI-powered, MCP-based application assistant that connects authorized user documents from **Google Drive**, checks application requirements across portals, performs cross-document data verification, prepares assisted application workflows, provides proactive renewal intelligence, and recommends personalized opportunities.

---

## 🔒 Mandatory Privacy Architecture (Strict User Consent)

FormFlow operates on a **zero-retention, on-demand** privacy model. Connecting Google Drive does **NOT** turn FormFlow into another document storage platform.

1. **Zero Auto-Scan**: Connecting Google Drive never triggers automatic scans, downloads, vector embeddings, or background indexing.
2. **On-Demand Search**: FormFlow searches Google Drive **only when you explicitly ask a question** (e.g., *"Find my 10th marks card"*).
3. **Metadata-First Discovery**: Search results display metadata (file name, size, type) without reading file contents.
4. **Single-File In-Memory Reading**: Content is retrieved only for the specific document needed, read in-memory, and **never saved to a database or logs**.
5. **No Permanent Document Storage**: Extracted document text is kept ephemerally in RAM during processing and wiped immediately.
6. **Token Encryption at Rest**: OAuth refresh tokens are encrypted using AES-256 (Fernet) and isolated strictly by authenticated user ID.
7. **Human Approval Gates**: Form filling proposes values with citations to source documents. Values can be reviewed and edited; FormFlow **never automatically submits applications or uploads documents** without separate explicit confirmation.

---

## 🛠️ Official Google Drive MCP Architecture

FormFlow uses the official **Model Context Protocol (MCP)** Python SDK (`mcp 2.3.0`) with a dedicated Google Drive MCP Server located at `backend/mcp_servers/google_drive_server/`.

### Exposed MCP Tools:

| Tool | Purpose | Privacy & Behavior |
| :--- | :--- | :--- |
| `search_drive_files` | Search user's Drive using keywords and metadata | Returns file metadata only. Does **not** read file contents. |
| `list_drive_files` | List files in a specified folder or matching filter | Metadata only. |
| `get_drive_file_metadata` | Retrieve file attributes, size, and modified date | Non-sensitive attributes only. |
| `read_drive_file` | Read an authorized file on demand | Processes PDF/DOCX/TXT in memory; never saved to database. |
| `export_google_document` | Export Google Docs/Sheets to text/CSV | Temporary memory export. |
| `list_drive_folders` | Retrieve folder metadata | Navigation only. |
| `get_drive_connection_status`| Check authenticated user's Drive connection | Returns connection state and email. |
| `disconnect_drive` | Disconnect and revoke user credentials | Purges encrypted tokens permanently. |

---

## ☁️ Google Cloud Platform (GCP) Configuration Guide

To connect your real Google Drive to FormFlow:

### Step 1: Open Google Cloud Console
Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/) and create a project (e.g. `FormFlow-Assistant`).

### Step 2: Enable Google Drive API
1. Go to **APIs & Services → Library**.
2. Search for **Google Drive API** and click **Enable**.

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**.
2. Select User Type: **External** (or Internal if using Google Workspace).
3. Fill in:
   - **App name**: `FormFlow`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Under **Scopes**, click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/drive.readonly` (Read-only Drive search)
   - `https://www.googleapis.com/auth/userinfo.email` (User identity verification)
5. Under **Test Users**, add your Google email address (while app status is "Testing").

### Step 4: Create OAuth 2.0 Web Application Credentials
1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `FormFlow Web Client`.
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8000/api/auth/google/drive/callback
   ```
5. Click **Create** and copy your **Client ID** and **Client Secret**.

### Step 5: Configure Backend Environment
Copy `backend/.env.example` to `backend/.env`:
```bash
cd backend
copy .env.example .env
```
Edit `backend/.env` with your credentials:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/drive/callback
```

> **Note**: If GCP credentials are not yet configured, FormFlow runs in an interactive development mode with verified sample documents for Darshan (`10th CBSE Marksheet`, `Income Certificate`, etc.) so you can test all MCP tool execution and chat workflows immediately.

---

## 🚀 Running FormFlow

### 1. Backend (FastAPI + Official MCP Server)
```bash
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Launch Backend Orchestrator
python run_backend.py
# → Operational at http://localhost:8000/
# → Swagger API Docs at http://localhost:8000/docs
```

### 2. Frontend (React 19 + Vite)
```bash
cd frontend

# Install dependencies (if not already installed)
npm run build

# Start Vite development server
npm run dev
# → http://localhost:5173/
```

---

## 🧪 Automated Test Verification

The backend includes a comprehensive 29-test automated test suite covering OAuth flows, Google Drive operations, MCP servers, and all **14 mandatory privacy assertions**:

```bash
cd backend
.\venv\Scripts\activate
pytest tests -v
```

### Verified Test Results:
- `tests/test_google_drive.py` (5 tests): On-demand search, metadata retrieval, in-memory reading, missing file handling, ownership checks.
- `tests/test_mcp_server.py` (4 tests): MCP tool discovery (8 tools), dynamic tool calling, security context enforcement.
- `tests/test_oauth.py` (6 tests): OAuth URL generation, anti-CSRF state rejection, permission denial, token encryption, disconnect, revocation.
- `tests/test_privacy_mandatory.py` (14 tests):
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

**All 29 tests pass with zero warnings.**

---

## 💬 Example Assistant Interactions

### Example 1: 10th Marksheet & Percentage
**User**: *"Find my 10th marks card and tell me my total percentage."*
1. FormFlow queries the Google Drive MCP Server (`search_drive_files`).
2. Identifies `10th_CBSE_Board_Marksheet_Darshan.pdf`.
3. Reads the file in memory (`read_drive_file`).
4. Calculates **94.20% (471/500)**.
5. Returns the breakdown with source document citation.

### Example 2: Income Certificate Audit
**User**: *"Find my income certificate and tell me the annual income."*
1. FormFlow locates `Government_Income_Certificate_2025.pdf`.
2. Reads the certificate ephemerally.
3. Returns **₹2,40,000 / year**, valid till **31 March 2026**.
4. Discloses source document citation without storing document text.
