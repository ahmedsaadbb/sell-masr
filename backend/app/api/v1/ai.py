from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session as SQLSession, select
from typing import Any
from app.database import engine
from app.models.user import User
from app.dependencies import get_db, admin_required
from app.utils.encryption import decrypt
from openai import OpenAI

router = APIRouter()

class GenerateDescriptionRequest(BaseModel):
    product_name: str
    category_name: str = ""

class GenerateDescriptionResponse(BaseModel):
    description: str

@router.post("/generate-description", response_model=GenerateDescriptionResponse)
def generate_description(
    *, 
    db: SQLSession = Depends(get_db), 
    request: GenerateDescriptionRequest,
    current_user: User = Depends(admin_required)
) -> Any:
    """
    Generate an Arabic product description using OpenAI. Only accessible by admins.
    """
    # 1. Fetch OpenAI API Key from settings
    statement = select(StoreSettings).where(StoreSettings.setting_key == "openai_api_key")
    setting = db.exec(statement).first()
    
    if not setting or not setting.setting_value:
        raise HTTPException(
            status_code=400, 
            detail="OpenAI API Key is not configured. Please add it in the Settings page."
        )
    
    # Decrypt key
    try:
        api_key = decrypt(setting.setting_value)
    except Exception:
        api_key = setting.setting_value # Fallback if not encrypted yet

    # 2. Call OpenAI API
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"اكتب وصف تسويقي جذاب واحترافي لمنتج يحمل الاسم '{request.product_name}'"
        if request.category_name:
            prompt += f" وينتمي لقسم '{request.category_name}'."
        prompt += " الوصف يجب أن يكون باللغة العربية، مكون من فقرة واحدة إلى فقرتين، ومناسب لموقع تجارة إلكترونية."

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # or gpt-4 depending on the key
            messages=[
                {"role": "system", "content": "أنت خبير تسويق إلكتروني وتجارة إلكترونية عربي."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=0.7
        )
        
        description = response.choices[0].message.content.strip()
        return {"description": description}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate description: {str(e)}"
        )
