import os
import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
from langchain_community.llms import Ollama  # Use local LLM via Ollama

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NLPProcessor:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        self.vectorstore = None
        self.qa_chain = None

    def process_document(self, text_content: str, document_id: str) -> bool:
        try:
            texts = self.text_splitter.split_text(text_content)
            documents = [
                Document(
                    page_content=text,
                    metadata={"document_id": document_id, "chunk_id": i}
                )
                for i, text in enumerate(texts)
            ]
            self.vectorstore = Chroma.from_documents(
                documents,
                self.embeddings,
                persist_directory=f"./chroma_db_{document_id}"
            )

            # Use Ollama LLM instead of OpenAI
            llm = Ollama(model="llama3")  # Can be 'llama3', 'mistral', etc.

            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True
            )
            return True
        except Exception as e:
            logger.error(f"Error processing document: {str(e)}")
            return False

    def answer_question(self, question: str) -> dict:
        try:
            if not self.qa_chain:
                return {
                    "error": "No document processed yet",
                    "success": False
                }
            result = self.qa_chain({"query": question})
            return {
                "answer": result["result"],
                "source_documents": [
                    {
                        "content": doc.page_content,
                        "metadata": doc.metadata
                    }
                    for doc in result["source_documents"]
                ],
                "success": True
            }
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return {
                "error": str(e),
                "success": False
            }

    def load_existing_vectorstore(self, document_id: str) -> bool:
        try:
            persist_directory = f"./chroma_db_{document_id}"
            if os.path.exists(persist_directory):
                self.vectorstore = Chroma(
                    persist_directory=persist_directory,
                    embedding_function=self.embeddings
                )

                llm = Ollama(model="llama3")  # Reuse Ollama LLM

                self.qa_chain = RetrievalQA.from_chain_type(
                    llm=llm,
                    chain_type="stuff",
                    retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
                    return_source_documents=True
                )
                return True
            return False
        except Exception as e:
            logger.error(f"Error loading vectorstore: {str(e)}")
            return False