import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setMessage(`✅ ${res.data.message || 'File uploaded successfully!'}`);
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upload Document</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <br />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Upload;
