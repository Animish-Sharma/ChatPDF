# 🧠 ChatPDF — Intelligent PDF Chat System

ChatPDF is a full-stack AI-powered platform that lets you upload any PDF document and interact with its contents using natural language queries. Built with a modern backend and frontend architecture, it leverages **Chroma** for vector storage, **PostgreSQL** for persistent metadata, and **Ollama** for local LLM inference — ensuring speed, privacy, and scalability.

## 🎥 Demo

> [Watch the video](https://www.youtube.com/watch?v=VIDEO_ID_HERE)  

---

## 🚀 Features

- 🔍 **Semantic Search**: Extract and query the meaning behind PDF content.
- 🧠 **Local LLM Inference**: Powered by [Ollama](https://ollama.com), no need for OpenAI APIs.
- 📚 **Chroma Vector Store**: For fast and accurate document embeddings.
- 🗃 **PostgreSQL Metadata DB**: Handles document indexing, user sessions, and chat history.
- 💬 **Chat Interface**: Natural conversation with any uploaded document.
- 🖼 **PDF Viewer**: Live, scrollable, page-accurate rendering of uploaded files.
- 🧱 **Modular API**: FastAPI backend supports multiple document management and query routes.

---

## 🧰 Tech Stack

| Layer       | Technology                |
|-------------|----------------------------|
| Frontend    | React.js, Tailwind CSS     |
| Backend     | FastAPI                    |
| Vector DB   | Chroma                     |
| LLM Engine  | Ollama (local)             |
| Database    | PostgreSQL                 |
| PDF Parsing | PyMuPDF     |

---

## 🧑‍💻 Installation

### 📦 Prerequisites

- Python 3.10+
- Node.js 18+
- Docker (for PostgreSQL / Chroma)
- Ollama (`llama3`)

### 📁 Backend Setup

```bash
# Clone the repository
git clone https://github.com/Animish-Sharma/chatpdf.git
cd chatpdf/backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL and Chroma with Docker
docker-compose up -d

# Run FastAPI
uvicorn main:app --reload
```

---

## Frontend Setup

This section expands upon the frontend system described in section 4. It provides a deeper look into the structure, logic, and architecture of the client-side code.

### Frontend Stack

| Technology    | Purpose                              |
|---------------|--------------------------------------|
| React.js      | Component-based UI architecture      |
| TypeScript    | Static typing for better maintainability |
| Tailwind CSS  | Utility-first CSS framework          |
| Axios         | API communication                    |
| react-pdf     | PDF rendering                        |
| Zustand       | Lightweight state management         |

---


## Start the app

#### Create .env in backend
```env
DATABASE_URL="postgreSQL URL'
OPENAI_API_KEY=
UPLOAD_DIR=
MAX_FILE_SIZE=(in bytes)
```

#### Start the backend server
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`.
## Start the frontend development server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`.

## Environment Variables
- See `backend/.env` for required variables.
- The main required variable is `DATABASE_URL` for PostgreSQL connection.

## Usage
1. Open the frontend in your browser (`http://localhost:3000`).
2. Upload a PDF using the sidebar or header button.
3. Select a document to view or chat about it.
4. Ask questions in the chat interface.
5. Delete documents or clear chat history as needed.


#  Thank You
~ Animish Sharma