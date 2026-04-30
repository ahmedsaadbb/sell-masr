from typing import Optional
from sqlmodel import SQLModel, Field

class StoreSettingsBase(SQLModel):
    setting_key: str = Field(index=True, unique=True, max_length=100)
    setting_value: Optional[str] = None

class StoreSettings(StoreSettingsBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class StoreSettingsCreate(StoreSettingsBase):
    pass

class StoreSettingsRead(StoreSettingsBase):
    id: int
