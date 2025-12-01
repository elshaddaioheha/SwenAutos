// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
// Counters removed; using uint256 counters
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./EscrowContract.sol";

/**
 * @title RatingContract
 * @dev SwenAutos Seller Rating & Review Management
 * Manages seller ratings, reviews, and aggregation
 */

contract RatingContract is Ownable, ReentrancyGuard {

    // State Variables
    uint256 private _ratingIdCounter;

    EscrowContract public escrowContract;

    // Mappings
    mapping(uint256 => SellerRating) public ratings;
    mapping(address => uint256[]) public sellerRatingIds;
    mapping(address => SellerAggregateRating) public sellerAggregates;
    mapping(uint256 => bool) public orderRated;
    mapping(uint256 => address) public orderToBuyer;

    // Data Structures
    struct SellerRating {
        uint256 ratingId;
        uint256 orderId;
        address buyer;
        address seller;
        uint8 score;              // 1-5
        string reviewHash;        // IPFS hash or off-chain reference
        uint256 timestamp;
    }

    struct SellerAggregateRating {
        address seller;
        uint256 totalRatings;
        uint256 totalScore;
        uint8 averageScore;
        uint256 lastUpdated;
    }

    // Events
    event RatingSubmitted(
        uint256 indexed ratingId,
        uint256 indexed orderId,
        address indexed seller,
        address buyer,
        uint8 score,
        uint256 timestamp
    );

    event AggregateRatingUpdated(
        address indexed seller,
        uint256 totalRatings,
        uint256 totalScore,
        uint8 averageScore,
        uint256 timestamp
    );

    event RatingRemoved(
        uint256 indexed ratingId,
        address indexed seller,
        address indexed remover,
        uint256 timestamp
    );

    // Modifiers
    modifier escrowContractMustExist() {
        require(address(escrowContract) != address(0), "Escrow contract not set");
        _;
    }

    // Constructor
    constructor(address escrowContractAddress) Ownable(msg.sender) {
        require(escrowContractAddress != address(0), "Invalid Escrow contract address");
        escrowContract = EscrowContract(escrowContractAddress);
    _ratingIdCounter = 1; // Start from 1
    }

    // Admin Functions

    /**
     * @notice Set the Escrow contract address
     * @param escrowContractAddress The new Escrow contract address
     */
    function setEscrowContract(address escrowContractAddress) external onlyOwner {
        require(escrowContractAddress != address(0), "Invalid Escrow contract address");
        escrowContract = EscrowContract(escrowContractAddress);
    }

    // Core Functions

    /**
     * @notice Submit a rating for a completed order
     * @dev Can only be called by the buyer who purchased the order
     * @param orderId The order ID
     * @param seller The seller's wallet address
     * @param score Rating score (1-5)
     * @param reviewHash IPFS hash or off-chain reference for review text
     * @return ratingId The ID of the submitted rating
     */
    function submitRating(
        uint256 orderId,
        address seller,
        uint8 score,
        string memory reviewHash
    ) external nonReentrant escrowContractMustExist returns (uint256) {
        require(seller != address(0), "Invalid seller address");
        require(score >= 1 && score <= 5, "Score must be between 1 and 5");
        require(!orderRated[orderId], "Order already rated");

        // Fetch order from EscrowContract
        EscrowContract.Order memory order = escrowContract.getOrder(orderId);
        
        require(order.buyer == msg.sender, "Only buyer can rate this order");
        require(
            order.status == EscrowContract.OrderStatus.COMPLETED ||
            order.status == EscrowContract.OrderStatus.DELIVERED,
            "Order must be completed or delivered"
        );
        require(order.seller == seller, "Seller address mismatch");

    uint256 ratingId = _ratingIdCounter;
    _ratingIdCounter++;

        SellerRating memory newRating = SellerRating({
            ratingId: ratingId,
            orderId: orderId,
            buyer: msg.sender,
            seller: seller,
            score: score,
            reviewHash: reviewHash,
            timestamp: block.timestamp
        });

        ratings[ratingId] = newRating;
        orderRated[orderId] = true;
        orderToBuyer[orderId] = msg.sender;
        sellerRatingIds[seller].push(ratingId);

        // Update seller aggregate rating
        _updateAggregateRating(seller, score, true);

        emit RatingSubmitted(ratingId, orderId, seller, msg.sender, score, block.timestamp);

        return ratingId;
    }

    /**
     * @notice Remove a rating (admin/arbitrator only, for fraud prevention)
     * @param ratingId The rating ID to remove
     */
    function removeRating(uint256 ratingId) external onlyOwner nonReentrant {
        SellerRating memory rating = ratings[ratingId];
        require(rating.ratingId != 0, "Rating does not exist");

        address seller = rating.seller;
        uint8 score = rating.score;

        // Update aggregate rating (subtract this rating)
        _updateAggregateRating(seller, score, false);

        // Mark order as not rated
        orderRated[rating.orderId] = false;

        // Remove from seller's rating list
        uint256[] storage ratingIds = sellerRatingIds[seller];
        for (uint256 i = 0; i < ratingIds.length; i++) {
            if (ratingIds[i] == ratingId) {
                // Remove by swapping with last element
                ratingIds[i] = ratingIds[ratingIds.length - 1];
                ratingIds.pop();
                break;
            }
        }

        delete ratings[ratingId];

        emit RatingRemoved(ratingId, seller, msg.sender, block.timestamp);
    }

    // Internal Functions

    /**
     * @notice Update seller's aggregate rating
     * @param seller The seller's wallet address
     * @param score The rating score being added/removed
     * @param isAdding True if adding, false if removing
     */
    function _updateAggregateRating(
        address seller,
        uint8 score,
        bool isAdding
    ) internal {
        SellerAggregateRating storage aggregate = sellerAggregates[seller];

        if (isAdding) {
            aggregate.totalRatings += 1;
            aggregate.totalScore += score;
        } else {
            if (aggregate.totalRatings > 0) {
                aggregate.totalRatings -= 1;
                aggregate.totalScore -= score;
            }
        }

        // Calculate average (round down / floor)
        if (aggregate.totalRatings > 0) {
            aggregate.averageScore = uint8(aggregate.totalScore / aggregate.totalRatings);
        } else {
            aggregate.averageScore = 0;
        }

        aggregate.seller = seller;
        aggregate.lastUpdated = block.timestamp;

        emit AggregateRatingUpdated(
            seller,
            aggregate.totalRatings,
            aggregate.totalScore,
            aggregate.averageScore,
            block.timestamp
        );
    }

    // View Functions

    /**
     * @notice Get rating details by ID
     * @param ratingId The rating ID
     * @return SellerRating struct
     */
    function getRating(uint256 ratingId) external view returns (SellerRating memory) {
        require(ratings[ratingId].ratingId != 0, "Rating does not exist");
        return ratings[ratingId];
    }

    /**
     * @notice Get all ratings for a seller with pagination
     * @param seller The seller's wallet address
     * @param offset Starting index
     * @param limit Number of results
     * @return Array of SellerRating structs
     */
    function getSellerRatings(
        address seller,
        uint256 offset,
        uint256 limit
    ) external view returns (SellerRating[] memory) {
        uint256[] memory ratingIds = sellerRatingIds[seller];
        require(offset < ratingIds.length || ratingIds.length == 0, "Offset out of bounds");
        require(limit > 0, "Limit must be greater than 0");

        uint256 end = offset + limit;
        if (end > ratingIds.length) {
            end = ratingIds.length;
        }

        uint256 resultSize = end - offset;
        SellerRating[] memory result = new SellerRating[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = ratings[ratingIds[offset + i]];
        }

        return result;
    }

    /**
     * @notice Get aggregate rating for a seller
     * @param seller The seller's wallet address
     * @return SellerAggregateRating struct
     */
    function getSellerAggregateRating(address seller)
        external
        view
        returns (SellerAggregateRating memory)
    {
        return sellerAggregates[seller];
    }

    /**
     * @notice Check if buyer has already rated an order
     * @param orderId The order ID
     * @param buyer The buyer's wallet address
     * @return True if buyer has rated this order
     */
    function hasRatedOrder(uint256 orderId, address buyer) external view returns (bool) {
        if (!orderRated[orderId]) return false;
        return orderToBuyer[orderId] == buyer;
    }

    /**
     * @notice Get total number of ratings submitted
     * @return totalRatings Total rating count
     */
    function getTotalRatings() external view returns (uint256) {
        return _ratingIdCounter - 1;
    }

    /**
     * @notice Get total number of sellers with ratings
     * @return totalRatedSellers Count of sellers with at least one rating
     */
    function getTotalRatedSellers() external view returns (uint256) {
        // Note: This is a helper; full implementation would require additional tracking
        return _ratingIdCounter - 1; // Approximate for now
    }

    /**
     * @notice Get rating of an order by buyer (if exists)
     * @param orderId The order ID
    * @return ratingId The rating id (0 if none)
    * @return score The rating score (1-5)
    * @return buyer The buyer address (0x0 if not rated)
     */
    function getOrderRating(uint256 orderId)
        external
        view
        returns (
            uint256 ratingId,
            uint8 score,
            address buyer
        )
    {
        if (!orderRated[orderId]) {
            return (0, 0, address(0));
        }

        address ratingBuyer = orderToBuyer[orderId];
        // Find rating for this order
    uint256[] memory allRatingIds = new uint256[](_ratingIdCounter);
    for (uint256 i = 1; i < _ratingIdCounter; i++) {
            if (ratings[i].orderId == orderId && ratings[i].buyer == ratingBuyer) {
                return (ratings[i].ratingId, ratings[i].score, ratingBuyer);
            }
        }

        return (0, 0, address(0));
    }

    /**
     * @notice Get all rating IDs for a seller
     * @param seller The seller's wallet address
     * @return Array of rating IDs
     */
    function getSellerRatingIds(address seller) external view returns (uint256[] memory) {
        return sellerRatingIds[seller];
    }
}

// Backwards-compatible alias expected by tests
contract SwenAutosRating is RatingContract {
    constructor(address escrowContractAddress) RatingContract(escrowContractAddress) {}
}
