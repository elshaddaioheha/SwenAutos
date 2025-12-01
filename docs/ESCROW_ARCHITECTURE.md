# SwenAutos Escrow & Marketplace Architecture

## Overview

This document describes the smart contract architecture for SwenAutos, a decentralized marketplace for automotive products and services. The system orchestrates buyer–seller transactions through an escrow mechanism, supporting multiple payment methods (CAMP token, Paystack, Flutterwave) and dispute resolution.

---

## 1. System Architecture

### 1.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                          SwenAutos dApp                         │
│  (Next.js Frontend + Backend API)                               │
└──────────┬──────────────────────────────────────────────────────┘
           │
     ┌─────┴──────────────────────────────────────────────────────┐
     │                                                             │
┌────▼──────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│ ProductListing    │  │ Escrow           │  │ Rating          │ │
│ Contract          │  │ Contract         │  │ Contract        │ │
│                   │  │                  │  │                 │ │
│ - Listings        │  │ - Order State    │  │ - Seller        │ │
│ - Inventory       │  │   Management     │  │   Ratings       │ │
│ - Seller Data     │  │ - Token Mgmt     │  │ - Review Data   │ │
│ - Metadata        │  │ - Dispute Logic  │  │ - Aggregation   │ │
└────────────────────┘  └──────────────────┘  └─────────────────┘ │
     │                        │                       │             │
     └────────────────────────┼───────────────────────┘             │
                              │                                     │
                    ┌─────────▼────────────┐                        │
                    │ CAMP Token (ERC-20)  │                        │
                    │ (Escrow Funding)     │                        │
                    └──────────────────────┘                        │
                              │                                     │
     ┌────────────────────────┼──────────────────────────────────┐ │
     │                        │                                  │ │
  ┌──▼──────────┐   ┌────────▼────────┐   ┌─────────────────┐  │ │
  │ Paystack    │   │ Flutterwave     │   │ Direct Token    │  │ │
  │ Payment API │   │ Payment API     │   │ Transfer        │  │ │
  └─────────────┘   └─────────────────┘   └─────────────────┘  │ │
                                                                 │ │
                         Payment & Webhook Layer                 │ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Models & State Machine

### 2.1 Order State Machine

```
     ┌──────────┐
     │ CREATED  │  ← Order initiated (buyer selects product)
     └────┬─────┘
          │
          │ [Payment Method Selected]
          │
     ┌────▼──────────┐
     │ PENDING_FUND  │  ← Awaiting escrow funding (off-chain payment or token approval)
     └────┬──────────┘
          │
          │ [Escrow Funded]
          │
     ┌────▼────────┐
     │ FUNDED       │  ← CAMP tokens locked in escrow (or payment verified)
     └────┬────────┘
          │
          │ [Seller Confirmed Shipment]
          │
     ┌────▼────────┐
     │ SHIPPED      │  ← Item en-route (seller provides tracking)
     └────┬────────┘
          │
          │ [Buyer Confirms Delivery]
          │
     ┌────▼────────┐
     │ DELIVERED    │  ← Item received; funds eligible for release
     └────┬────────┘
          │
          ├─────────────────────────────────────┐
          │                                     │
     [No Dispute]                       [Dispute Raised]
          │                                     │
     ┌────▼────────┐                  ┌────────▼─────┐
     │ COMPLETED    │                  │ DISPUTED      │
     └─────────────┘                  └────────┬─────┘
                                               │
                                        [Arbitration]
                                               │
                              ┌────────────────┼──────────────┐
                              │                │              │
                         [Resolved]       [Partial]      [Refund]
                              │           [Release]         │
                         ┌────▼──┐      ┌──────┬────┐   ┌───▼────┐
                         │RESOLVED│     │SPLIT │FUND│   │REFUNDED │
                         └────────┘     └──────┴────┘   └─────────┘
```

### 2.2 Order Data Structure (On-Chain)

