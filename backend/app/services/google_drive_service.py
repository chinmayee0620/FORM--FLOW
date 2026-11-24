"""Google Drive Service Layer.

Provides real Google Drive API v3 interactions:
- On-demand file search by metadata/name.
- File metadata inspection.
- On-demand single document reading with in-memory parsing (PDF, DOCX, TXT, Google Docs).
- Guaranteed zero persistent storage of document contents.
- Strict multi-user credential isolation.
"""

import io
import os
import tempfile
from typing import List, Dict, Any, Optional
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from pypdf import PdfReader
from docx import Document
from app.services.google_oauth_service import google_oauth_service
from app.database.token_store import token_store
from app.services.activity_service import activity_service

# Safe size limits for on-demand document text processing
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

# Fallback verified mock drive documents for demo / offline development
DEMO_DRIVE_DOCUMENTS = [
    {
        "id": "10th_cbse_marksheet_pdf_01",
        "name": "10th_CBSE_Board_Marksheet_Darshan.pdf",
        "mimeType": "application/pdf",
        "size": "412580",
        "modifiedTime": "2024-05-18T10:15:00Z",
        "category": "Academic",
        "demo_content": (
            "CENTRAL BOARD OF SECONDARY EDUCATION - SECONDARY SCHOOL EXAMINATION 2023\n"
            "Candidate Name: DARSHAN K\n"
            "Roll No: 14682910\n"
            "School: National Public School, Bangalore\n"
            "Subject Marks:\n"
            "101 English: 95/100 (A1)\n"
            "085 Hindi Course-B: 92/100 (A1)\n"
            "041 Mathematics Standard: 98/100 (A1)\n"
            "086 Science: 96/100 (A1)\n"
            "087 Social Science: 90/100 (A2)\n"
            "Total Marks Obtained: 471/500\n"
            "Aggregate Percentage: 94.20%\n"
            "Result: PASS"
        )
    },
    {
        "id": "12th_cbse_marksheet_pdf_02",
        "name": "12th_CBSE_Board_Marksheet_Darshan.pdf",
        "mimeType": "application/pdf",
        "size": "528400",
        "modifiedTime": "2025-05-22T14:30:00Z",
        "category": "Academic",
        "demo_content": (
            "CENTRAL BOARD OF SECONDARY EDUCATION - SENIOR SCHOOL CERTIFICATE EXAMINATION 2025\n"
            "Candidate Name: DARSHAN K\n"
            "Roll No: 24691032\n"
            "School: National Public School, Bangalore\n"
            "Subject Marks:\n"
            "301 English Core: 94/100\n"
            "041 Mathematics: 97/100\n"
            "042 Physics: 96/100\n"
            "043 Chemistry: 95/100\n"
            "083 Computer Science: 98/100\n"
            "Total Marks Obtained: 480/500\n"
            "Aggregate Percentage: 96.00%\n"
            "PCM Percentage: 96.00%\n"
            "Result: PASS"
        )
    },
    {
        "id": "gov_income_certificate_2025_03",
        "name": "Government_Income_Certificate_2025.pdf",
        "mimeType": "application/pdf",
        "size": "320140",
        "modifiedTime": "2025-04-02T09:00:00Z",
        "category": "Certificates",
        "demo_content": (
            "GOVERNMENT OF KARNATAKA - REVENUE DEPARTMENT\n"
            "OFFICE OF THE TAHSILDAR, BANGALORE NORTH TALUK\n"
            "INCOME CERTIFICATE (RD00382910482)\n"
            "This is to certify that Sri/Kumari DARSHAN K, son of KRISHNA MURTHY,\n"
            "residing at #42, 3rd Cross, Malleshwaram, Bangalore - 560003,\n"
            "has an annual family income of Rs. 2,40,000/- (Rupees Two Lakh Forty Thousand Only)\n"
            "from all sources.\n"
            "Date of Issue: 02/04/2025\n"
            "Valid Till: 31/03/2026\n"
            "Digital Signature: Tahsildar Bangalore North"
        )
    },
    {
        "id": "msrit_bonafide_certificate_04",
        "name": "MSRIT_Bonafide_Student_Certificate_2026.pdf",
        "mimeType": "application/pdf",
        "size": "298710",
        "modifiedTime": "2026-08-10T11:20:00Z",
        "category": "Academic",
        "demo_content": (
            "RAMAIAH INSTITUTE OF TECHNOLOGY (MSRIT) - BANGALORE\n"
            "BONAFIDE CERTIFICATE\n"
            "Ref: MSRIT/ADM/2026/4102\n"
            "Date: 10 August 2026\n"
            "This is to certify that Mr. DARSHAN K (USN: 1MS24CS042) is a bonafide student\n"
            "of Ramaiah Institute of Technology, Bangalore, pursuing Bachelor of Engineering (B.E.)\n"
            "in Computer Science and Engineering during the academic year 2026-2027 (2nd Year / 3rd Semester).\n"
            "He bears good moral character and conduct.\n"
            "Registrar / Principal - MSRIT"
        )
    },
    {
        "id": "aadhaar_card_masked_05",
        "name": "Aadhaar_Card_UIDAI_Masked.pdf",
        "mimeType": "application/pdf",
        "size": "651200",
        "modifiedTime": "2023-11-14T16:45:00Z",
        "category": "Identity",
        "demo_content": (
            "UNIQUE IDENTIFICATION AUTHORITY OF INDIA (UIDAI)\n"
            "Government of India\n"
            "Aadhaar Number: XXXX-XXXX-8912\n"
            "Name: Darshan K\n"
            "DOB: 15/08/2006\n"
            "Gender: Male\n"
            "Address: #42, 3rd Cross, Malleshwaram, Bangalore, Karnataka - 560003\n"
            "Note: Per UIDAI official directives, Aadhaar cards do not expire."
        )
    }
]


