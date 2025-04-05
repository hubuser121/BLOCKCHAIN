const Web3 = require("web3");
const contract = require("@truffle/contract");
const contractJson = require("../blockchain/build/contracts/DocumentVerification.json");

const web3 = new Web3("http://127.0.0.1:7545"); // Connect to Ganache
const DocumentVerification = contract(contractJson);
DocumentVerification.setProvider(web3.currentProvider);

async function storeDocument(ipfsHash, owner) {
  const accounts = await web3.eth.getAccounts();
  const instance = await DocumentVerification.deployed();
  await instance.storeDocument(ipfsHash, owner, { from: accounts[0] });
  console.log(`Document stored with hash: ${ipfsHash}`);
}

async function verifyDocument(ipfsHash) {
  const instance = await DocumentVerification.deployed();
  const result = await instance.verifyDocument(ipfsHash);
  console.log(result.exists ? `Document found! Owner: ${result.owner}, Timestamp: ${result.timestamp}` : "Document not found.");
}

module.exports = { storeDocument, verifyDocument };

// Example Usage (Uncomment to test)
// storeDocument("QmHashExample", "Alice");
// verifyDocument("QmHashExample");