```solidity
struct Order {
    uint256 orderId;              // Unique identifier
    address buyer;                // Buyer wallet address
    address seller;               // Seller wallet address
    uint256 productId;            // Reference to ProductListing
    
    uint256 amount;               // Amount in escrow (CAMP tokens or stablecoin)
    address paymentToken;         // Token address (CAMP, USDC, etc.)
    PaymentMethod paymentMethod;  // CAMP_TOKEN, PAYSTACK, FLUTTERWAVE
    string externalPaymentId;     // Reference to off-chain payment (Paystack/FW ID)
    
    OrderStatus status;           // Current state (CREATED, FUNDED, SHIPPED, etc.)
    uint256 createdAt;            // Timestamp
    uint256 fundedAt;             // When escrow was funded
    uint256 shippedAt;            // When seller marked as shipped
    uint256 deliveredAt;          // When buyer confirmed receipt
    
    string trackingNumber;        // Seller-provided tracking info
    uint256 autoReleaseDeadline;  // Unix timestamp for auto-release (if no dispute)
}
```

### 2.3 Dispute Data Structure (On-Chain)

```solidity
struct Dispute {
    uint256 disputeId;
    uint256 orderId;
    address initiator;            // Buyer or Seller
    DisputeReason reason;         // PRODUCT_NOT_RECEIVED, QUALITY_ISSUE, UNAUTHORIZED, etc.
    string description;           // Off-chain data (stored as IPFS hash or log)
    
    DisputeStatus status;         // OPEN, RESOLVED, REJECTED
    uint256 createdAt;
    uint256 resolvedAt;
    
    address arbitrator;           // Admin/arbitrator address
    uint256 buyerRelease;         // Amount to release to buyer
    uint256 sellerRelease;        // Amount to release to seller
}
```

### 2.4 Product Listing Data Structure (On-Chain)

```solidity
struct Product {
    uint256 productId;
    address seller;
    string name;                  // Product name
    string description;           // Short description
    string category;              // e.g., "Engine", "Transmission", "Wheels"
    
    uint256 price;                // Price in wei (e.g., 18 decimals for ERC-20)
    address priceToken;           // Token address (CAMP)
    
    uint256 inventory;            // Available quantity
    uint256 sold;                 // Units sold
    
    string ipfsHash;              // Optional: IPFS hash for extended metadata/images
    bool isActive;                // Seller can deactivate listing
    
    uint256 createdAt;
    uint256 updatedAt;
}
```

### 2.5 Seller Rating Data Structure (On-Chain)

```solidity
struct SellerRating {
    uint256 ratingId;
    uint256 orderId;              // Reference to completed order
    address buyer;
    address seller;
    
    uint8 score;                  // 1–5 stars
    string reviewHash;            // IPFS hash or off-chain reference for review text
    
    uint256 timestamp;
}

struct SellerAggregateRating {
    address seller;
    uint256 totalRatings;
    uint256 totalScore;           // Sum of all scores
    uint8 averageScore;           // Cached average (updated after each rating)
}
```

---

## 3. Contract Specifications

### 3.1 ProductListingContract

**Roles & Permissions:**
- **Seller**: Can create, update, and deactivate their own listings.
- **Public**: Can view active listings (read-only).

**Core Functions:**

```solidity
// Create a new listing
function createListing(
    string memory name,
    string memory description,
    string memory category,
    uint256 price,
    address priceToken,
    uint256 initialInventory,
    string memory ipfsHash
) external returns (uint256 productId);

// Update listing details
function updateListing(
    uint256 productId,
    string memory name,
    string memory description,
    uint256 price,
    uint256 inventory,
    string memory ipfsHash
) external;

// Deactivate listing
function deactivateListing(uint256 productId) external;

// Retrieve listing details
function getProduct(uint256 productId)
    external
    view
    returns (Product memory);

// List all products from a seller
function getSellerProducts(address seller)
    external
    view
    returns (uint256[] memory productIds);

// Get all active products (for buyer browsing)
function getAllActiveProducts(uint256 offset, uint256 limit)
    external
    view
    returns (Product[] memory);
```

**Events:**