class GoogleDriveService:
    """Real Google Drive v3 client wrapper with strict privacy controls."""

    async def _get_drive_client(self, user_id: str):
        """Builds an authenticated Google Drive v3 client for the user."""
        creds = await google_oauth_service.get_valid_credentials(user_id)
        if not creds:
            return None
        return build("drive", "v3", credentials=creds, cache_discovery=False)

    async def search_files(
        self,
        user_id: str,
        query: str,
        mime_type: Optional[str] = None,
        folder_id: Optional[str] = None,
        page_size: int = 10,
        page_token: Optional[str] = None
    ) -> Dict[str, Any]:
        """Searches user's Google Drive files by query and metadata.
        
        CRITICAL: Only retrieves file metadata. Does NOT read or extract file contents.
        """
        service = await self._get_drive_client(user_id)
        
        if not service:
            # Fallback for offline / dev demo
            q_lower = query.lower()
            filtered = [
                d for d in DEMO_DRIVE_DOCUMENTS
                if any(w in d["name"].lower() for w in q_lower.split()) or (mime_type and d["mimeType"] == mime_type)
            ]
            if not filtered and q_lower in ("all", "*", ""):
                filtered = DEMO_DRIVE_DOCUMENTS
            elif not filtered:
                # Return most relevant fallback
                filtered = [d for d in DEMO_DRIVE_DOCUMENTS if any(k in d["name"].lower() for k in ("marksheet", "income", "bonafide"))][:3]

            metadata_only = [
                {
                    "id": d["id"],
                    "name": d["name"],
                    "mimeType": d["mimeType"],
                    "size": d["size"],
                    "modifiedTime": d["modifiedTime"],
                    "category": d.get("category", "General")
                }
                for d in filtered
            ]

            activity_service.record_activity(
                user_id=user_id,
                action="Drive Search Requested",
                details=f"Query '{query}' returned {len(metadata_only)} matching documents (metadata only)."
            )

            return {
                "files": metadata_only,
                "nextPageToken": None,
                "total_matched": len(metadata_only),
                "is_demo_fallback": True
            }

        # Build real Google Drive v3 q query
        clauses = ["trashed = false"]
        if query:
            # Escape single quotes in user query
            safe_query = query.replace("'", "\\'")
            clauses.append(f"name contains '{safe_query}'")
        if mime_type:
            clauses.append(f"mimeType = '{mime_type}'")
        if folder_id:
            clauses.append(f"'{folder_id}' in parents")

        q_string = " and ".join(clauses)

        try:
            results = service.files().list(
                q=q_string,
                pageSize=min(page_size, 50),
                pageToken=page_token,
                fields="nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)",
                spaces="drive"
            ).execute()

            files = results.get("files", [])
            activity_service.record_activity(
                user_id=user_id,
                action="Drive Search Requested",
                details=f"Query '{query}' returned {len(files)} matching documents from Google Drive (metadata only)."
            )

            return {
                "files": files,
                "nextPageToken": results.get("nextPageToken"),
                "total_matched": len(files),
                "is_demo_fallback": False
            }
        except Exception as e:
            raise RuntimeError(f"Google Drive search failed: {str(e)}")

    async def get_file_metadata(self, user_id: str, file_id: str) -> Dict[str, Any]:
        """Retrieves metadata for a specific authorized file."""
        service = await self._get_drive_client(user_id)
        if not service:
            found = next((d for d in DEMO_DRIVE_DOCUMENTS if d["id"] == file_id), None)
            if not found:
                raise FileNotFoundError(f"File '{file_id}' not found.")
            return {
                "id": found["id"],
                "name": found["name"],
                "mimeType": found["mimeType"],
                "size": found["size"],
                "modifiedTime": found["modifiedTime"],
                "is_demo_fallback": True
            }

        try:
            meta = service.files().get(
                fileId=file_id,
                fields="id, name, mimeType, size, modifiedTime, webViewLink, iconLink, description"
            ).execute()

            activity_service.record_activity(
                user_id=user_id,
                action="Metadata Inspected",
                details=f"Retrieved file attributes for '{meta.get('name', file_id)}'.",
                doc_name=meta.get("name")
            )
            return meta
        except Exception as e:
            raise RuntimeError(f"Failed to fetch metadata for file '{file_id}': {str(e)}")

    async def read_file_content(
        self,
        user_id: str,
        file_id: str,
        max_bytes: int = MAX_FILE_SIZE_BYTES
    ) -> Dict[str, Any]:
        """Reads and extracts text from a selected authorized file in memory.
        
        CRITICAL:
        1. Only called when explicitly needed to answer user query or populate form fields.
        2. Extracted text is returned for ephemeral processing; NEVER saved to DB or logs.
        3. Temporary files (if created) are strictly unlinked in a finally block.
        """
        service = await self._get_drive_client(user_id)
        if not service:
            found = next((d for d in DEMO_DRIVE_DOCUMENTS if d["id"] == file_id), None)
            if not found:
                raise FileNotFoundError(f"File '{file_id}' not found.")
            
            activity_service.record_activity(
                user_id=user_id,
                action="Document Content Read",
                details=f"Read authorized document '{found['name']}' in memory.",
                doc_name=found["name"]
            )
            return {
                "file_id": found["id"],
                "file_name": found["name"],
                "mime_type": found["mimeType"],
                "extracted_text": found.get("demo_content", ""),
                "char_count": len(found.get("demo_content", "")),
                "is_demo_fallback": True
            }

        # 1. Fetch metadata to determine mime type and size
        meta = await self.get_file_metadata(user_id, file_id)
        mime_type = meta.get("mimeType", "")
        file_name = meta.get("name", "document")
        size = int(meta.get("size", 0))

        if size > max_bytes:
            raise ValueError(f"File '{file_name}' ({size} bytes) exceeds safety processing limit of {max_bytes} bytes.")

        extracted_text = ""

        # 2. Handle Google Workspace Documents (Docs, Sheets) via Export
        if mime_type == "application/vnd.google-apps.document":
            req = service.files().export_media(fileId=file_id, mimeType="text/plain")
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, req)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            extracted_text = fh.getvalue().decode("utf-8", errors="replace")

        elif mime_type == "application/vnd.google-apps.spreadsheet":
            req = service.files().export_media(fileId=file_id, mimeType="text/csv")
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, req)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            extracted_text = fh.getvalue().decode("utf-8", errors="replace")

        # 3. Handle Binary Files (PDF, DOCX, TXT) via Media Download
        else:
            req = service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, req)
            done = False
            while not done:
                _, done = downloader.next_chunk()

            raw_bytes = fh.getvalue()

            if mime_type == "application/pdf" or file_name.lower().endswith(".pdf"):
                reader = PdfReader(io.BytesIO(raw_bytes))
                pages_text = []
                for p_idx, page in enumerate(reader.pages):
                    t = page.extract_text() or ""
                    if t.strip():
                        pages_text.append(f"--- Page {p_idx + 1} ---\n{t.strip()}")
                extracted_text = "\n\n".join(pages_text)

            elif mime_type in (
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword"
            ) or file_name.lower().endswith(".docx"):
                doc = Document(io.BytesIO(raw_bytes))
                extracted_text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())

            elif mime_type.startswith("text/") or file_name.lower().endswith(".txt"):
                extracted_text = raw_bytes.decode("utf-8", errors="replace")

            else:
                raise ValueError(f"Unsupported file format '{mime_type}' for document '{file_name}'.")

        activity_service.record_activity(
            user_id=user_id,
            action="Document Content Read",
            details=f"Read authorized file '{file_name}' ({len(extracted_text)} characters extracted in memory).",
            doc_name=file_name
        )

        return {
            "file_id": file_id,
            "file_name": file_name,
            "mime_type": mime_type,
            "extracted_text": extracted_text,
            "char_count": len(extracted_text),
            "is_demo_fallback": False
        }


google_drive_service = GoogleDriveService()
