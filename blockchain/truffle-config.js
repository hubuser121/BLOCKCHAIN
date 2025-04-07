module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",   // Localhost for Ganache
      port: 8545,          // Default port for Ganache GUI
      network_id: "*",     // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",   // Match your Solidity version
    },
  },
};