```solidity
event ListingCreated(
    uint256 indexed productId,
    address indexed seller,
    string name,
    uint256 price,
    uint256 inventory
);

event ListingUpdated(
    uint256 indexed productId,
    uint256 newPrice,
    uint256 newInventory
);

event ListingDeactivated(uint256 indexed productId, address indexed seller);

event InventoryReduced(
    uint256 indexed productId,
    uint256 newInventory
);
```

---

### 3.2 EscrowContract

**Roles & Permissions:**
- **Buyer**: Can initiate orders, confirm delivery, open disputes, cancel pending orders.
- **Seller**: Can confirm shipment, request fund release (after delivery), accept partial release.
- **Arbitrator** (admin): Can resolve disputes and allocate funds.
- **Public**: Can query order status (read-only).

**Core Functions:**

```solidity
// Buyer initiates an order (after selecting product & payment method)
function createOrder(
    uint256 productId,
    address seller,
    uint256 amount,
    address paymentToken,
    PaymentMethod paymentMethod,
    string memory externalPaymentId
) external returns (uint256 orderId);

// Fund escrow with CAMP tokens (buyer approval required beforehand)
function fundEscrow(uint256 orderId, uint256 amount) external;

// Fund escrow with native token (if supported)
function fundEscrowNative(uint256 orderId) external payable;

// Seller marks order as shipped
function markShipped(uint256 orderId, string memory trackingNumber) external;

// Buyer confirms delivery
function confirmDelivery(uint256 orderId) external;

// Auto-release if no dispute after deadline
function autoReleaseIfEligible(uint256 orderId) external;

// Release funds to seller (after delivery or arbitration)
function releaseFundsToSeller(uint256 orderId, uint256 amount) external;

// Refund funds to buyer (in case of cancellation or dispute resolution)
function refundBuyer(uint256 orderId, uint256 amount) external;

// Retrieve order details
function getOrder(uint256 orderId)
    external
    view
    returns (Order memory);

// Get all orders for a buyer
function getBuyerOrders(address buyer)
    external
    view
    returns (uint256[] memory orderIds);

// Get all orders for a seller
function getSellerOrders(address seller)
    external
    view
    returns (uint256[] memory orderIds);
```

**Events:**

```solidity
event OrderCreated(
    uint256 indexed orderId,
    address indexed buyer,
    address indexed seller,
    uint256 productId,
    uint256 amount
);

event OrderFunded(
    uint256 indexed orderId,
    uint256 amount,
    address indexed paymentToken
);

event OrderShipped(
    uint256 indexed orderId,
    string trackingNumber
);

event OrderDeliveryConfirmed(uint256 indexed orderId, address indexed buyer);

event FundsReleasedToSeller(
    uint256 indexed orderId,
    address indexed seller,
    uint256 amount
);

event RefundIssuedToBuyer(
    uint256 indexed orderId,
    address indexed buyer,
    uint256 amount
);

event OrderAutoReleased(uint256 indexed orderId, uint256 amount);
```

---

### 3.3 RatingContract

**Roles & Permissions:**
- **Buyer** (who purchased): Can submit one rating per order, only after delivery.
- **Public**: Can view ratings and aggregates (read-only).
- **Arbitrator** (admin): Can remove fraudulent ratings (optional).

**Core Functions:**

```solidity
// Buyer submits a rating for a completed order
function submitRating(
    uint256 orderId,
    address seller,
    uint8 score,        // 1–5
    string memory reviewHash  // IPFS hash or off-chain reference
) external;

// Retrieve rating by ID
function getRating(uint256 ratingId)
    external
    view
    returns (SellerRating memory);

// Get all ratings for a seller
function getSellerRatings(address seller)
    external
    view
    returns (SellerRating[] memory);

// Get aggregate rating for a seller
function getSellerAggregateRating(address seller)
    external
    view
    returns (SellerAggregateRating memory);

// Check if buyer already rated an order
function hasRatedOrder(uint256 orderId, address buyer)
    external
    view
    returns (bool);
```

