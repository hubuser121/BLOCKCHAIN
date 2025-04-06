// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    address public owner;

    struct Document {
        string hash;
        string name;
        bool isVerified;
    }

    mapping(string => Document) public documents;

    event DocumentAdded(string docId, string name, string hash);
    event DocumentVerified(string docId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addDocument(string memory _docId, string memory _name, string memory _hash) public onlyOwner {
        require(bytes(documents[_docId].hash).length == 0, "Document already exists.");
        documents[_docId] = Document(_hash, _name, false);
        emit DocumentAdded(_docId, _name, _hash);
    }

    function verifyDocument(string memory _docId) public onlyOwner {
        require(bytes(documents[_docId].hash).length != 0, "Document does not exist.");
        documents[_docId].isVerified = true;
        emit DocumentVerified(_docId);
    }

    function getDocument(string memory _docId) public view returns (string memory, string memory, bool) {
        Document memory doc = documents[_docId];
        return (doc.name, doc.hash, doc.isVerified);
    }
}
