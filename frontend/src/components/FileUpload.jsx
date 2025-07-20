import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Upload, File, Calendar, FileText } from 'lucide-react';

const FileUpload = ({
  onFileUpload,
  documents,
  currentDocument,
  onDocumentSelect,
  loading,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }
    const result = await onFileUpload(file);
    if (!result.success) {
      alert(result.error || 'Upload failed.');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDeleteDocument = async (doc) => {
    const confirmDelete = window.confirm(`Delete '${doc.filename}' and its chat history?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/documents/${doc.id}`);
      if (currentDocument?.id === doc.id) onDocumentSelect(null);
      window.location.reload();
    } catch {
      alert('Failed to delete document.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.upload_date) - new Date(a.upload_date)
  );

  return (
    <div className="h-full flex flex-col p-4 dark:bg-gray-100 dark:text-gray-100">
      {/* Upload Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-100 dark:text-gray-100 mb-4">Upload Document</h2>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
            ${dragActive
              ? 'bg-gray-50 border-blue-500 dark:bg-blue-900'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-800'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300 dark:text-gray-300">
            {loading ? 'Processing file...' : 'Click or drag PDF here to upload'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Only PDF files are supported</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Documents</h3>
        <div className="space-y-3">
          {sortedDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onDocumentSelect(doc)}
              className={`group relative border rounded-lg p-4 flex items-start gap-4 transition cursor-pointer
                ${currentDocument?.id === doc.id
                  ? 'bg-blue-500 border-blue-500 dark:bg-blue-900 text-grey-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                }`}
            >
              <File className="w-5 h-5 mt-1 text-gray-300 dark:text-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-gray-50 dark:text-gray-100 truncate`}>
                  {doc.filename}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-300 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(doc.upload_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {doc.page_count} pages
                  </span>
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>
              </div>

              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 rounded-md transition opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDocument(doc);
                }}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
          {sortedDocuments.length === 0 && (
            <p className="text-sm text-gray-300 dark:text-gray-400">No documents uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