**Events:**

```solidity
event RatingSubmitted(
    uint256 indexed ratingId,
    uint256 indexed orderId,
    address indexed seller,
    address indexed buyer,
    uint8 score
);

event AggregateRatingUpdated(
    address indexed seller,
    uint256 totalRatings,
    uint8 averageScore
);
```

---

## 4. Integration Points

### 4.1 Payment Method Flow

#### A. CAMP Token Direct Payment
```
Buyer selects CAMP Token
    ↓
Buyer approves EscrowContract to spend CAMP tokens
    ↓
Buyer calls fundEscrow(orderId, amount)
    ↓
EscrowContract.transferFrom(buyer, contract, amount) [CAMP token transfer]
    ↓
Order status → FUNDED
    ↓
Seller ships → SHIPPED
    ↓
Buyer confirms → DELIVERED
    ↓
Auto-release or seller claims → COMPLETED
    ↓
EscrowContract.transfer(seller, amount) [CAMP tokens sent to seller]
```

#### B. Paystack Off-Chain Payment
```
Buyer selects Paystack at checkout
    ↓
Backend creates Paystack payment link (amount in NGN/GHS, etc.)
    ↓
Buyer completes Paystack payment (external to blockchain)
    ↓
Paystack webhook → Backend API endpoint
    ↓
Backend verifies payment signature & success
    ↓
Backend calls EscrowContract.fundEscrow() [as trusted oracle/relayer]
    ↓
Order status → FUNDED
    ↓
[Rest of order flow as above]
```

#### C. Flutterwave Off-Chain Payment
```
Similar to Paystack; uses Flutterwave API & webhooks
    ↓
Backend verifies payment & calls EscrowContract
    ↓
Order status → FUNDED
```

### 4.2 Payment Verification & Security

- **Backend acts as oracle**: Verifies off-chain payments and calls escrow funding on-chain.
- **Webhook validation**: All webhooks verified with provider signature (HMAC-SHA256 or similar).
- **Nonce/idempotency**: Backend tracks external payment IDs to prevent duplicate funding calls.
- **Rate limiting**: Enforce limits on webhook processing to prevent replay attacks.

---

## 5. Dispute Resolution Flow

```
Buyer or Seller opens dispute
    ↓
Order status → DISPUTED
    ↓
Provide evidence (off-chain: attachment/message hashes stored)
    ↓
Arbitrator (admin) reviews:
    - Buyer claim (product quality, non-receipt, etc.)
    - Seller defense (proof of shipment, tracking, etc.)
    ↓
Arbitrator decision:
    ├─ Full Refund to Buyer (malicious seller)
    ├─ Full Release to Seller (frivolous dispute)
    └─ Partial Split (shared fault)
    ↓
Funds transferred
    ↓
Order status → RESOLVED
```

---

## 6. Security Considerations

### 6.1 Smart Contract Security

1. **Reentrancy**: Use checks-effects-interactions pattern; consider OpenZeppelin's ReentrancyGuard if external calls made.
2. **Integer Overflow/Underflow**: Use Solidity ^0.8.0 (built-in overflow protection) or SafeMath.
3. **Unchecked Transfers**: Always check return values of token transfers; use try-catch or require.
4. **Access Control**: Use OpenZeppelin's Ownable or AccessControl for role-based permissions.
5. **Token Approval Race Condition**: Escrow should handle token approvals carefully (pre-approve or atomic).

### 6.2 Off-Chain Security

1. **Webhook Validation**: Always verify HMAC signature from payment providers.
2. **Idempotency**: Use external payment IDs as unique keys to prevent duplicate funding.
3. **API Rate Limiting**: Protect backend endpoints (especially webhook handlers) from DoS.
4. **Private Keys**: Use environment variables; never commit keys to repo.
5. **Dispute Evidence**: Hash evidence (text/images) and store on IPFS or off-chain DB; on-chain store hash only.

### 6.3 Admin & Upgrade Path

