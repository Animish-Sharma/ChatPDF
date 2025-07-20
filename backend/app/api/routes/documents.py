from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from database import get_db
from models import Document, Question
import os

router = APIRouter()

@router.get("/documents")
async def get_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return [
        {
            "id": doc.id,
            "filename": doc.original_filename,
            "upload_date": doc.upload_date,
            "page_count": doc.page_count,
            "file_size": doc.file_size
        }
        for doc in documents
    ]

@router.get("/questions/{document_id}")
async def get_questions(document_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.document_id == document_id).all()
    return [
        {
            "id": q.id,
            "question": q.question_text,
            "answer": q.answer_text,
            "timestamp": q.timestamp
        }
        for q in questions
    ]

@router.delete("/documents/{document_id}")
async def delete_document(document_id: int = Path(...), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    db.query(Question).filter(Question.document_id == document_id).delete()
    db.delete(doc)
    db.commit()

    return {"message": "Document and its Q&A deleted"}

@router.delete("/questions/{document_id}")
async def delete_chats(document_id: int = Path(...), db: Session = Depends(get_db)):
    count = db.query(Question).filter(Question.document_id == document_id).delete()
    db.commit()
    return {"message": f"Deleted {count} questions for document {document_id}"}
