import os, uuid, shutil
from fastapi.responses import JSONResponse
from models import Document
from services.nlp_serivce import initialize_nlp_processor
from pdf_processor import PDFProcessor
from utils.file_utils import save_pdf_file

pdf_processor = PDFProcessor()

async def handle_pdf_upload(file, db):
    if not file.filename.endswith(".pdf"):
        raise Exception("Only PDF files are allowed")

    file_id = str(uuid.uuid4())
    filename = f"{file_id}.pdf"
    file_path = save_pdf_file(file, filename)

    text_result = pdf_processor.extract_text_from_pdf(file_path)
    if not text_result["success"]:
        os.remove(file_path)
        raise Exception(f"PDF processing failed: {text_result['error']}")

    file_info = pdf_processor.get_file_info(file_path)
    if not file_info["success"]:
        os.remove(file_path)
        raise Exception(f"File info extraction failed: {file_info['error']}")

    doc = Document(
        filename=filename,
        original_filename=file.filename,
        file_path=file_path,
        text_content=text_result["full_text"],
        page_count=text_result["page_count"],
        file_size=file_info["file_size"]
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    nlp_ready = initialize_nlp_processor(doc.id, text_result["full_text"])

    return JSONResponse(content={
        "message": "PDF uploaded",
        "document_id": doc.id,
        "filename": file.filename,
        "page_count": text_result["page_count"],
        "file_size": file_info["file_size"],
        "nlp_ready": nlp_ready
    })
