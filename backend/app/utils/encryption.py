import base64
import hashlib
from cryptography.fernet import Fernet
from app.core.config import settings
from typing import Optional

def _get_fernet() -> Fernet:
    """Create a Fernet instance using the ENCRYPTION_KEY.
    Derives a valid 32-byte base64 key from any string provided.
    """
    key_str: Optional[str] = settings.ENCRYPTION_KEY
    if not key_str:
        # Fallback if no key is provided
        key_str = settings.SECRET_KEY
    
    # Derive a 32-byte key using SHA-256
    hash_object = hashlib.sha256(key_str.encode())
    derived_key = base64.urlsafe_b64encode(hash_object.digest())
    
    return Fernet(derived_key)

def encrypt(value: str) -> str:
    """Encrypt a plain text string and return the token as a UTF‑8 string."""
    if value is None:
        return ""
    token = _get_fernet().encrypt(value.encode())
    return token.decode()

def decrypt(token: str) -> str:
    """Decrypt a token produced by ``encrypt`` and return the original string."""
    if not token:
        return ""
    plain = _get_fernet().decrypt(token.encode())
    return plain.decode()
