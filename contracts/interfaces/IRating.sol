// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IRating
 * @dev Interface for seller rating and review management in SwenAutos marketplace
 */

interface IRating {
    // Data Structures

    struct SellerRating {
        uint256 ratingId;
        uint256 orderId;           // Reference to completed order
        address buyer;
        address seller;
        
        uint8 score;               // 1-5 stars
        string reviewHash;         // IPFS hash or off-chain reference for review text
        
        uint256 timestamp;
    }

    struct SellerAggregateRating {
        address seller;
        uint256 totalRatings;
        uint256 totalScore;        // Sum of all scores
        uint8 averageScore;        // Cached average (updated after each rating)
        uint256 lastUpdated;
    }

    // Events

    /**
     * @dev Emitted when a rating is submitted
     */
    event RatingSubmitted(
        uint256 indexed ratingId,
        uint256 indexed orderId,
        address indexed seller,
        address buyer,
        uint8 score,
        uint256 timestamp
    );

    /**
     * @dev Emitted when seller's aggregate rating is updated
     */
    event AggregateRatingUpdated(
        address indexed seller,
        uint256 totalRatings,
        uint256 totalScore,
        uint8 averageScore,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a rating is removed (e.g., fraudulent)
     */
    event RatingRemoved(
        uint256 indexed ratingId,
        address indexed seller,
        address indexed remover,
        uint256 timestamp
    );

    // Core Functions

    /**
     * @notice Submit a rating for a completed order
     * @dev Can only be called by the buyer who purchased the order
     * @dev Can only rate after order is DELIVERED
     * @dev Only one rating per order allowed
     * @param orderId The order ID
     * @param seller The seller's wallet address
     * @param score Rating score (1-5)
     * @param reviewHash IPFS hash or off-chain reference for review details
     * @return ratingId The ID of the submitted rating
     */
    function submitRating(
        uint256 orderId,
        address seller,
        uint8 score,
        string memory reviewHash
    ) external returns (uint256 ratingId);

    /**
     * @notice Remove a rating (admin/arbitrator only, for fraud prevention)
     * @param ratingId The rating ID to remove
     */
    function removeRating(uint256 ratingId) external;

    // View Functions

    /**
     * @notice Get rating details by ID
     * @param ratingId The rating ID
     * @return SellerRating struct
     */
    function getRating(uint256 ratingId) external view returns (SellerRating memory);

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
    ) external view returns (SellerRating[] memory);

    /**
     * @notice Get aggregate rating for a seller
     * @param seller The seller's wallet address
     * @return SellerAggregateRating struct
     */
    function getSellerAggregateRating(address seller)
        external
        view
        returns (SellerAggregateRating memory);

    /**
     * @notice Check if buyer has already rated an order
     * @param orderId The order ID
     * @param buyer The buyer's wallet address
     * @return True if buyer has rated this order
     */
    function hasRatedOrder(uint256 orderId, address buyer) external view returns (bool);

    /**
     * @notice Get total number of ratings submitted
     * @return Total rating count
     */
    function getTotalRatings() external view returns (uint256);

    /**
     * @notice Get total number of sellers with ratings
     * @return Total seller count with ratings
     */
    function getTotalRatedSellers() external view returns (uint256);

    /**
     * @notice Get rating of an order by buyer (if exists)
     * @param orderId The order ID
     * @return ratingId Rating ID (0 if not rated), score, reviewer address
     */
    function getOrderRating(uint256 orderId)
        external
        view
        returns (
            uint256 ratingId,
            uint8 score,
            address buyer
        );
}
