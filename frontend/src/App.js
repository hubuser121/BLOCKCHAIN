import React, { useState } from "react";
import Upload from "./Upload";
import Verify from "./Verify";
import "./style.css";

function App() {
  const [view, setView] = useState("upload");

  return (
    <div className="container">
      <h1>Blockchain-Based Document Verification</h1>
      <div className="buttons">
        <button onClick={() => setView("upload")} className={view === "upload" ? "active" : ""}>
          Upload Document
        </button>
        <button onClick={() => setView("verify")} className={view === "verify" ? "active" : ""}>
          Verify Document
        </button>
      </div>
      {view === "upload" ? <Upload /> : <Verify />}
    </div>
  );
}

export default App;
