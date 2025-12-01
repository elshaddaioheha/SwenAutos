# Smart Contract Code Reference

## Complete Contract Overview

### 1. ProductListingContract

**Location**: `contracts/ProductListingContract.sol`  
**Lines of Code**: ~350  
**Solidity Version**: ^0.8.19

#### Key Features
- ✅ Product CRUD operations
- ✅ Inventory tracking (inventory + sold)
- ✅ Seller access control
- ✅ Active products listing with pagination
- ✅ Reentrancy protection

#### State Variables

```solidity
Counters.Counter private _productIdCounter;           // Auto-increment product IDs
mapping(uint256 => Product) public products;          // Product ID → Product struct
mapping(address => uint256[]) public sellerProducts;  // Seller → Product IDs
mapping(uint256 => bool) public productExists;        // Product ID → Exists flag
uint256[] public activeProductIds;                    // List of active product IDs
mapping(uint256 => uint256) private activeProductIndex; // Product ID → Index in array
```

#### Main Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `createListing()` | External | Seller creates new product |
| `updateListing()` | External (seller only) | Update product details |
| `deactivateListing()` | External (seller only) | Hide product |
| `reduceInventory()` | External | Called by Escrow on order |
| `restoreInventory()` | External | Called by Escrow on refund |
| `getProduct()` | View | Fetch product by ID |
| `getAllActiveProducts()` | View | Paginated product list |
| `getSellerProducts()` | View | Fetch seller's products |
| `isProductAvailable()` | View | Check if product can be ordered |

#### Data Structure

```solidity
struct Product {
    uint256 productId;      // Unique ID (auto-increment)
    address seller;         // Seller's wallet
    string name;            // Product name
    string description;     // Product description
    string category;        // Category (e.g., "Engine")
    uint256 price;          // Price in wei (18 decimals)
    address priceToken;     // Token address (e.g., CAMP)
    uint256 inventory;      // Available units
    uint256 sold;           // Total units sold
    string ipfsHash;        // IPFS hash for images/metadata
    bool isActive;          // Listing active status
    uint256 createdAt;      // Creation timestamp
    uint256 updatedAt;      // Last update timestamp
}
```

#### Events

```solidity
event ListingCreated(
    uint256 indexed productId,
    address indexed seller,
    string name,
    uint256 price,
    uint256 inventory,
    uint256 timestamp
);

event ListingUpdated(uint256 indexed productId, uint256 newPrice, uint256 newInventory, uint256 timestamp);
event ListingDeactivated(uint256 indexed productId, address indexed seller, uint256 timestamp);
event InventoryReduced(uint256 indexed productId, uint256 previousInventory, uint256 newInventory, uint256 timestamp);
event InventoryRestored(uint256 indexed productId, uint256 previousInventory, uint256 newInventory, uint256 timestamp);
```

---

### 2. EscrowContract

**Location**: `contracts/EscrowContract.sol`  
**Lines of Code**: ~650  
**Solidity Version**: ^0.8.19

#### Key Features
- ✅ Order lifecycle management (9 states)
- ✅ Multi-payment support (CAMP token, Paystack, Flutterwave)
- ✅ SafeERC20 token transfers
- ✅ Dispute resolution with arbitrator
- ✅ Auto-release after deadline
- ✅ ProductListingContract integration
- ✅ Reentrancy protection

#### Enums

```solidity
enum OrderStatus {
    CREATED,          // 0
    PENDING_FUND,     // 1
    FUNDED,           // 2
    SHIPPED,          // 3
    DELIVERED,        // 4
    DISPUTED,         // 5
    COMPLETED,        // 6
    CANCELLED,        // 7
    REFUNDED          // 8
}

enum PaymentMethod {
    CAMP_TOKEN,       // 0
    PAYSTACK,         // 1
    FLUTTERWAVE       // 2
}

enum DisputeReason {
    PRODUCT_NOT_RECEIVED,      // 0
    QUALITY_ISSUE,             // 1
    WRONG_ITEM,                // 2
    UNAUTHORIZED_TRANSACTION,  // 3
    DAMAGED_IN_TRANSIT,        // 4
    OTHER                      // 5
}
```

#### State Variables

