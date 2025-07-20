import React from 'react';

const Layout = ({ children, onHeaderUploadClick, fileInputRef }) => {
  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 md:px-6 md:py-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight animate-fade-in-down">
              🧾 Chat PDF
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
              onClick={onHeaderUploadClick}
              type="button"
            >
              Upload PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onClick={(e) => (e.target.value = null)} // reset input
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden animate-fade-in-up">
        {children}
      </main>
    </div>
  );
};

export default Layout;
