// Generate a new Ethereum private key for deployment
const { ethers } = require('ethers');

const wallet = ethers.Wallet.createRandom();

console.log('\n🔑 New Wallet Generated for CAMP Testnet Deployment\n');
console.log('━'.repeat(60));
console.log('Private Key:', wallet.privateKey);
console.log('Address:', wallet.address);
console.log('━'.repeat(60));
console.log('\n⚠️  IMPORTANT:');
console.log('1. Save the private key in .env.local file');
console.log('2. Get testnet tokens from: https://basecamp-faucet.gelato.digital/');
console.log('3. Use the ADDRESS above to request tokens from the faucet');
console.log('4. NEVER share the private key or commit it to git\n');