```solidity
Counters.Counter private _orderIdCounter;              // Auto-increment order IDs
Counters.Counter private _disputeIdCounter;            // Auto-increment dispute IDs
ProductListingContract public productListingContract;   // Reference to product contract
address public arbitrator;                             // Arbitrator/admin address
uint256 public autoReleaseDeadline = 14 days;         // Default 14 days

mapping(uint256 => Order) public orders;               // Order ID → Order struct
mapping(uint256 => Dispute) public disputes;           // Dispute ID → Dispute struct
mapping(address => uint256[]) public buyerOrders;      // Buyer → Order IDs
mapping(address => uint256[]) public sellerOrders;     // Seller → Order IDs
mapping(string => bool) public processedPaymentIds;    // External ID → Processed flag
```

#### Main Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `createOrder()` | External | Buyer initiates order |
| `fundEscrow()` | External (buyer) | Fund with ERC-20 tokens |
| `markShipped()` | External (seller) | Confirm shipment |
| `confirmDelivery()` | External (buyer) | Confirm receipt |
| `autoReleaseIfEligible()` | External | Auto-release after deadline |
| `releaseFundsToSeller()` | External | Manual release to seller |
| `refundBuyer()` | External | Refund to buyer |
| `openDispute()` | External | Open dispute |
| `resolveDispute()` | External (arbitrator) | Resolve dispute |
| `setArbitrator()` | External (owner) | Set arbitrator address |
| `setAutoReleaseDeadline()` | External (owner) | Set auto-release deadline |

#### Data Structures

```solidity
struct Order {
    uint256 orderId;
    address buyer;
    address seller;
    uint256 productId;
    uint256 amount;                  // Escrowed amount
    address paymentToken;            // Token address
    PaymentMethod paymentMethod;
    string externalPaymentId;        // For Paystack/Flutterwave
    OrderStatus status;
    uint256 createdAt;
    uint256 fundedAt;
    uint256 shippedAt;
    uint256 deliveredAt;
    string trackingNumber;
    uint256 autoReleaseDeadline;     // Unix timestamp
}

struct Dispute {
    uint256 disputeId;
    uint256 orderId;
    address initiator;               // Buyer or Seller
    DisputeReason reason;
    string description;              // IPFS hash
    uint256 createdAt;
    uint256 resolvedAt;
    address arbitratorAddress;       // Who resolved it
    uint256 buyerRelease;            // Funds to buyer
    uint256 sellerRelease;           // Funds to seller
}
```

#### Modifiers

```solidity
modifier onlyArbitrator()            // Restrict to arbitrator
modifier onlyBuyer(uint256 orderId)  // Restrict to order buyer
modifier onlySeller(uint256 orderId) // Restrict to order seller
modifier orderMustExist(uint256 orderId) // Check order exists
```

---

### 3. RatingContract

**Location**: `contracts/RatingContract.sol`  
**Lines of Code**: ~500  
**Solidity Version**: ^0.8.19

#### Key Features
- ✅ Buyer rating submission (1-5 stars)
- ✅ One rating per order enforcement
- ✅ Seller aggregate rating calculation
- ✅ Real-time aggregate updates
- ✅ Admin rating removal (fraud prevention)
- ✅ EscrowContract integration
- ✅ Pagination support
- ✅ Reentrancy protection

#### State Variables

```solidity
Counters.Counter private _ratingIdCounter;           // Auto-increment rating IDs
EscrowContract public escrowContract;                // Reference to escrow contract

mapping(uint256 => SellerRating) public ratings;     // Rating ID → Rating struct
mapping(address => uint256[]) public sellerRatingIds; // Seller → Rating IDs
mapping(address => SellerAggregateRating) public sellerAggregates; // Seller → Aggregate
mapping(uint256 => bool) public orderRated;          // Order ID → Rated flag
mapping(uint256 => address) public orderToBuyer;     // Order ID → Buyer address
```

#### Main Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `submitRating()` | External (buyer) | Submit rating for order |
| `removeRating()` | External (owner) | Remove fraudulent rating |
| `setEscrowContract()` | External (owner) | Set escrow contract |
| `getRating()` | View | Fetch rating by ID |
| `getSellerRatings()` | View | Paginated ratings for seller |
| `getSellerAggregateRating()` | View | Get seller average |
| `hasRatedOrder()` | View | Check if order rated |
| `getTotalRatings()` | View | Total ratings count |
| `getOrderRating()` | View | Get rating for specific order |

#### Data Structures

```solidity
struct SellerRating {
    uint256 ratingId;
    uint256 orderId;                 // Reference to order
    address buyer;
    address seller;
    uint8 score;                     // 1-5 stars
    string reviewHash;               // IPFS hash for review text
    uint256 timestamp;
}

struct SellerAggregateRating {
    address seller;
    uint256 totalRatings;
    uint256 totalScore;              // Sum of all scores
    uint8 averageScore;              // Cached average
    uint256 lastUpdated;
}
```

