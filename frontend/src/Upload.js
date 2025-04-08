import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post("https://blockchain-2h1c.onrender.com/upload", formData);
      setIpfsHash(res.data.ipfsHash);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload Document</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-1 rounded">Upload</button>

      {ipfsHash && (
        <div className="mt-4">
          <p className="font-semibold">IPFS Hash:</p>
          <p className="bg-gray-100 p-2 rounded text-sm break-all">{ipfsHash}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
