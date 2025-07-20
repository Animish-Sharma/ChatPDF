from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from services.pdf_service import handle_pdf_upload
from database import get_db

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        return await handle_pdf_upload(file, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
