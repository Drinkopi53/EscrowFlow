// functions/github-commits.js

// Import Functions.makeHttpRequest
const { Functions } = require("@chainlink/functions");

// Fungsi utama yang akan dieksekusi oleh Chainlink Functions
async function execute(args) {
  const repoOwner = args[0];
  const repoName = args[1];
  const branch = args[2];
  const username = args[3];
  const githubToken = args[4]; // GitHub Personal Access Token (PAT)

  // URL GitHub API untuk mendapatkan daftar commit di branch tertentu oleh author
  // Perhatikan: GitHub API memiliki batasan rate limit. Untuk produksi, pertimbangkan caching atau strategi lain.
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=${username}&sha=${branch}`;

  // Header untuk otentikasi GitHub API
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `token ${githubToken}`,
    "User-Agent": "ChainlinkFunctions" // Penting untuk GitHub API
  };

  console.log(`Fetching commits from: ${url}`);

  // Buat permintaan HTTP menggunakan Functions.makeHttpRequest
  const response = await Functions.makeHttpRequest({
    url: url,
    headers: headers,
    timeout: 10000 // Timeout dalam milidetik
  });

  if (response.error) {
    console.error("Request failed:", response.error);
    throw new Error("Failed to fetch commits from GitHub API.");
  }

  const { data } = response;

  // GitHub API mengembalikan array objek commit. Jumlah commit adalah panjang array.
  const commitCount = data.length;

  console.log(`Found ${commitCount} commits for ${username} on branch ${branch} in ${repoOwner}/${repoName}`);

  // Kembalikan jumlah commit sebagai integer
  return Functions.encodeUint256(commitCount);
}

// Ekspor fungsi execute agar dapat diakses oleh Chainlink Functions
module.exports = { execute };
