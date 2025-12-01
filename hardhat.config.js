require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    networks: {
        // CAMP Network BaseCAMP Testnet
        basecamp: {
            url: process.env.NEXT_PUBLIC_CAMP_RPC_URL || "https://rpc.basecamp.t.raas.gelato.cloud",
            chainId: 123420001114,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        // CAMP Mainnet/Other
        camp: {
            url: 'https://rpc.camp.raas.gelato.cloud/',
            chainId: 484,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        // Alternative RPC
        basecampAlt: {
            url: "https://rpc-campnetwork.xyz",
            chainId: 123420001114,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        // Local Hardhat Network for testing
        hardhat: {
            chainId: 31337,
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./contracts/cache",
        artifacts: "./contracts/artifacts",
    },
    mocha: {
        require: ["ts-node/register"],
        spec: ["test/**/*.ts"],
    },
    etherscan: {
        apiKey: {
            basecamp: "no-api-key-needed",
            camp: "empty",
        },
        customChains: [
            {
                network: "basecamp",
                chainId: 123420001114,
                urls: {
                    apiURL: "https://basecamp.cloud.blockscout.com/api",
                    browserURL: "https://basecamp.cloud.blockscout.com",
                },
            },
            {
                network: "camp",
                chainId: 484,
                urls: {
                    apiURL: "https://camp.cloud.blockscout.com/api",
                    browserURL: "https://camp.cloud.blockscout.com",
                },
            },
        ],
    },
};
