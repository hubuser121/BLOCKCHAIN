import React, { useState } from 'react';
import Upload from './Upload';
import Verify from './Verify';
import './style.css';

const App = () => {
  const [page, setPage] = useState('upload');

  return (
    <>
      <div className="navbar">
        📄 Blockchain-Based Document Verification
      </div>

      <div className="container">
        <div className="mb-4 space-x-4 text-center">
          <button
            onClick={() => setPage('upload')}
            className={`px-4 py-2 rounded ${page === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
          >
            Upload
          </button>
          <button
            onClick={() => setPage('verify')}
            className={`px-4 py-2 rounded ${page === 'verify' ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
          >
            Verify
          </button>
        </div>

        <div className="card">
          {page === 'upload' ? <Upload /> : <Verify />}
        </div>
      </div>
    </>
  );
};

export default App;
