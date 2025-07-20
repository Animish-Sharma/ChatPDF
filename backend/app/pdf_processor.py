import pymupdf
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFProcessor:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)

    def extract_text_from_pdf(self, file_path: str) -> dict:
        try:
            doc = pymupdf.open(file_path)
            text_content = ""
            page_texts = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                page_text = page.get_text()
                text_content += page_text + "\n\n"
                page_texts.append({
                    "page": page_num + 1,
                    "text": page_text
                })
            doc.close()
            return {
                "full_text": text_content,
                "page_texts": page_texts,
                "page_count": len(page_texts),
                "success": True
            }
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            return {
                "error": str(e),
                "success": False
            }

    def get_file_info(self, file_path: str) -> dict:
        try:
            file_size = os.path.getsize(file_path)
            return {
                "file_size": file_size,
                "success": True
            }
        except Exception as e:
            return {
                "error": str(e),
                "success": False
            }