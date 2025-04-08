const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3").default;
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Connect to blockchain (local Ganache or public RPC)
const web3 = new Web3(process.env.GANACHE_URL || "http://127.0.0.1:8545");

// Load contract ABI and address
const contractABI = require("./contractABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to compute SHA-256 hash from base64 file content
function hashDocumentFromBase64(base64Data) {
    const fileBuffer = Buffer.from(base64Data, 'base64');
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

// ✅ Register real document
app.post("/register", async (req, res) => {
    const { base64Data, docId, name } = req.body;
    const docHash = hashDocumentFromBase64(base64Data);

    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.addDocument(docId, name, docHash).send({ from: accounts[0] });
        res.json({ message: "Document Registered Successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Verify document
app.post("/verify", async (req, res) => {
    const { base64Data, docId } = req.body;
    const docHash = hashDocumentFromBase64(base64Data);

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

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
