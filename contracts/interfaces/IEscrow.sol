// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IEscrow
 * @dev Interface for escrow management in SwenAutos marketplace
 */

interface IEscrow {
    // Enums

    enum OrderStatus {
        CREATED,           // 0: Order initiated
        PENDING_FUND,      // 1: Awaiting escrow funding
        FUNDED,            // 2: Escrow funded, awaiting shipment
        SHIPPED,           // 3: Seller confirmed shipment
        DELIVERED,         // 4: Buyer confirmed delivery
        DISPUTED,          // 5: Dispute raised
        COMPLETED,         // 6: Order completed successfully
        CANCELLED,         // 7: Order cancelled
        REFUNDED           // 8: Refund issued
    }

    enum PaymentMethod {
        CAMP_TOKEN,        // 0: Direct CAMP token transfer
        PAYSTACK,          // 1: Paystack off-chain payment
        FLUTTERWAVE        // 2: Flutterwave off-chain payment
    }

    enum DisputeReason {
        PRODUCT_NOT_RECEIVED,      // 0: Buyer claims item not received
        QUALITY_ISSUE,             // 1: Product quality below expectations
        WRONG_ITEM,                // 2: Wrong item received
        UNAUTHORIZED_TRANSACTION,  // 3: Unauthorized charge
        DAMAGED_IN_TRANSIT,        // 4: Item damaged during shipping
        OTHER                      // 5: Other reason
    }

    // Data Structures

    struct Order {
        uint256 orderId;
        address buyer;
        address seller;
        uint256 productId;
        
        uint256 amount;            // Amount in escrow
        address paymentToken;      // Token address
        PaymentMethod paymentMethod;
        string externalPaymentId;  // Payment provider reference
        
        OrderStatus status;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 shippedAt;
        uint256 deliveredAt;
        
        string trackingNumber;
        uint256 autoReleaseDeadline;  // Unix timestamp for auto-release
    }

    struct Dispute {
        uint256 disputeId;
        uint256 orderId;
        address initiator;
        DisputeReason reason;
        string description;        // IPFS hash or off-chain reference
        
        uint256 createdAt;
        uint256 resolvedAt;
        
        address arbitrator;
        uint256 buyerRelease;
        uint256 sellerRelease;
    }

    // Events

    /**
     * @dev Emitted when a new order is created
     */
    event OrderCreated(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 productId,
        uint256 amount,
        PaymentMethod paymentMethod,
        uint256 timestamp
    );

    /**
     * @dev Emitted when escrow is funded
     */
    event OrderFunded(
        uint256 indexed orderId,
        uint256 amount,
        address indexed paymentToken,
        uint256 timestamp
    );

    /**
     * @dev Emitted when seller confirms shipment
     */
    event OrderShipped(
        uint256 indexed orderId,
        address indexed seller,
        string trackingNumber,
        uint256 timestamp
    );

    /**
     * @dev Emitted when buyer confirms delivery
     */
    event OrderDeliveryConfirmed(uint256 indexed orderId, address indexed buyer, uint256 timestamp);

