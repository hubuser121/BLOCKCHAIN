const Web3 = require("web3");
const fs = require("fs");
const crypto = require("crypto");
const contractABI = require("./contractABI.json"); // Load ABI
const contractAddress = "0xYourSmartContractAddress"; // Replace with deployed address

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache connection
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to compute SHA-256 hash of a file
function hashDocument(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

// API to verify document
app.post("/verify", async (req, res) => {
    const filePath = req.body.filePath; // File path from request
    const docHash = hashDocument(filePath);

    const isReal = await contract.methods.verifyDocument(docHash).call();
    res.json({ message: isReal ? "Real Document ✅" : "Fake Document ❌" });
});

// API to register real document hash
app.post("/register", async (req, res) => {
    const filePath = req.body.filePath; // File path from request
    const docHash = hashDocument(filePath);

    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerDocument(docHash).send({ from: accounts[0] });

    res.json({ message: "Document Registered Successfully!" });
});
