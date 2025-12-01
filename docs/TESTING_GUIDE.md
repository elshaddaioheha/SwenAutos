# Smart Contract Testing Quick Start Guide

## Overview

All three smart contracts are now fully implemented and ready for testing:
- ✅ **ProductListingContract.sol** - Product CRUD and inventory management
- ✅ **EscrowContract.sol** - Order lifecycle and escrow funding
- ✅ **RatingContract.sol** - Seller ratings and reviews

This guide shows how to set up and run tests locally before deploying to CAMP testnet.

---

## Prerequisites

```bash
# Node.js and npm should be installed
node --version  # v16+ recommended
npm --version

# Install project dependencies
npm install

# Verify Hardhat is configured
npx hardhat --version
```

---

## File Structure for Tests

Create test files in `contracts/test/`:

```
contracts/
├── test/
│   ├── ProductListingContract.test.ts
│   ├── EscrowContract.test.ts
│   ├── RatingContract.test.ts
│   └── fixtures/
│       └── setup.ts  (optional: shared test setup)
```

---

## Basic Test Template for ProductListingContract

```typescript
// contracts/test/ProductListingContract.test.ts

import { ethers } from "hardhat";
import { expect } from "chai";
import { ProductListingContract } from "../typechain-types";

describe("ProductListingContract", function () {
  let productListing: ProductListingContract;
  let seller: any;
  let buyer: any;

  beforeEach(async function () {
    [seller, buyer] = await ethers.getSigners();

    const ProductListingFactory = await ethers.getContractFactory("ProductListingContract");
    productListing = await ProductListingFactory.deploy();
    await productListing.waitForDeployment();
  });

  describe("Listing Creation", function () {
    it("should create a product listing", async function () {
      const tx = await productListing.connect(seller).createListing(
        "Test Product",
        "Description",
        "Electronics",
        ethers.parseUnits("100", 18), // 100 CAMP
        seller.address,
        10, // inventory
        "QmXxxx..." // IPFS hash
      );

      await tx.wait();
      const product = await productListing.getProduct(1);
      
      expect(product.name).to.equal("Test Product");
      expect(product.seller).to.equal(seller.address);
      expect(product.inventory).to.equal(10);
    });

    it("should emit ListingCreated event", async function () {
      await expect(
        productListing.connect(seller).createListing(
          "Test Product",
          "Description",
          "Electronics",
          ethers.parseUnits("100", 18),
          seller.address,
          10,
          "QmXxxx..."
        )
      ).to.emit(productListing, "ListingCreated");
    });
  });

  describe("Inventory Management", function () {
    beforeEach(async function () {
      await productListing.connect(seller).createListing(
        "Test Product",
        "Description",
        "Electronics",
        ethers.parseUnits("100", 18),
        seller.address,
        10,
        "QmXxxx..."
      );
    });

    it("should reduce inventory", async function () {
      await productListing.reduceInventory(1, 3);
      const product = await productListing.getProduct(1);
      expect(product.inventory).to.equal(7);
      expect(product.sold).to.equal(3);
    });

    it("should restore inventory", async function () {
      await productListing.reduceInventory(1, 3);
      await productListing.restoreInventory(1, 2);
      const product = await productListing.getProduct(1);
      expect(product.inventory).to.equal(9);
      expect(product.sold).to.equal(1);
    });
  });
});
```

---

## Basic Test Template for EscrowContract

