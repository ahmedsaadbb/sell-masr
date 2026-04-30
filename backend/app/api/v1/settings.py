from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session as SQLSession, select
from typing import Any
from app.database import engine
from app.models.setting import StoreSettings, StoreSettingsCreate, StoreSettingsRead
from app.models.user import User
from app.dependencies import get_db, admin_required
from app.utils.encryption import encrypt, decrypt

router = APIRouter()

# Sensitive keys that should be encrypted in DB
SENSITIVE_KEYS = ["openai_api_key", "paymob_api_key"]

@router.get("/{key}", response_model=StoreSettingsRead)
def get_setting(
    *, 
    db: SQLSession = Depends(get_db), 
    key: str,
    current_user: User = Depends(admin_required)
) -> Any:
    """
    Get a specific setting by key. Only accessible by admins.
    Decrypts sensitive values before returning.
    """
    statement = select(StoreSettings).where(StoreSettings.setting_key == key)
    setting = db.exec(statement).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    # Decrypt if sensitive
    if setting.setting_key in SENSITIVE_KEYS and setting.setting_value:
        try:
            setting.setting_value = decrypt(setting.setting_value)
        except Exception:
            # If decryption fails (e.g. key changed), return as is or handle error
            pass
            
    return setting

@router.post("/", response_model=StoreSettingsRead)
def update_setting(
    *, 
    db: SQLSession = Depends(get_db), 
    setting_in: StoreSettingsCreate,
    current_user: User = Depends(admin_required)
) -> Any:
    """
    Update or create a setting. Only accessible by admins.
    Encrypts sensitive values before storing.
    """
    # Encrypt if sensitive
    value_to_store = setting_in.setting_value
    if setting_in.setting_key in SENSITIVE_KEYS and value_to_store:
        value_to_store = encrypt(value_to_store)

    statement = select(StoreSettings).where(StoreSettings.setting_key == setting_in.setting_key)
    existing_setting = db.exec(statement).first()
    
    if existing_setting:
        existing_setting.setting_value = value_to_store
        db.add(existing_setting)
        db.commit()
        db.refresh(existing_setting)
        # Decrypt for the response
        if existing_setting.setting_key in SENSITIVE_KEYS:
            existing_setting.setting_value = decrypt(existing_setting.setting_value)
        return existing_setting
        
    db_setting = StoreSettings(
        setting_key=setting_in.setting_key,
        setting_value=value_to_store
    )
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    
    # Decrypt for the response
    if db_setting.setting_key in SENSITIVE_KEYS:
        db_setting.setting_value = decrypt(db_setting.setting_value)
        
    return db_setting
