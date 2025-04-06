const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Load contract ABI and address
const contractABI = require("./contractABI.json");
const contractAddress = "0xf55Fc88129Cadf84E20F68C7A1a39CB6A088e5A9"; // 🔁 Replace with actual contract address!

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to compute SHA-256 hash of a file
function hashDocument(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

// API to register a real document (addDocument)
app.post("/register", async (req, res) => {
    const { filePath, docId, name } = req.body;
    const docHash = hashDocument(filePath);

    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.addDocument(docId, name, docHash).send({ from: accounts[0] });
        res.json({ message: "Document Registered Successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API to verify document (verifyDocument)
app.post("/verify", async (req, res) => {
    const { filePath, docId } = req.body;
    const docHash = hashDocument(filePath);

    try {
        const doc = await contract.methods.getDocument(docId).call();
        if (doc.hash === docHash) {
            if (!doc.isVerified) {
                const accounts = await web3.eth.getAccounts();
                await contract.methods.verifyDocument(docId).send({ from: accounts[0] });
            }
            res.json({ message: "Real Document ✅" });
        } else {
            res.json({ message: "Fake Document ❌" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
