# Deploying SwenAutos Contracts on Remix IDE

This guide walks you through deploying the three main SwenAutos smart contracts using Remix IDE instead of local Hardhat.

## Prerequisites

- A Web3 wallet (MetaMask, Coinbase Wallet, etc.) connected to the CAMP network testnet
- The contract source files from `contracts/`:
  - `EscrowContract.sol`
  - `ProductListingContract.sol`
  - `RatingContract.sol`

## Steps

### 1. Open Remix IDE

Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)

### 2. Create Project & Upload Contracts

- In Remix, create a new workspace or use default.
- Copy the Solidity files from this repo's `contracts/` folder into Remix:
  - `EscrowContract.sol`
  - `ProductListingContract.sol`
  - `RatingContract.sol`

### 3. Compile Contracts

- Select the **Solidity Compiler** tab (on the left).
- Select compiler version **0.8.19** (or compatible).
- Click **Compile** for each contract to ensure no errors.

### 4. Deploy to CAMP Network Testnet

#### Connect your wallet:
- Click the **Deploy & Run Transactions** tab (on the left).
- Under **Environment**, select **Injected Provider** (MetaMask, etc.).
- Ensure MetaMask is set to the **CAMP Network Testnet**.

#### Deploy each contract:

**a) Deploy ProductListingContract first** (no dependencies)
- Select `ProductListingContract` from the contract dropdown.
- Click **Deploy**.
- Confirm the transaction in your wallet.
- Note the deployed address.

**b) Deploy RatingContract** (no dependencies)
- Select `RatingContract` from the dropdown.
- Click **Deploy**.
- Confirm the transaction.
- Note the deployed address.

**c) Deploy EscrowContract** (may depend on ProductListingContract, check constructor)
- Select `EscrowContract` from the dropdown.
- If the constructor requires the ProductListing address, enter the address from step (a).
- Click **Deploy**.
- Confirm the transaction.
- Note the deployed address.

### 5. Record the Addresses

After deployment, copy the deployed contract addresses:
- **ProductListingContract**: `0x...`
- **RatingContract**: `0x...`
- **EscrowContract**: `0x...`

Update `lib/campNetwork.ts` with these addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  PRODUCT_LISTING: "0x...",
  RATING: "0x...",
  ESCROW: "0x...",
};
```

## Notes

- Remix handles compilation and deployment automatically.
- You can verify transactions on the CAMP block explorer after deployment.
- No additional local dependencies are added to the workspace.
- If contracts import from each other, ensure all files are uploaded to Remix.
