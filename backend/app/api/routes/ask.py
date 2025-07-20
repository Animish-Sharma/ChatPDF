from fastapi import APIRouter, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from services.nlp_serivce import get_or_load_nlp
from models import Document, Question
from database import get_db

router = APIRouter()

@router.post("/ask")
async def ask_question(
    document_id: int = Form(...),
    question: str = Form(...),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    nlp = get_or_load_nlp(document_id, doc.text_content)
    result = nlp.answer_question(question)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    db_question = Question(
        document_id=document_id,
        question_text=question,
        answer_text=result["answer"]
    )
    db.add(db_question)
    db.commit()

    return JSONResponse(content={
        "answer": result["answer"],
        "question": question,
        "document_filename": doc.original_filename,
        "sources": result.get("source_documents", [])
    })
