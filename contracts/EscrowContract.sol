// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
// Counters removed; using simple uint256 counters
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ProductListingContract.sol";

/**
 * @title EscrowContract
 * @dev SwenAutos Escrow & Order Management
 * Manages order lifecycle, escrow funding, shipment tracking, and dispute resolution
 */

contract EscrowContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20;

    // Enums
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

    // State Variables
    uint256 private _orderIdCounter;
    uint256 private _disputeIdCounter;

    ProductListingContract public productListingContract;
    address public arbitrator;
    uint256 public autoReleaseDeadline = 14 days;

    // Mappings
    mapping(uint256 => Order) public orders;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public buyerOrders;
    mapping(address => uint256[]) public sellerOrders;
    mapping(string => bool) public processedPaymentIds;

    // Data Structures
    struct Order {
        uint256 orderId;
        address buyer;
        address seller;
        uint256 productId;
        uint256 amount;
        address paymentToken;
        PaymentMethod paymentMethod;
        string externalPaymentId;
        OrderStatus status;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 shippedAt;
        uint256 deliveredAt;
        string trackingNumber;
        uint256 autoReleaseDeadline;
    }

    struct Dispute {
        uint256 disputeId;
        uint256 orderId;
        address initiator;
        DisputeReason reason;
        string description;
        uint256 createdAt;
        uint256 resolvedAt;
        address arbitratorAddress;
        uint256 buyerRelease;
        uint256 sellerRelease;
    }

    // Events
    event OrderCreated(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 productId,
        uint256 amount,
        PaymentMethod paymentMethod,
        uint256 timestamp
    );

    event OrderFunded(
        uint256 indexed orderId,
        uint256 amount,
        address indexed paymentToken,
        uint256 timestamp
    );

    event OrderShipped(
        uint256 indexed orderId,
        address indexed seller,
        string trackingNumber,
        uint256 timestamp
    );

    event OrderDeliveryConfirmed(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 timestamp
    );

    event FundsReleasedToSeller(
        uint256 indexed orderId,
        address indexed seller,
        uint256 amount,
        uint256 timestamp
    );

    event RefundIssuedToBuyer(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    event OrderAutoReleased(uint256 indexed orderId, uint256 amount, uint256 timestamp);

    event DisputeOpened(
        uint256 indexed disputeId,
        uint256 indexed orderId,
        address indexed initiator,
        DisputeReason reason,
        uint256 timestamp
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        address indexed arbitratorAddress,
        uint256 buyerRelease,
        uint256 sellerRelease,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator can call this function");
        _;
    }

    modifier onlyBuyer(uint256 orderId) {
        require(orders[orderId].buyer == msg.sender, "Only buyer can call this function");
        _;
    }

    modifier onlySeller(uint256 orderId) {
        require(orders[orderId].seller == msg.sender, "Only seller can call this function");
        _;
    }

    modifier orderMustExist(uint256 orderId) {
        require(orders[orderId].orderId != 0, "Order does not exist");
        _;
    }

    // Constructor
    constructor(address productListingAddress) Ownable(msg.sender) {
        require(productListingAddress != address(0), "Invalid ProductListing address");
        productListingContract = ProductListingContract(productListingAddress);
        arbitrator = msg.sender;
    _orderIdCounter = 1; // Start from 1
    _disputeIdCounter = 1;
    }

    // Admin Functions

    /**
     * @notice Set the arbitrator address
     * @param newArbitrator The new arbitrator address
     */
    function setArbitrator(address newArbitrator) external onlyOwner {
        require(newArbitrator != address(0), "Invalid arbitrator address");
        arbitrator = newArbitrator;
    }

    /**
     * @notice Set the auto-release deadline
     * @param deadline The deadline in seconds
     */
    function setAutoReleaseDeadline(uint256 deadline) external onlyOwner {
        require(deadline > 0, "Deadline must be greater than 0");
        autoReleaseDeadline = deadline;
    }

    // Core Functions

    /**
     * @notice Create a new order
     * @param productId Product ID from ProductListingContract
     * @param seller Seller's wallet address
     * @param amount Amount to be escrowed
     * @param paymentToken Token address (e.g., CAMP)
     * @param paymentMethod Payment method enum
     * @param externalPaymentId Reference to external payment
     * @return orderId The ID of the created order
     */
    function createOrder(
        uint256 productId,
        address seller,
        uint256 amount,
        address paymentToken,
        PaymentMethod paymentMethod,
        string memory externalPaymentId
    ) external nonReentrant returns (uint256) {
        // Fetch product details directly from the listing contract
        (
            uint256 listedId,
            address listedSeller,
            ,
            ,
            ,
            uint256 listedPrice,
            address listedToken,
            uint256 listedInventory,
            ,
            ,
            bool listedIsActive,
            ,
        ) = productListingContract.products(productId);
        
        // Validation Logic
        require(listedId == productId, "Product ID mismatch");
        require(listedSeller == seller, "Seller mismatch");
        require(listedSeller != msg.sender, "Cannot purchase from yourself");
        require(listedPrice == amount, "Incorrect price sent");
        require(listedToken == paymentToken, "Incorrect payment token");
        require(listedIsActive, "Product is not active");
        require(listedInventory > 0, "Product is out of stock");

        require(seller != address(0), "Invalid seller address");
        require(amount > 0, "Amount must be greater than 0");
        require(paymentToken != address(0), "Invalid payment token address");

    uint256 orderId = _orderIdCounter;
    _orderIdCounter++;

        Order memory newOrder = Order({
            orderId: orderId,
            buyer: msg.sender,
            seller: seller,
            productId: productId,
            amount: amount,
            paymentToken: paymentToken,
            paymentMethod: paymentMethod,
            externalPaymentId: externalPaymentId,
            status: OrderStatus.PENDING_FUND,
            createdAt: block.timestamp,
            fundedAt: 0,
            shippedAt: 0,
            deliveredAt: 0,
            trackingNumber: "",
            autoReleaseDeadline: block.timestamp + autoReleaseDeadline
        });

        orders[orderId] = newOrder;
        buyerOrders[msg.sender].push(orderId);
        sellerOrders[seller].push(orderId);

        emit OrderCreated(
            orderId,
            msg.sender,
            seller,
            productId,
            amount,
            paymentMethod,
            block.timestamp
        );

        return orderId;
    }

    /**
     * @notice Fund escrow with ERC-20 tokens (requires prior approval)
     * @param orderId The order ID to fund
     * @param amount Amount to transfer
     */
    function fundEscrow(uint256 orderId, uint256 amount)
        external
        onlyBuyer(orderId)
        orderMustExist(orderId)
        nonReentrant
    {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.PENDING_FUND, "Order is not in PENDING_FUND status");
        require(amount == order.amount, "Amount does not match order amount");
        require(!processedPaymentIds[order.externalPaymentId], "Payment already processed");

        // Transfer tokens from buyer to contract
        IERC20(order.paymentToken).safeTransferFrom(msg.sender, address(this), amount);

        order.status = OrderStatus.FUNDED;
        order.fundedAt = block.timestamp;
        processedPaymentIds[order.externalPaymentId] = true;

        // Reduce inventory in ProductListingContract
        productListingContract.reduceInventory(order.productId, 1);

        emit OrderFunded(orderId, amount, order.paymentToken, block.timestamp);
    }

    /**
     * @notice Seller marks order as shipped
     * @param orderId The order ID
     * @param trackingNumber Shipping tracking number
     */
    function markShipped(uint256 orderId, string memory trackingNumber)
        external
        onlySeller(orderId)
        orderMustExist(orderId)
        nonReentrant
    {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.FUNDED, "Order is not in FUNDED status");
        require(bytes(trackingNumber).length > 0, "Tracking number required");

        order.status = OrderStatus.SHIPPED;
        order.shippedAt = block.timestamp;
        order.trackingNumber = trackingNumber;

        emit OrderShipped(orderId, msg.sender, trackingNumber, block.timestamp);
    }

    /**
     * @notice Buyer confirms delivery
     * @param orderId The order ID
     */
    function confirmDelivery(uint256 orderId)
        external
        onlyBuyer(orderId)
        orderMustExist(orderId)
        nonReentrant
    {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.SHIPPED, "Order is not in SHIPPED status");

        order.status = OrderStatus.DELIVERED;
        order.deliveredAt = block.timestamp;

        emit OrderDeliveryConfirmed(orderId, msg.sender, block.timestamp);
    }

    /**
     * @notice Auto-release funds if delivery confirmed and no dispute
     * @param orderId The order ID
     */
    function autoReleaseIfEligible(uint256 orderId)
        external
        nonReentrant
        orderMustExist(orderId)
    {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.DELIVERED, "Order is not in DELIVERED status");
        require(block.timestamp >= order.autoReleaseDeadline, "Auto-release deadline not reached");

        order.status = OrderStatus.COMPLETED;
        IERC20(order.paymentToken).safeTransfer(order.seller, order.amount);

        emit OrderAutoReleased(orderId, order.amount, block.timestamp);
        emit FundsReleasedToSeller(orderId, order.seller, order.amount, block.timestamp);
    }

    /**
     * @notice Release funds to seller (after delivery or dispute resolution)
     * @param orderId The order ID
     * @param amount Amount to release
     */
    function releaseFundsToSeller(uint256 orderId, uint256 amount)
        external
        nonReentrant
        orderMustExist(orderId)
    {
        Order storage order = orders[orderId];
        require(
            order.status == OrderStatus.DELIVERED || order.status == OrderStatus.COMPLETED,
            "Order is not eligible for release"
        );
        require(amount > 0 && amount <= order.amount, "Invalid amount");
        require(msg.sender == arbitrator || msg.sender == order.buyer, "Not authorized");

        if (order.status == OrderStatus.DELIVERED) {
            order.status = OrderStatus.COMPLETED;
        }

        IERC20(order.paymentToken).safeTransfer(order.seller, amount);

        emit FundsReleasedToSeller(orderId, order.seller, amount, block.timestamp);
    }

    /**
     * @notice Refund funds to buyer (on cancellation or dispute resolution)
     * @param orderId The order ID
     * @param amount Amount to refund
     */
    function refundBuyer(uint256 orderId, uint256 amount)
        external
        nonReentrant
        orderMustExist(orderId)
    {
        Order storage order = orders[orderId];
        require(amount > 0 && amount <= order.amount, "Invalid amount");
        require(msg.sender == arbitrator || msg.sender == order.seller, "Not authorized");

        // Restore inventory if order was funded
        if (order.status == OrderStatus.FUNDED || order.status == OrderStatus.SHIPPED) {
            productListingContract.restoreInventory(order.productId, 1);
        }

        order.status = OrderStatus.REFUNDED;
        IERC20(order.paymentToken).safeTransfer(order.buyer, amount);

        emit RefundIssuedToBuyer(orderId, order.buyer, amount, block.timestamp);
    }

    /**
     * @notice Open a dispute for an order
     * @param orderId The order ID
     * @param reason Reason for dispute
     * @param description IPFS hash or off-chain reference
     * @return disputeId The ID of the created dispute
     */
    function openDispute(
        uint256 orderId,
        DisputeReason reason,
        string memory description
    ) external nonReentrant orderMustExist(orderId) returns (uint256) {
        Order storage order = orders[orderId];
        require(
            msg.sender == order.buyer || msg.sender == order.seller,
            "Only buyer or seller can open dispute"
        );
        require(order.status != OrderStatus.COMPLETED && order.status != OrderStatus.REFUNDED, "Cannot dispute completed order");
        require(order.status != OrderStatus.DISPUTED, "Order already in dispute");

    uint256 disputeId = _disputeIdCounter;
    _disputeIdCounter++;

        Dispute memory newDispute = Dispute({
            disputeId: disputeId,
            orderId: orderId,
            initiator: msg.sender,
            reason: reason,
            description: description,
            createdAt: block.timestamp,
            resolvedAt: 0,
            arbitratorAddress: address(0),
            buyerRelease: 0,
            sellerRelease: 0
        });

        disputes[disputeId] = newDispute;
        order.status = OrderStatus.DISPUTED;

        emit DisputeOpened(disputeId, orderId, msg.sender, reason, block.timestamp);

        return disputeId;
    }

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
    ) external onlyArbitrator nonReentrant {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.disputeId != 0, "Dispute does not exist");
        require(dispute.resolvedAt == 0, "Dispute already resolved");

        Order storage order = orders[dispute.orderId];
        require(buyerAmount + sellerAmount == order.amount, "Amounts do not match order total");

        dispute.resolvedAt = block.timestamp;
        dispute.arbitratorAddress = msg.sender;
        dispute.buyerRelease = buyerAmount;
        dispute.sellerRelease = sellerAmount;

        order.status = OrderStatus.COMPLETED;

        if (buyerAmount > 0) {
            IERC20(order.paymentToken).safeTransfer(order.buyer, buyerAmount);
        }

        if (sellerAmount > 0) {
            IERC20(order.paymentToken).safeTransfer(order.seller, sellerAmount);
        }

        emit DisputeResolved(disputeId, msg.sender, buyerAmount, sellerAmount, block.timestamp);
    }

    // View Functions

    /**
     * @notice Get order details by ID
     * @param orderId The order ID
     * @return Order struct
     */
    function getOrder(uint256 orderId)
        external
        view
        orderMustExist(orderId)
        returns (Order memory)
    {
        return orders[orderId];
    }

    /**
     * @notice Get all orders for a buyer
     * @param buyer The buyer's wallet address
     * @return Array of order IDs
     */
    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return buyerOrders[buyer];
    }

    /**
     * @notice Get all orders for a seller
     * @param seller The seller's wallet address
     * @return Array of order IDs
     */
    function getSellerOrders(address seller) external view returns (uint256[] memory) {
        return sellerOrders[seller];
    }

    /**
     * @notice Get dispute details by ID
     * @param disputeId The dispute ID
     * @return Dispute struct
     */
    function getDispute(uint256 disputeId) external view returns (Dispute memory) {
        return disputes[disputeId];
    }

    /**
     * @notice Get total number of orders
     * @return Total order count
     */
    function getTotalOrders() external view returns (uint256) {
    return _orderIdCounter - 1;
    }

    /**
     * @notice Get total number of disputes
     * @return Total dispute count
     */
    function getTotalDisputes() external view returns (uint256) {
    return _disputeIdCounter - 1;
    }

    /**
     * @notice Check if buyer can confirm delivery
     * @param orderId The order ID
     * @return True if buyer can confirm
     */
    function canBuyerConfirmDelivery(uint256 orderId) external view returns (bool) {
        Order memory order = orders[orderId];
        return order.status == OrderStatus.SHIPPED && order.buyer == msg.sender;
    }

    /**
     * @notice Check if order is eligible for auto-release
     * @param orderId The order ID
     * @return True if eligible
     */
    function isEligibleForAutoRelease(uint256 orderId) external view returns (bool) {
        Order memory order = orders[orderId];
        return
            order.status == OrderStatus.DELIVERED &&
            block.timestamp >= order.autoReleaseDeadline;
    }
}

// Backwards-compatible alias expected by tests
contract SwenAutosEscrow is EscrowContract {
    constructor(address productListingAddress) EscrowContract(productListingAddress) {}
}
