import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatInterface = ({ currentDocument, onQuestionSubmit, chatHistory, setChatHistory }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentDocument || isLoading) return;

    setIsLoading(true);
    try {
      await onQuestionSubmit(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Question submit failed:', error);
      setInputValue('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!currentDocument) return;
    const confirmed = window.confirm('Are you sure you want to delete all chats for this document?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/questions/${currentDocument.id}`);
      const response = await axios.get(`http://localhost:8000/questions/${currentDocument.id}`);
      setChatHistory(
        response.data.flatMap((q) => [
          {
            id: `q-${q.id}`,
            type: 'user',
            content: q.question,
            timestamp: new Date(q.timestamp),
          },
          {
            id: `a-${q.id}`,
            type: 'bot',
            content: q.answer,
            timestamp: new Date(q.timestamp),
          },
        ])
      );
    } catch (err) {
      alert('Failed to clear chat history.');
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center dark:bg-gray-900 dark:text-gray-300">
        <div>
          <Bot className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No document selected</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upload or select a PDF document to begin chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-200 dark:text-white">ChatPDF</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              Discussing: {currentDocument.filename}
            </p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          disabled={!chatHistory.length}
          className="text-m text-red-500 border border-red-300 dark:border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white cursor-pointer dark:hover:bg-red-200 transition disabled:opacity-50"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`rounded-lg px-4 py-2 max-w-xs md:max-w-2xl ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTime(msg.timestamp)}</p>
                </div>
                {msg.type === 'user' && <User className="w-4 h-4 mt-0.5 text-blue-100" />}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Dots */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="bg-gray-900 dark:bg-blue-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border border-gray-800 dark:border-gray-800 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
