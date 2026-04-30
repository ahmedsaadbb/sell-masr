from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
import magic
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file to the server and return the URL.
    Validates both file extension and actual MIME type.
    """
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1]
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]
    if file_extension.lower() not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file extension. Only images are allowed.")
    
    # Validate actual MIME type
    file.file.seek(0)
    mime = magic.Magic(mime=True)
    file_mime_type = mime.from_buffer(file.file.read(2048))
    file.file.seek(0)
    
    # Allowed MIME types for images
    allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
    if file_mime_type not in allowed_mime_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Detected: {file_mime_type}. Only images are allowed."
        )
    
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / file_name
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # In a real app, this would be a full URL
    return {"url": f"/uploads/{file_name}", "filename": file_name}
