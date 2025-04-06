// truffle-config.js

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (Ganache)
      port: 8545,            // Ganache GUI default port
      network_id: "*",       // Match any network id
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20",      // Specify the Solidity compiler version you're using
    },
  },
};
