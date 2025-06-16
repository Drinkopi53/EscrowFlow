require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Tambahkan baris ini

const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24", // Sesuaikan versi Solidity jika diperlukan
  networks: {
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001, // Chain ID untuk Polygon Mumbai Testnet
    },
    // Tambahkan jaringan lain jika diperlukan (misalnya, mainnet, localhost)
  },
  // Tambahkan konfigurasi lain seperti etherscan, gas reporter, dll.
};
