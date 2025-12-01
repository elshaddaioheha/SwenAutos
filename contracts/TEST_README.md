# SwenAutos Smart Contract Testing

This document provides step-by-step instructions for setting up, testing, and deploying the SwenAutos smart contracts.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run All Tests
```bash
npm test
```

Expected result: **60+ tests passing** ✅

---

## Testing Commands

### Run All Tests
```bash
npm test
```

### Run Specific Contract Tests
```bash
npm run test:product    # ProductListingContract tests (15 tests)
npm run test:escrow     # EscrowContract tests (25+ tests)
npm run test:rating     # RatingContract tests (20+ tests)
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

Generates coverage report showing line/branch coverage for each contract.

---

## Test Files

All test files are in `contracts/test/`:

### 1. **ProductListing.test.ts**
Tests for product CRUD, inventory management, and pagination.

**Test Categories:**
- Product Creation
- Product Updates
- Inventory Management
- Active Products Listing
- Edge Cases

**Coverage:**
- ✅ Create listings
- ✅ Update product details
- ✅ Deactivate listings
- ✅ Inventory tracking (reduce/restore)
- ✅ Pagination of active products
- ✅ Access control (seller-only)

### 2. **Escrow.test.ts**
Tests for order lifecycle, escrow funding, disputes, and auto-release.

**Test Categories:**
- Order Creation
- Escrow Funding
- Order Lifecycle
- Refund Logic
- Dispute Resolution
- Auto-Release
- Edge Cases

**Coverage:**
- ✅ Create orders
- ✅ Fund escrow with CAMP token
- ✅ Inventory reduction on order
- ✅ Prevent double-funding
- ✅ Order status transitions
- ✅ Shipment tracking
- ✅ Delivery confirmation
- ✅ Fund release to seller
- ✅ Refund to buyer
- ✅ Dispute opening with reasons
- ✅ Dispute resolution (split/full)
- ✅ Auto-release after 14 days
- ✅ Access control (buyer/seller/arbitrator)

### 3. **Rating.test.ts**
Tests for buyer rating submission, aggregation, and fraud prevention.

**Test Categories:**
- Rating Submission
- Duplicate Prevention
- Seller Aggregates
- Seller Rating Retrieval
- Rating Removal
- Edge Cases

**Coverage:**
- ✅ Submit ratings (1-5 stars)
- ✅ Prevent duplicate ratings
- ✅ Validate score range
- ✅ Calculate aggregate ratings
- ✅ Update averages
- ✅ Paginated rating lists
- ✅ Admin rating removal
- ✅ Access control (buyer-only, admin-only)
- ✅ Prevent rating non-delivered orders

---

## Environment Setup

### 1. Create `.env.local`
```bash
cp .env.local.example .env.local
```

### 2. Configure Network
Edit `.env.local`:
```env
# RPC for CAMP Testnet
NEXT_PUBLIC_CAMP_RPC_URL=https://rpc.basecamp.t.raas.gelato.cloud

# Your private key for deployment (NEVER COMMIT THIS!)
PRIVATE_KEY=your_private_key_here

# Will be filled after deployment
NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS=
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=
NEXT_PUBLIC_RATING_CONTRACT_ADDRESS=
```

### 3. Generate Test Private Key
```bash
node -e "console.log(require('ethers').Wallet.createRandom().privateKey)"
```

Copy the output and paste in `.env.local` as `PRIVATE_KEY`.

---

## Deployment

### Deploy to Local Hardhat Network
```bash
npm run deploy:local
```

### Deploy to CAMP Testnet
```bash
npm run deploy:testnet
```

**Expected Output:**
```
Deploying SwenAutos contracts to CAMP network...
ProductListingContract deployed to: 0x...
EscrowContract deployed to: 0x...
RatingContract deployed to: 0x...

Deployment Complete! Add these to your .env.local file:
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RATING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS=0x...
```

### Save Addresses
After deployment, update `.env.local` with the deployed contract addresses.

---

## Test Fixtures (MockERC20)

The tests automatically deploy a **MockERC20** token to simulate CAMP token.

- **Symbol**: CAMP
- **Decimals**: 18
- **Initial Supply**: 1,000,000 CAMP
- **Test Distribution**: 10,000 CAMP to each test account

---

## Understanding Test Results

### Successful Test Output
```
ProductListingContract
    Product Creation
      ✓ Should create a product listing
      ✓ Should track product by seller
      ✓ Should retrieve product details
    ...
    15 passing
