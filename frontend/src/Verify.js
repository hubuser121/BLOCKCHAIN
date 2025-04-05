import React, { useState } from 'react';
import axios from 'axios';

const Verify = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVerify = async () => {
    if (!file) return alert("Please select a file to verify!");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post("http://localhost:5000/verify", formData);
      setStatus(res.data.status); // expect "verified" or "fake"
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Verify Document</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button onClick={handleVerify} className="bg-green-600 text-white px-4 py-1 rounded">Verify</button>

      {status && (
        <div className="mt-4">
          <span className={`px-3 py-1 rounded text-white text-sm ${
            status === 'verified' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {status === 'verified' ? '✅ Document Verified' : '❌ Fake Document'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Verify;