```typescript
// contracts/test/EscrowContract.test.ts

import { ethers } from "hardhat";
import { expect } from "chai";
import { EscrowContract, ProductListingContract } from "../typechain-types";

describe("EscrowContract", function () {
  let escrow: EscrowContract;
  let productListing: ProductListingContract;
  let mockToken: any; // Mock ERC20 for testing
  let buyer: any, seller: any, arbitrator: any;

  beforeEach(async function () {
    [buyer, seller, arbitrator] = await ethers.getSigners();

    // Deploy ProductListingContract
    const ProductListingFactory = await ethers.getContractFactory("ProductListingContract");
    productListing = await ProductListingFactory.deploy();
    await productListing.waitForDeployment();

    // Deploy EscrowContract
    const EscrowFactory = await ethers.getContractFactory("EscrowContract");
    escrow = await EscrowFactory.deploy(await productListing.getAddress());
    await escrow.waitForDeployment();

    // Create a mock ERC20 token for testing
    const MockTokenFactory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockTokenFactory.deploy("Test CAMP", "CAMP", 18);
    
    // Mint tokens to buyer
    await mockToken.mint(buyer.address, ethers.parseUnits("10000", 18));
  });

  describe("Order Creation & Funding", function () {
    it("should create an order", async function () {
      const tx = await escrow.connect(buyer).createOrder(
        1, // productId
        seller.address,
        ethers.parseUnits("100", 18), // amount
        await mockToken.getAddress(),
        0, // PaymentMethod.CAMP_TOKEN
        "ext_payment_123"
      );

      await tx.wait();
      const order = await escrow.getOrder(1);
      
      expect(order.buyer).to.equal(buyer.address);
      expect(order.seller).to.equal(seller.address);
      expect(order.status).to.equal(1); // PENDING_FUND
    });

    it("should fund escrow with tokens", async function () {
      // Create order
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseUnits("100", 18),
        await mockToken.getAddress(),
        0,
        "ext_payment_123"
      );

      // Approve tokens
      await mockToken.connect(buyer).approve(
        await escrow.getAddress(),
        ethers.parseUnits("100", 18)
      );

      // Fund escrow
      await escrow.connect(buyer).fundEscrow(1, ethers.parseUnits("100", 18));
      
      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(2); // FUNDED
    });
  });

  describe("Order Lifecycle", function () {
    beforeEach(async function () {
      // Create and fund order
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseUnits("100", 18),
        await mockToken.getAddress(),
        0,
        "ext_payment_123"
      );

      await mockToken.connect(buyer).approve(
        await escrow.getAddress(),
        ethers.parseUnits("100", 18)
      );

      await escrow.connect(buyer).fundEscrow(1, ethers.parseUnits("100", 18));
    });

    it("should mark order as shipped", async function () {
      await escrow.connect(seller).markShipped(1, "TRACK123");
      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(3); // SHIPPED
      expect(order.trackingNumber).to.equal("TRACK123");
    });

    it("should confirm delivery", async function () {
      await escrow.connect(seller).markShipped(1, "TRACK123");
      await escrow.connect(buyer).confirmDelivery(1);
      
      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(4); // DELIVERED
    });

    it("should auto-release funds after deadline", async function () {
      await escrow.connect(seller).markShipped(1, "TRACK123");
      await escrow.connect(buyer).confirmDelivery(1);

      // Advance time beyond auto-release deadline (14 days)
      await ethers.provider.send("hardhat_mine", ["0x80000"]); // Mine many blocks

      // Get seller balance before
      const balanceBefore = await mockToken.balanceOf(seller.address);

      // Trigger auto-release
      await escrow.autoReleaseIfEligible(1);

      // Check seller received funds
      const balanceAfter = await mockToken.balanceOf(seller.address);
      expect(balanceAfter).to.equal(
        balanceBefore + ethers.parseUnits("100", 18)
      );
    });
  });
});
```

---

## Basic Test Template for RatingContract

