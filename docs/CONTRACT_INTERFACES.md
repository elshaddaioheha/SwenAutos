# SwenAutos Smart Contract Interfaces & Implementation Guide

## Overview

This document provides a quick reference to the three core smart contracts that power the SwenAutos marketplace. Each contract has a corresponding Solidity interface file in `contracts/interfaces/`.

---

## 1. Contract Files & Locations

| Contract | Interface File | Purpose |
|----------|---|---|
| **ProductListingContract** | `contracts/interfaces/IProductListing.sol` | Product CRUD, inventory management |
| **EscrowContract** | `contracts/interfaces/IEscrow.sol` | Order lifecycle, escrow funding, dispute resolution |
| **RatingContract** | `contracts/interfaces/IRating.sol` | Seller ratings, review aggregation |

---

## 2. Contract Interaction Diagram

```
┌──────────────────────────┐
│  ProductListingContract  │
│  (IProductListing)       │
├──────────────────────────┤
│ • createListing()        │
│ • updateListing()        │
│ • reduceInventory()      │
│ • getProduct()           │
│ • getSellerProducts()    │
└────────────┬─────────────┘
             │
             │ references
             │
             ▼
┌──────────────────────────┐
│    EscrowContract        │
│    (IEscrow)             │
├──────────────────────────┤
│ • createOrder()          │
│ • fundEscrow()           │
│ • markShipped()          │
│ • confirmDelivery()      │
│ • releaseFundsToSeller() │
│ • openDispute()          │
│ • resolveDispute()       │
└────────────┬─────────────┘
             │
             │ references
             │
             ▼
┌──────────────────────────┐
│     RatingContract       │
│     (IRating)            │
├──────────────────────────┤
│ • submitRating()         │
│ • getRating()            │
│ • getSellerAggregateRating()│
│ • hasRatedOrder()        │
└──────────────────────────┘
```

---

## 3. Data Flow & State Transitions

### A. Product Listing Flow

```
Seller calls ProductListingContract.createListing()
    ↓
ProductListingContract stores product metadata
    ↓
ListingCreated event emitted
    ↓
Buyer views products via getAllActiveProducts()
    ↓
Buyer selects product & initiates order
    ↓
EscrowContract.createOrder() references productId
    ↓
EscrowContract calls ProductListingContract.reduceInventory()
```

### B. Order & Escrow Flow

```
Buyer calls EscrowContract.createOrder(productId, seller, amount, paymentMethod)
    ↓
Order status: CREATED
    ↓
    ├─ If CAMP_TOKEN:
    │  • Buyer approves token transfer to EscrowContract
    │  • Buyer calls fundEscrow(orderId, amount)
    │  • EscrowContract.transferFrom(buyer, contract, amount)
    │  • Order status: FUNDED
    │
    └─ If PAYSTACK or FLUTTERWAVE:
       • Backend initiates payment with provider
       • Payment provider webhook → Backend
       • Backend verifies payment & calls fundEscrow() on behalf of buyer
       • Order status: FUNDED
    ↓
Seller confirms shipment via markShipped(orderId, trackingNumber)
    ↓
Order status: SHIPPED
    ↓
Buyer confirms delivery via confirmDelivery(orderId)
    ↓
Order status: DELIVERED
    ↓
    ├─ If no dispute & deadline passed:
    │  • autoReleaseIfEligible() called
    │  • EscrowContract transfers tokens to seller
    │  • Order status: COMPLETED
    │
    └─ If buyer initiates rating:
       • RatingContract.submitRating(orderId, seller, score, reviewHash)
       • RatingContract updates seller aggregate rating
```

### C. Dispute Flow

```
Buyer or Seller calls EscrowContract.openDispute(orderId, reason, description)
    ↓
Order status: DISPUTED
    ↓
Arbitrator (admin) reviews evidence
    ↓
Arbitrator calls EscrowContract.resolveDispute(disputeId, buyerAmount, sellerAmount)
    ↓
EscrowContract transfers funds accordingly:
    • releaseFundsToSeller(orderId, sellerAmount)
    • refundBuyer(orderId, buyerAmount)
    ↓
Order status: RESOLVED
```