1. **Arbitrator Role**: Multi-sig wallet (2-of-3 or similar) for critical decisions.
2. **Pausable**: Consider pause mechanism for emergency (OpenZeppelin's Pausable).
3. **Upgradeable Contracts**: Use transparent proxy pattern if future upgrades anticipated.

---

## 7. Testing Strategy

### 7.1 Unit Tests (Hardhat)

- **ProductListingContract**:
  - CRUD operations (create, update, deactivate).
  - Inventory management (reduce on order, check bounds).
  - Access control (only seller can modify their listing).

- **EscrowContract**:
  - Order creation with different payment methods.
  - Funding (CAMP token transfer, mock Paystack/FW).
  - Order lifecycle (shipped → delivered → completed).
  - Dispute creation and resolution.
  - Auto-release on timeout.

- **RatingContract**:
  - Rating submission (only after delivery).
  - One rating per order (check duplicate).
  - Aggregate calculation.

### 7.2 Integration Tests

- Cross-contract interaction: Listing → Escrow → Rating.
- Payment flows: Simulate Paystack/FW webhooks, verify escrow funding.
- End-to-end order cycle.

### 7.3 Fork Tests (Optional)

- Test against mainnet CAMP token to ensure compatibility.

---

## 8. Deployment & Configuration

### 8.1 Testnet Deployment (CAMP Testnet)

```javascript
// Pseudocode: deploy.ts
const productListingDeploy = await ProductListingContract.deploy();
const escrowDeploy = await EscrowContract.deploy(productListingDeploy.address);
const ratingDeploy = await RatingContract.deploy(escrowDeploy.address);

// Log addresses
console.log("ProductListing:", productListingDeploy.address);
console.log("Escrow:", escrowDeploy.address);
console.log("Rating:", ratingDeploy.address);

// Store in config/testnet.json or environment
```

### 8.2 Mainnet Deployment

- Use hardware wallet or multi-sig for private key.
- Increase gas limits for mainnet.
- Verify contracts on block explorer.
- Record deployment addresses in version control (config file, not .env).

---

## 9. Frontend Integration Points

### 9.1 Next.js API Routes

```typescript
// pages/api/orders/create.ts
// POST: Initiate order (check inventory, validate buyer, create order on-chain)

// pages/api/orders/[orderId].ts
// GET: Fetch order details from contract

// pages/api/payments/paystack/webhook.ts
// POST: Handle Paystack webhook, fund escrow

// pages/api/payments/flutterwave/webhook.ts
// POST: Handle Flutterwave webhook, fund escrow

// pages/api/ratings/submit.ts
// POST: Buyer submits rating (check order ownership, call RatingContract)
```

### 9.2 Frontend Components

- **ProductListing Page**: Fetch from ProductListingContract, render catalog.
- **CheckoutPage**: Select payment method, initiate order.
- **OrderTracking**: Poll contract for order status updates.
- **RatingModal**: Submit rating after delivery.

---

## 10. Token & Network Configuration

### 10.1 CAMP Token

- **Network**: CAMP Mainnet / CAMP Testnet
- **Symbol**: CAMP
- **Decimals**: 18 (assumed; verify before deployment)
- **Use Case**: Escrow funding, seller earnings, marketplace fees (future).

### 10.2 Environment Variables

```
CAMP_TESTNET_RPC_URL=https://...
CAMP_MAINNET_RPC_URL=https://...
CAMP_TOKEN_ADDRESS=0x...  # Testnet
CAMP_TOKEN_ADDRESS_MAINNET=0x...

PRIVATE_KEY=0x...

PAYSTACK_SECRET_KEY=...
PAYSTACK_PUBLIC_KEY=...

FLUTTERWAVE_SECRET_KEY=...
FLUTTERWAVE_PUBLIC_KEY=...

ARBITRATOR_ADDRESS=0x...  # Multi-sig wallet
```

---

## 11. Future Enhancements

1. **Multi-Token Support**: Accept USDC, USDT, or other stablecoins in escrow.
2. **Fee Mechanism**: Marketplace commission (% of order value).
3. **Reputation NFT**: Mint badges for highly-rated sellers.
4. **Insurance Pool**: Cover buyer/seller disputes with insurance fund.
5. **Gasless Transactions**: Relayer infrastructure for user-friendly UX.
6. **DAO Governance**: Community voting on dispute resolution (Phase 2 upgrade).

---

## 12. Quick Reference: Contract Interface Summary

| Contract | Key Functions | Key Events |
|----------|---------------|-----------|
| **ProductListing** | `createListing`, `updateListing`, `deactivateListing`, `getProduct` | `ListingCreated`, `ListingUpdated`, `ListingDeactivated` |
| **Escrow** | `createOrder`, `fundEscrow`, `markShipped`, `confirmDelivery`, `releaseFundsToSeller`, `refundBuyer` | `OrderCreated`, `OrderFunded`, `OrderShipped`, `FundsReleasedToSeller`, `RefundIssuedToBuyer` |
| **Rating** | `submitRating`, `getRating`, `getSellerRatings`, `getSellerAggregateRating` | `RatingSubmitted`, `AggregateRatingUpdated` |

---

## Appendix: Sequence Diagrams

### Happy Path: Buyer Purchases with CAMP Token

```
Buyer                EscrowContract        ProductListingContract        RatingContract
  │                        │                        │                           │
  ├────[Create Order]───────►                        │                           │
  │    (product, amount,                             │                           │
  │     payment method)                              │                           │
  │◄────[orderId]───────────┤                        │                           │
  │                         │                        │                           │
  ├────[Approve Token]──────────────────────────────►                           │
  │    (EscrowContract,                              │                           │
  │     amount)                                      │                           │
  │                         │                        │                           │
  ├────[fundEscrow]────────►                         │                           │
  │    (orderId, amount)    │                        │                           │
  │                         │──[Check Inventory]────►                           │
  │                         │◄─[OK]──────────────────┤                           │
  │                         │──[Transfer Token]─────────┐                        │
  │                         │                           │ (CAMP transferred)     │
  │◄────[FUNDED]───────────┤                         │                           │
  │                         │                        │                           │
  │                   [Seller Confirmation]           │                           │
  │                         │                        │                           │
  ├────[markShipped]───────►                         │                           │
  │    (orderId, tracking)  │                        │                           │
  │                         │                        │                           │
  │◄────[SHIPPED]──────────┤                         │                           │
  │                         │                        │                           │
  │                   [Delivery]                      │                           │
  │                         │                        │                           │
  ├────[confirmDelivery]───►                         │                           │
  │    (orderId)            │                        │                           │
  │                         │                        │                           │
  │◄────[DELIVERED]────────┤                         │                           │
  │                         │                        │                           │
  │        [Auto-Release or Manual]                  │                           │
  │                         │                        │                           │
  ├────[releaseFundsToSeller]►                       │                           │
  │    (orderId, amount)    │──[Transfer to Seller]──┐                           │
  │                         │                        │                           │
  │◄────[COMPLETED]────────┤                         │                           │
  │                         │                        │                           │
  │                   [Post-Purchase Rating]         │                           │
  │                         │                        │                        ───┤
  ├────[submitRating]──────────────────────────────────────────────────────────►│
  │    (orderId, seller,                             │                           │
  │     score, reviewHash)                           │                           │
  │                         │                        │                           │
  │◄────[ratingId]─────────────────────────────────────────────────────────────┤
  │                         │                        │                           │
  │                         │                        │                           │
```

---

## Document Approval & Versioning

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-27 | Architecture Team | Initial design; 3-contract model, CAMP + off-chain payment support |

---

## Next Steps

1. **Review & Approval**: Stakeholders review this document.
2. **Contract Implementation**: Implement ProductListingContract, EscrowContract, RatingContract based on specifications.
3. **Unit Testing**: Write comprehensive tests in Hardhat.
4. **Testnet Deployment**: Deploy to CAMP testnet; validate integrations.
5. **Frontend Integration**: Connect Next.js app to contracts and payment providers.
