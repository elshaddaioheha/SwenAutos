const { ethers } = require("ethers");
const fs = require("fs");

function main() {
    const wallet = ethers.Wallet.createRandom();

    const content = `
Wallet Generated: ${new Date().toISOString()}
Address: ${wallet.address}
Private Key: ${wallet.privateKey}

INSTRUCTIONS:
1. Go to https://basecamp-faucet.gelato.digital/
2. Paste the Address above to get tokens.
3. Add the Private Key to your .env.local file:
   PRIVATE_KEY=${wallet.privateKey}
`;

    fs.writeFileSync("wallet-info.txt", content);
    console.log("Wallet generated! Check wallet-info.txt");
    console.log(`Address: ${wallet.address}`);
}

main();
