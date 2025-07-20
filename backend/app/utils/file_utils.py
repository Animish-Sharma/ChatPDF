import os, shutil

def save_pdf_file(uploaded_file, filename):
    path = os.path.join("uploads", filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(uploaded_file.file, f)
    return path
