"""Secure Token Store for Google Drive OAuth Credentials.

Stores OAuth tokens encrypted at rest using AES (Fernet).
Enforces multi-user isolation: credentials are strictly scoped by user_id.
CRITICAL: Never stores document contents, extracted text, or file data.
"""

import base64
import hashlib
import os
import sqlite3
import time
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet
from app.config import settings


def _get_fernet() -> Fernet:
    """Derives a deterministic 32-byte Fernet key from settings.ENCRYPTION_KEY."""
    raw_key = settings.ENCRYPTION_KEY.encode("utf-8")
    # Derive a valid urlsafe 32-byte key via SHA-256
    derived = base64.urlsafe_b64encode(hashlib.sha256(raw_key).digest())
    return Fernet(derived)


class TokenStore:
    """Database interface for securely storing and retrieving user OAuth tokens."""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.TOKEN_DB_PATH
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS user_tokens (
                    id TEXT PRIMARY KEY,
                    user_id TEXT UNIQUE NOT NULL,
                    google_account_email TEXT NOT NULL,
                    encrypted_refresh_token TEXT,
                    encrypted_access_token TEXT,
                    token_expiry REAL,
                    granted_scopes TEXT,
                    connection_status TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
            """)
            conn.commit()

    def save_tokens(
        self,
        user_id: str,
        google_account_email: str,
        refresh_token: Optional[str],
        access_token: Optional[str],
        token_expiry: Optional[float],
        granted_scopes: str,
        connection_status: str = "CONNECTED"
    ) -> None:
        """Encrypts and securely stores tokens for a specific user."""
        fernet = _get_fernet()
        enc_refresh = fernet.encrypt(refresh_token.encode("utf-8")).decode("utf-8") if refresh_token else None
        enc_access = fernet.encrypt(access_token.encode("utf-8")).decode("utf-8") if access_token else None
        now = time.time()
        record_id = f"tok_{user_id}"

        with self._get_connection() as conn:
            # Check existing to preserve refresh token if Google didn't return a new one on re-auth
            existing = conn.execute(
                "SELECT encrypted_refresh_token FROM user_tokens WHERE user_id = ?",
                (user_id,)
            ).fetchone()

            if not enc_refresh and existing and existing["encrypted_refresh_token"]:
                enc_refresh = existing["encrypted_refresh_token"]

            conn.execute("""
                INSERT INTO user_tokens (
                    id, user_id, google_account_email, encrypted_refresh_token,
                    encrypted_access_token, token_expiry, granted_scopes,
                    connection_status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    google_account_email = excluded.google_account_email,
                    encrypted_refresh_token = COALESCE(excluded.encrypted_refresh_token, user_tokens.encrypted_refresh_token),
                    encrypted_access_token = excluded.encrypted_access_token,
                    token_expiry = excluded.token_expiry,
                    granted_scopes = excluded.granted_scopes,
                    connection_status = excluded.connection_status,
                    updated_at = excluded.updated_at
            """, (
                record_id, user_id, google_account_email, enc_refresh,
                enc_access, token_expiry, granted_scopes,
                connection_status, now, now
            ))
            conn.commit()

    def get_tokens(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves and decrypts tokens for the authorized user only."""
        with self._get_connection() as conn:
            row = conn.execute(
                "SELECT * FROM user_tokens WHERE user_id = ? AND connection_status = 'CONNECTED'",
                (user_id,)
            ).fetchone()

            if not row:
                return None

            fernet = _get_fernet()
            refresh_token = None
            if row["encrypted_refresh_token"]:
                try:
                    refresh_token = fernet.decrypt(row["encrypted_refresh_token"].encode("utf-8")).decode("utf-8")
                except Exception:
                    pass

            access_token = None
            if row["encrypted_access_token"]:
                try:
                    access_token = fernet.decrypt(row["encrypted_access_token"].encode("utf-8")).decode("utf-8")
                except Exception:
                    pass

            return {
                "user_id": row["user_id"],
                "google_account_email": row["google_account_email"],
                "refresh_token": refresh_token,
                "access_token": access_token,
                "token_expiry": row["token_expiry"],
                "granted_scopes": row["granted_scopes"],
                "connection_status": row["connection_status"],
                "updated_at": row["updated_at"]
            }

    def update_access_token(self, user_id: str, access_token: str, token_expiry: float) -> None:
        """Updates refreshed access token in place."""
        fernet = _get_fernet()
        enc_access = fernet.encrypt(access_token.encode("utf-8")).decode("utf-8")
        with self._get_connection() as conn:
            conn.execute("""
                UPDATE user_tokens
                SET encrypted_access_token = ?, token_expiry = ?, updated_at = ?
                WHERE user_id = ?
            """, (enc_access, token_expiry, time.time(), user_id))
            conn.commit()

    def disconnect_user(self, user_id: str) -> bool:
        """Disconnects user and deletes stored tokens permanently."""
        with self._get_connection() as conn:
            cursor = conn.execute(
                "UPDATE user_tokens SET connection_status = 'DISCONNECTED', encrypted_access_token = NULL, encrypted_refresh_token = NULL, updated_at = ? WHERE user_id = ?",
                (time.time(), user_id)
            )
            conn.commit()
            return cursor.rowcount > 0

    def delete_user(self, user_id: str) -> bool:
        """Hard-deletes all record of user connection."""
        with self._get_connection() as conn:
            cursor = conn.execute("DELETE FROM user_tokens WHERE user_id = ?", (user_id,))
            conn.commit()
            return cursor.rowcount > 0

    def get_status(self, user_id: str) -> Dict[str, Any]:
        """Returns non-sensitive connection status for user."""
        with self._get_connection() as conn:
            row = conn.execute(
                "SELECT google_account_email, connection_status, updated_at, granted_scopes FROM user_tokens WHERE user_id = ?",
                (user_id,)
            ).fetchone()

            if not row or row["connection_status"] != "CONNECTED":
                return {
                    "is_connected": False,
                    "google_account_email": None,
                    "connection_status": "DISCONNECTED",
                    "connected_at": None,
                    "scopes": []
                }

            return {
                "is_connected": True,
                "google_account_email": row["google_account_email"],
                "connection_status": row["connection_status"],
                "connected_at": row["updated_at"],
                "scopes": row["granted_scopes"].split(" ") if row["granted_scopes"] else []
            }


token_store = TokenStore()
