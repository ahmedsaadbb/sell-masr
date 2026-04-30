from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file to the server and return the URL.
    """
    file_extension = os.path.splitext(file.filename)[1]
    if file_extension.lower() not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
    
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / file_name
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # In a real app, this would be a full URL
    return {"url": f"/uploads/{file_name}", "filename": file_name}