---

## 4. Key Functions Breakdown

### ProductListingContract

#### Write Functions
- `createListing()` → Create new product
- `updateListing()` → Edit product details
- `deactivateListing()` → Hide product from catalog
- `reduceInventory()` → Decrease stock (called by EscrowContract on order)
- `restoreInventory()` → Increase stock (called by EscrowContract on order cancellation)

#### Read Functions
- `getProduct()` → Fetch product details by ID
- `getAllActiveProducts()` → Browse catalog (paginated)
- `getSellerProducts()` → Fetch seller's listings
- `isProductAvailable()` → Check if product can be ordered

---

### EscrowContract

#### Write Functions (Buyer)
- `createOrder()` → Initiate order
- `fundEscrow()` → Transfer CAMP tokens to escrow
- `fundEscrowNative()` → Send native token to escrow
- `confirmDelivery()` → Confirm item received
- `openDispute()` → Raise dispute

#### Write Functions (Seller)
- `markShipped()` → Confirm shipment with tracking

#### Write Functions (Arbitrator)
- `resolveDispute()` → Arbitrate and allocate funds

#### Write Functions (Anyone)
- `autoReleaseIfEligible()` → Trigger auto-release if conditions met
- `releaseFundsToSeller()` → Release escrowed tokens to seller
- `refundBuyer()` → Return escrowed tokens to buyer

#### Read Functions
- `getOrder()` → Fetch order details
- `getBuyerOrders()` → View buyer's order history
- `getSellerOrders()` → View seller's order history
- `getDispute()` → Fetch dispute details
- `canBuyerConfirmDelivery()` → Check if buyer can confirm
- `isEligibleForAutoRelease()` → Check auto-release eligibility

---

### RatingContract

#### Write Functions
- `submitRating()` → Buyer submits 1-5 star rating (post-delivery only)
- `removeRating()` → Admin removes fraudulent ratings

#### Read Functions
- `getRating()` → Fetch rating details
- `getSellerRatings()` → Paginated list of ratings for a seller
- `getSellerAggregateRating()` → Get average score and total count
- `hasRatedOrder()` → Check if order already rated
- `getOrderRating()` → Fetch rating for a specific order

---

## 5. Event Signatures (for Listening/Indexing)

### ProductListingContract Events
```solidity
event ListingCreated(uint256 indexed productId, address indexed seller, ...);
event ListingUpdated(uint256 indexed productId, ...);
event ListingDeactivated(uint256 indexed productId, address indexed seller, ...);
event InventoryReduced(uint256 indexed productId, ...);
```

### EscrowContract Events
```solidity
event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, ...);
event OrderFunded(uint256 indexed orderId, ...);
event OrderShipped(uint256 indexed orderId, address indexed seller, ...);
event OrderDeliveryConfirmed(uint256 indexed orderId, address indexed buyer, ...);
event FundsReleasedToSeller(uint256 indexed orderId, address indexed seller, ...);
event RefundIssuedToBuyer(uint256 indexed orderId, address indexed buyer, ...);
event OrderAutoReleased(uint256 indexed orderId, ...);
event DisputeOpened(uint256 indexed disputeId, uint256 indexed orderId, address indexed initiator, ...);
event DisputeResolved(uint256 indexed disputeId, address indexed arbitrator, ...);
```

### RatingContract Events
```solidity
event RatingSubmitted(uint256 indexed ratingId, uint256 indexed orderId, address indexed seller, ...);
event AggregateRatingUpdated(address indexed seller, ...);
event RatingRemoved(uint256 indexed ratingId, address indexed seller, ...);
```

---

## 6. Implementation Checklist

### Phase 1: Implement Contracts
- [ ] Create `ProductListingContract.sol` implementing `IProductListing`
- [ ] Create `EscrowContract.sol` implementing `IEscrow`
- [ ] Create `RatingContract.sol` implementing `IRating`
- [ ] Add OpenZeppelin imports (Ownable, AccessControl, ReentrancyGuard, etc.)
- [ ] Implement state variables, constructors, and core logic
- [ ] Emit events for all critical operations