    /**
     * @dev Emitted when funds are released to seller
     */
    event FundsReleasedToSeller(
        uint256 indexed orderId,
        address indexed seller,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Emitted when refund is issued to buyer
     */
    event RefundIssuedToBuyer(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Emitted when order is auto-released
     */
    event OrderAutoReleased(uint256 indexed orderId, uint256 amount, uint256 timestamp);

    /**
     * @dev Emitted when a dispute is opened
     */
    event DisputeOpened(
        uint256 indexed disputeId,
        uint256 indexed orderId,
        address indexed initiator,
        DisputeReason reason,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a dispute is resolved
     */
    event DisputeResolved(
        uint256 indexed disputeId,
        address indexed arbitrator,
        uint256 buyerRelease,
        uint256 sellerRelease,
        uint256 timestamp
    );

    // Core Functions

    /**
     * @notice Create a new order
     * @param productId Product ID from ProductListingContract
     * @param seller Seller's wallet address
     * @param amount Amount to be escrowed
     * @param paymentToken Token address (e.g., CAMP)
     * @param paymentMethod Payment method enum
     * @param externalPaymentId Reference to external payment (Paystack/FW)
     * @return orderId The ID of the created order
     */
    function createOrder(
        uint256 productId,
        address seller,
        uint256 amount,
        address paymentToken,
        PaymentMethod paymentMethod,
        string memory externalPaymentId
    ) external returns (uint256 orderId);

    /**
     * @notice Fund escrow with CAMP tokens (requires prior token approval)
     * @param orderId The order ID to fund
     * @param amount Amount to transfer
     */
    function fundEscrow(uint256 orderId, uint256 amount) external;

    /**
     * @notice Fund escrow with native token (ETH/CAMP native)
     * @param orderId The order ID to fund
     */
    function fundEscrowNative(uint256 orderId) external payable;

    /**
     * @notice Seller marks order as shipped
     * @param orderId The order ID
     * @param trackingNumber Shipping tracking number or reference
     */
    function markShipped(uint256 orderId, string memory trackingNumber) external;

    /**
     * @notice Buyer confirms delivery
     * @param orderId The order ID
     */
    function confirmDelivery(uint256 orderId) external;

    /**
     * @notice Auto-release funds if delivery confirmed and no dispute
     * @param orderId The order ID
     */
    function autoReleaseIfEligible(uint256 orderId) external;

    /**
     * @notice Release funds to seller (after delivery or dispute resolution)
     * @param orderId The order ID
     * @param amount Amount to release
     */
    function releaseFundsToSeller(uint256 orderId, uint256 amount) external;

    /**
     * @notice Refund funds to buyer (on cancellation or dispute resolution)
     * @param orderId The order ID
     * @param amount Amount to refund
     */
    function refundBuyer(uint256 orderId, uint256 amount) external;

    /**
     * @notice Buyer or seller opens a dispute
     * @param orderId The order ID
     * @param reason Reason for dispute
     * @param description IPFS hash or off-chain reference for dispute details
     * @return disputeId The ID of the created dispute
     */
    function openDispute(
        uint256 orderId,
        DisputeReason reason,
        string memory description
    ) external returns (uint256 disputeId);

    /**
     * @notice Arbitrator resolves a dispute
     * @param disputeId The dispute ID
     * @param buyerAmount Amount to release to buyer
     * @param sellerAmount Amount to release to seller
     */
    function resolveDispute(
        uint256 disputeId,
        uint256 buyerAmount,
        uint256 sellerAmount
    ) external;

    // View Functions

    /**
     * @notice Get order details by ID
     * @param orderId The order ID
     * @return Order struct
     */
    function getOrder(uint256 orderId) external view returns (Order memory);

    /**
     * @notice Get all orders for a buyer
     * @param buyer The buyer's wallet address
     * @return Array of order IDs
     */
    function getBuyerOrders(address buyer) external view returns (uint256[] memory);

    /**
     * @notice Get all orders for a seller
     * @param seller The seller's wallet address
     * @return Array of order IDs
     */
    function getSellerOrders(address seller) external view returns (uint256[] memory);

    /**
     * @notice Get dispute details by ID
     * @param disputeId The dispute ID
     * @return Dispute struct
     */
    function getDispute(uint256 disputeId) external view returns (Dispute memory);

    /**
     * @notice Get total number of orders
     * @return Total order count
     */
    function getTotalOrders() external view returns (uint256);

    /**
     * @notice Get total number of disputes
     * @return Total dispute count
     */
    function getTotalDisputes() external view returns (uint256);

    /**
     * @notice Check if buyer can initiate delivery confirmation
     * @param orderId The order ID
     * @return True if buyer can confirm
     */
    function canBuyerConfirmDelivery(uint256 orderId) external view returns (bool);

    /**
     * @notice Check if order is eligible for auto-release
     * @param orderId The order ID
     * @return True if eligible
     */
    function isEligibleForAutoRelease(uint256 orderId) external view returns (bool);
}
