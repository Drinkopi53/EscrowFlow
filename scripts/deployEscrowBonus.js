const hre = require("hardhat");

async function main() {
  // Chainlink specific configurations for Polygon Mumbai Testnet
  // Anda perlu mendapatkan nilai-nilai ini dari dokumentasi Chainlink atau konfigurasi oracle Anda
  const LINK_TOKEN_ADDRESS = "0x326C977E6EfMx8f0dF2BCB1Bf6A1744a2885"; // Contoh LINK token address di Mumbai
  const CHAINLINK_JOB_ID = hre.ethers.utils.formatBytes32String("YOUR_CHAINLINK_JOB_ID"); // Ganti dengan Job ID Anda
  const CHAINLINK_FEE = hre.ethers.utils.parseUnits("0.1", "ether"); // Contoh fee 0.1 LINK

  const EscrowBonus = await hre.ethers.getContractFactory("EscrowBonus");
  const escrowBonus = await EscrowBonus.deploy(
    LINK_TOKEN_ADDRESS,
    CHAINLINK_JOB_ID,
    CHAINLINK_FEE
  );

  await escrowBonus.deployed();

  console.log(
    `EscrowBonus contract deployed to: ${escrowBonus.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