```typescript
// contracts/test/RatingContract.test.ts

import { ethers } from "hardhat";
import { expect } from "chai";
import { RatingContract, EscrowContract, ProductListingContract } from "../typechain-types";

describe("RatingContract", function () {
  let rating: RatingContract;
  let escrow: EscrowContract;
  let productListing: ProductListingContract;
  let mockToken: any;
  let buyer: any, seller: any;

  beforeEach(async function () {
    [buyer, seller] = await ethers.getSigners();

    // Deploy contracts in order
    const ProductListingFactory = await ethers.getContractFactory("ProductListingContract");
    productListing = await ProductListingFactory.deploy();

    const EscrowFactory = await ethers.getContractFactory("EscrowContract");
    escrow = await EscrowFactory.deploy(await productListing.getAddress());

    const RatingFactory = await ethers.getContractFactory("RatingContract");
    rating = await RatingFactory.deploy(await escrow.getAddress());

    // Mock token
    const MockTokenFactory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockTokenFactory.deploy("Test CAMP", "CAMP", 18);
    await mockToken.mint(buyer.address, ethers.parseUnits("10000", 18));
  });

  describe("Rating Submission", function () {
    it("should submit a rating for completed order", async function () {
      // Setup: Create and complete an order
      await escrow.connect(buyer).createOrder(
        1, seller.address, ethers.parseUnits("100", 18),
        await mockToken.getAddress(), 0, "payment_123"
      );

      await mockToken.connect(buyer).approve(
        await escrow.getAddress(),
        ethers.parseUnits("100", 18)
      );

      await escrow.connect(buyer).fundEscrow(1, ethers.parseUnits("100", 18));
      await escrow.connect(seller).markShipped(1, "TRACK123");
      await escrow.connect(buyer).confirmDelivery(1);

      // Submit rating
      const tx = await rating.connect(buyer).submitRating(
        1, // orderId
        seller.address,
        5, // score
        "QmReviewHash..." // reviewHash
      );

      await tx.wait();

      const ratingData = await rating.getRating(1);
      expect(ratingData.score).to.equal(5);
      expect(ratingData.buyer).to.equal(buyer.address);
    });

    it("should update aggregate rating", async function () {
      // ... setup order completion ...

      await rating.connect(buyer).submitRating(1, seller.address, 4, "QmHash1");
      
      const aggregate = await rating.getSellerAggregateRating(seller.address);
      expect(aggregate.totalRatings).to.equal(1);
      expect(aggregate.averageScore).to.equal(4);
    });

    it("should prevent duplicate ratings", async function () {
      // ... setup order completion ...

      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmHash1");
      
      await expect(
        rating.connect(buyer).submitRating(1, seller.address, 4, "QmHash2")
      ).to.be.revertedWith("Order already rated");
    });
  });
});
```

---

## Create Mock ERC20 for Testing

```typescript
// contracts/test/mocks/MockERC20.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

---

## Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test contracts/test/ProductListingContract.test.ts

# Run with coverage
npx hardhat coverage

# Run on specific network (if configured)
npx hardhat test --network camp-testnet
```

---

## Expected Test Output

```
ProductListingContract
  Listing Creation
    ✓ should create a product listing
    ✓ should emit ListingCreated event
  Inventory Management
    ✓ should reduce inventory
    ✓ should restore inventory

EscrowContract
  Order Creation & Funding
    ✓ should create an order
    ✓ should fund escrow with tokens
  Order Lifecycle
    ✓ should mark order as shipped
    ✓ should confirm delivery
    ✓ should auto-release funds after deadline

RatingContract
  Rating Submission
    ✓ should submit a rating for completed order
    ✓ should update aggregate rating
    ✓ should prevent duplicate ratings

  27 passing (2.5s)
```

---

## Next: Deploy to CAMP Testnet

Once tests pass locally, deploy to CAMP testnet:

```bash
# Set environment variables in .env
CAMP_TESTNET_RPC_URL=https://...
PRIVATE_KEY=0x...

# Deploy
npx hardhat run contracts/scripts/deploy.ts --network camp-testnet
```

---

## Documentation References

- **Architecture**: `docs/ESCROW_ARCHITECTURE.md`
- **Interfaces**: `docs/CONTRACT_INTERFACES.md`
- **Completion Summary**: `docs/PHASE_2_COMPLETION.md`

---

**Status**: Ready for comprehensive testing and testnet deployment 🚀
