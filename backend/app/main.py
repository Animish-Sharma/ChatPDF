from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import upload, ask, documents
from core.startup import startup_event

app = FastAPI(title="PDF Q&A API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(ask.router)
app.include_router(documents.router)

app.add_event_handler("startup", startup_event)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
