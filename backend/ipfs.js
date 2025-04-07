const IPFS = require("ipfs-http-client");

const ipfs = IPFS.create({
  host: "ipfs.infura.io", // Using Infura's IPFS node
  port: 5001,
  protocol: "https",
});

async function uploadFile(fileBuffer) {
  const { path } = await ipfs.add(fileBuffer);
  return path; // Returns the IPFS hash
}

async function getFile(ipfsHash) {
  const stream = ipfs.cat(ipfsHash);
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  return data;
}

module.exports = { uploadFile, getFile };