```

### Failed Test Diagnosis

**If a test fails:**

1. **Check error message** - Specifies which assertion failed
2. **Check contract logic** - Verify Solidity implementation
3. **Check test setup** - Ensure fixtures are correct
4. **Run with verbose output**: `npx hardhat test --verbose`

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Insufficient balance" | Mock token not transferred | Check fixture setup |
| "Call revert" | Contract precondition not met | Review test beforeEach |
| "Unexpected signature" | Event not emitted | Check contract event emission |
| "Invalid state" | Order in wrong state | Verify lifecycle progression |

---

## Test Scenarios by Flow

### Happy Path: Complete Order
1. Seller creates listing
2. Buyer creates order
3. Buyer funds escrow
4. Seller marks shipped
5. Buyer confirms delivery
6. Buyer releases funds
7. Buyer submits rating

**Tests covering this**: Most tests in Escrow.test.ts + Rating.test.ts

### Unhappy Path: Dispute
1. Seller creates listing
2. Buyer creates and funds order
3. Seller marks shipped
4. Buyer opens dispute
5. Arbitrator resolves (split/refund)

**Tests covering this**: Dispute Resolution section in Escrow.test.ts

### Refund Path: Early Cancellation
1. Seller creates listing
2. Buyer creates order
3. Buyer funds escrow
4. Seller refunds buyer (before shipment)
5. Inventory restored

**Tests covering this**: Refund Logic section in Escrow.test.ts

---

## Gas Estimation

Run tests with gas reporter:
```bash
REPORT_GAS=true npm test
```

Shows gas usage for each function:
- Deployment costs
- Function execution costs
- Total test costs

**Expected Gas Costs:**
- CreateListing: ~150,000 gas
- CreateOrder: ~120,000 gas
- FundEscrow: ~100,000 gas (+ token transfer)
- MarkShipped: ~65,000 gas
- ConfirmDelivery: ~80,000 gas
- ReleaseFunds: ~90,000 gas
- SubmitRating: ~130,000 gas

---

## Coverage Report

Generate and view coverage:
```bash
npm run test:coverage
```

Creates `coverage/` directory with:
- `lcov.info` - Machine-readable report
- `index.html` - Visual coverage report

**Expected Coverage:**
- Statements: 90%+
- Branches: 85%+
- Functions: 95%+
- Lines: 90%+

---

## Debugging Tests

### Run single test with debug info
```bash
npx hardhat test contracts/test/ProductListing.test.ts --grep "Should create"
```

### Print contract state during test
Add to test:
```typescript
const product = await productListing.getProduct(1);
console.log("Product:", product);
```

Run with:
```bash
npx hardhat test --verbose
```

### Inspect transaction details
```typescript
const tx = await escrow.fundEscrow(1, amount);
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
console.log("Block:", receipt.blockNumber);
```

---

## CAMP Testnet Info

**Network Details:**
- Name: BaseCAMP Testnet
- RPC: https://rpc.basecamp.t.raas.gelato.cloud
- Chain ID: 123420001114
- Currency: CAMP
- Block Explorer: https://basecamp.cloud.blockscout.com/

**Get Testnet CAMP:**
1. Visit: [CAMP Faucet](https://basecamp-faucet.gelato.digital/)
2. Connect your wallet
3. Request tokens
4. Wait 1-5 minutes for confirmation

---

## Next Steps

1. ✅ **Complete local tests** - `npm test`
2. ✅ **Setup environment** - Create `.env.local`
3. ✅ **Get testnet tokens** - Request from faucet
4. ⏳ **Deploy to testnet** - `npm run deploy:testnet`
5. ⏳ **Verify on explorer** - Check addresses on block explorer
6. ⏳ **Test frontend integration** - Connect Web3Provider
7. ⏳ **Security audit** - Run Slither, Mythril
8. ⏳ **Mainnet deployment** - Deploy with verified contracts

---

## Documentation Reference

- **ESCROW_ARCHITECTURE.md** - System design
- **CONTRACT_INTERFACES.md** - API reference
- **CODE_REFERENCE.md** - Code structure
- **DEPLOYMENT_GUIDE.md** - Detailed deployment steps
- **PHASE_2_COMPLETION.md** - Phase status

---

## Support

**For issues:**
1. Check error message carefully
2. Review relevant test file
3. Check contract implementation
4. Review documentation files
5. Check Hardhat docs: https://hardhat.org/docs

---

**Status**: ✅ All tests passing
**Phase**: Phase 2 - Smart Contracts (Complete)
**Next**: Phase 3 - Authentication & User Management
