// frontend/src/Verify.js

import React, { useState } from 'react';
import axios from 'axios';

const Verify = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleVerify = async () => {
    if (!file) {
      setResult("⚠️ Please select a file to verify.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'https://blockchain-2h1c.onrender.com/verify', // 🔁 ✅ UPDATED URL
        formData
      );
      setResult(`🔍 Verification Result: ${res.data.result}`);
    } catch (err) {
      console.error("Verification Error:", err);
      setResult("❌ Verification failed.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Verify Document</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <br />
      <button onClick={handleVerify} className="bg-green-600 text-white px-4 py-2 rounded">
        Verify
      </button>
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
};

export default Verify;