---

## Security Features

### All Contracts
- ✅ **Reentrancy Protection**: `ReentrancyGuard` on all external calls
- ✅ **Access Control**: Modifiers for role-based access
- ✅ **Input Validation**: All inputs checked with `require` statements
- ✅ **Safe Math**: Solidity 0.8.19 with built-in overflow protection
- ✅ **Event Logging**: Critical operations emit events

### EscrowContract (Token Handling)
- ✅ **SafeERC20**: Uses OpenZeppelin's SafeERC20 for transfers
- ✅ **Payment Idempotency**: `processedPaymentIds` mapping prevents duplicate funding
- ✅ **State Validation**: State machine validates transitions
- ✅ **Amount Verification**: Checks amounts match order totals

### RatingContract (Access Control)
- ✅ **Buyer-Only Submission**: Only order buyer can rate
- ✅ **Delivery Check**: Only rates completed/delivered orders
- ✅ **Duplicate Prevention**: Maps order → rated status
- ✅ **One Rating Per Order**: `orderRated` mapping enforces uniqueness

---

## Gas Optimization

### Efficient Data Structures
- ✅ Counters for auto-increment (no loop-based generation)
- ✅ Direct mappings for O(1) lookups
- ✅ Pagination to avoid loading entire arrays
- ✅ Indexed events for efficient filtering

### Smart Array Management
- ProductListingContract: Swap-and-pop removal for active products
- RatingContract: Efficient rating removal with swap-and-pop

---

## Integration Points

### ProductListingContract ← EscrowContract
```solidity
// EscrowContract calls:
productListingContract.reduceInventory(orderId, quantity);
productListingContract.restoreInventory(orderId, quantity);
```

### RatingContract ← EscrowContract
```solidity
// RatingContract fetches:
EscrowContract.Order memory order = escrowContract.getOrder(orderId);
// Validates buyer and order status
```

---

## Contract Interaction Sequence (Happy Path)

```
1. Seller creates listing (ProductListingContract.createListing)
   ↓
2. Buyer creates order (EscrowContract.createOrder)
   ↓
3. Buyer approves token & funds escrow (EscrowContract.fundEscrow)
   ├→ ProductListingContract.reduceInventory() called
   ↓
4. Seller marks shipped (EscrowContract.markShipped)
   ↓
5. Buyer confirms delivery (EscrowContract.confirmDelivery)
   ↓
6. Auto-release or manual release (EscrowContract.autoReleaseIfEligible)
   ├→ Token transferred to seller
   ↓
7. Buyer submits rating (RatingContract.submitRating)
   ├→ RatingContract.submitRating verifies order from EscrowContract
   ├→ Updates seller aggregate rating
   ↓
Complete ✓
```

---

## Deployment Architecture

### Contract Dependencies

```
ProductListingContract
    ↑
    │ (referenced in)
    │
EscrowContract(productListingAddress)
    ↑
    │ (referenced in)
    │
RatingContract(escrowContractAddress)
```

### Deployment Order (contracts/scripts/deploy.ts)

```typescript
1. Deploy ProductListingContract (no args)
2. Deploy EscrowContract(productListingAddress)
3. Deploy RatingContract(escrowContractAddress)

Environment Variables:
- NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
- NEXT_PUBLIC_RATING_CONTRACT_ADDRESS=0x...
- NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS=0x...
```

---

## Testing Coverage Recommendations

### ProductListingContract
- [x] Create listing (valid inputs, invalid inputs)
- [x] Update listing (seller only, non-existent product)
- [x] Deactivate listing (active→inactive, active products list)
- [x] Inventory operations (reduce, restore, bounds)
- [x] Pagination (empty, partial, full pages)

### EscrowContract
- [x] Order creation (valid, self-purchase, invalid seller)
- [x] Funding (valid amount, insufficient balance, duplicate payment)
- [x] Order lifecycle (state transitions, invalid transitions)
- [x] Shipping (valid, invalid state)
- [x] Delivery (valid, invalid state)
- [x] Disputes (open, resolve with split/refund/full)
- [x] Auto-release (deadline passed, not passed)
- [x] Fund release (manual, auto, arbitration)

### RatingContract
- [x] Rating submission (valid, invalid score, non-buyer, non-delivered)
- [x] Duplicate prevention (second rating fails)
- [x] Aggregate calculation (single rating, multiple ratings)
- [x] Rating removal (valid, invalid rating ID)
- [x] Pagination (empty, partial, full)

---

**All contracts are production-ready and fully documented.** 🚀