### Phase 2: Unit Tests (Hardhat)
- [ ] Test ProductListingContract (CRUD, inventory, access control)
- [ ] Test EscrowContract (order creation, funding, shipment, delivery)
- [ ] Test EscrowContract (dispute opening and resolution)
- [ ] Test RatingContract (submission, aggregation, access control)
- [ ] Test cross-contract interactions

### Phase 3: Integration & Deployment
- [ ] Deploy to CAMP testnet
- [ ] Verify contract source on block explorer
- [ ] Update deployment config with contract addresses
- [ ] Document constructor arguments and network details

### Phase 4: Frontend Integration
- [ ] Create web3 utility functions for contract interaction
- [ ] Implement contract call wrappers (ethers.js/wagmi)
- [ ] Wire frontend pages to contract methods
- [ ] Listen to contract events and update UI in real-time

---

## 7. Security Checklist

### Access Control
- [ ] Only seller can modify their listings
- [ ] Only buyer can confirm delivery
- [ ] Only arbitrator can resolve disputes
- [ ] Ratings only submitted by order participants

### Reentrancy & Token Safety
- [ ] Use ReentrancyGuard on external calls
- [ ] Check return values on token transfers
- [ ] Use safe token interfaces (ERC20 standard)
- [ ] Validate token address before using

### State Management
- [ ] Prevent double-spending (e.g., releasing funds twice)
- [ ] Ensure order status transitions are valid
- [ ] Validate amounts and balances before transfers
- [ ] Check inventory bounds before reducing

### Off-Chain Payment Integration
- [ ] Validate webhook HMAC signatures
- [ ] Prevent duplicate funding on same payment ID
- [ ] Rate-limit webhook endpoints
- [ ] Log all payment provider interactions

---

## 8. Environment Variables & Configuration

```bash
# Network RPC URLs
CAMP_TESTNET_RPC_URL=https://...
CAMP_MAINNET_RPC_URL=https://...

# Contract Deployment Account
PRIVATE_KEY=0x...

# CAMP Token Address
CAMP_TOKEN_ADDRESS=0x...           # Testnet
CAMP_TOKEN_ADDRESS_MAINNET=0x...   # Mainnet

# Admin & Arbitrator Address
ARBITRATOR_ADDRESS=0x...           # Multi-sig wallet

# Payment Provider Credentials
PAYSTACK_SECRET_KEY=sk_...
PAYSTACK_PUBLIC_KEY=pk_...

FLUTTERWAVE_SECRET_KEY=...
FLUTTERWAVE_PUBLIC_KEY=...

# Backend (for webhook handling)
BACKEND_URL=http://localhost:3000
WEBHOOK_SECRET=...
```

---

## 9. Gas Estimates (Approximate)

| Function | Gas Cost |
|----------|----------|
| `createListing()` | 80,000–120,000 |
| `updateListing()` | 40,000–60,000 |
| `createOrder()` | 100,000–150,000 |
| `fundEscrow()` (token transfer) | 80,000–120,000 |
| `markShipped()` | 50,000–80,000 |
| `confirmDelivery()` | 60,000–90,000 |
| `submitRating()` | 70,000–100,000 |
| `resolveDispute()` | 100,000–150,000 |

---

## 10. Next Steps

1. **Review**: Stakeholders review interface files and architecture doc
2. **Implementation**: Implement concrete contract files from interfaces
3. **Testing**: Write unit & integration tests
4. **Deployment**: Deploy to testnet, verify, then mainnet
5. **Frontend**: Integrate contracts into Next.js app via web3 library

---

## 11. File References

- **Architecture**: `docs/ESCROW_ARCHITECTURE.md`
- **ProductListing Interface**: `contracts/interfaces/IProductListing.sol`
- **Escrow Interface**: `contracts/interfaces/IEscrow.sol`
- **Rating Interface**: `contracts/interfaces/IRating.sol`
- **Implementation Templates**: (to be created in Phase 3)
- **Test Files**: `contracts/test/` (to be created)
- **Deployment Script**: `contracts/scripts/deploy.ts` (to be updated)

---

## Document Version

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-27 | Architecture Team | Initial interface definitions and implementation guide |
