// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IProductListing
 * @dev Interface for product listing management in SwenAutos marketplace
 */

interface IProductListing {
    // Data Structures
    
    struct Product {
        uint256 productId;          // Unique identifier
        address seller;             // Seller's wallet address
        string name;                // Product name
        string description;         // Product description
        string category;            // Category (e.g., "Engine", "Wheels")
        uint256 price;              // Price in wei (18 decimals)
        address priceToken;         // Token address (e.g., CAMP)
        uint256 inventory;          // Available quantity
        uint256 sold;               // Total units sold
        string ipfsHash;            // IPFS hash for extended metadata/images
        bool isActive;              // Listing active status
        uint256 createdAt;          // Creation timestamp
        uint256 updatedAt;          // Last update timestamp
    }

    // Events

    /**
     * @dev Emitted when a new listing is created
     */
    event ListingCreated(
        uint256 indexed productId,
        address indexed seller,
        string name,
        uint256 price,
        uint256 inventory,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a listing is updated
     */
    event ListingUpdated(
        uint256 indexed productId,
        uint256 newPrice,
        uint256 newInventory,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a listing is deactivated
     */
    event ListingDeactivated(uint256 indexed productId, address indexed seller, uint256 timestamp);

    /**
     * @dev Emitted when inventory is reduced (e.g., after order)
     */
    event InventoryReduced(
        uint256 indexed productId,
        uint256 previousInventory,
        uint256 newInventory,
        uint256 timestamp
    );

    // Core Functions

    /**
     * @notice Create a new product listing
     * @param name Product name
     * @param description Product description
     * @param category Product category
     * @param price Price in wei
     * @param priceToken Token address for pricing
     * @param initialInventory Initial inventory quantity
     * @param ipfsHash Optional IPFS hash for extended metadata
     * @return productId The ID of the created product
     */
    function createListing(
        string memory name,
        string memory description,
        string memory category,
        uint256 price,
        address priceToken,
        uint256 initialInventory,
        string memory ipfsHash
    ) external returns (uint256 productId);

    /**
     * @notice Update an existing listing
     * @param productId The product ID to update
     * @param name Updated name
     * @param description Updated description
     * @param price Updated price
     * @param inventory Updated inventory
     * @param ipfsHash Updated IPFS hash
     */
    function updateListing(
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        uint256 inventory,
        string memory ipfsHash
    ) external;

    /**
     * @notice Deactivate a product listing
     * @param productId The product ID to deactivate
     */
    function deactivateListing(uint256 productId) external;

    /**
     * @notice Reduce inventory (called by escrow contract on successful order)
     * @param productId The product ID
     * @param quantity The quantity to reduce
     */
    function reduceInventory(uint256 productId, uint256 quantity) external;

    /**
     * @notice Restore inventory (called on order cancellation/refund)
     * @param productId The product ID
     * @param quantity The quantity to restore
     */
    function restoreInventory(uint256 productId, uint256 quantity) external;

    // View Functions

    /**
     * @notice Get product details by ID
     * @param productId The product ID
     * @return Product struct
     */
    function getProduct(uint256 productId) external view returns (Product memory);

    /**
     * @notice Get all active products with pagination
     * @param offset Starting index
     * @param limit Number of results
     * @return Array of Product structs
     */
    function getAllActiveProducts(uint256 offset, uint256 limit)
        external
        view
        returns (Product[] memory);

    /**
     * @notice Get all products from a seller
     * @param seller The seller's wallet address
     * @return Array of product IDs
     */
    function getSellerProducts(address seller) external view returns (uint256[] memory);

    /**
     * @notice Get total number of products
     * @return Total product count
     */
    function getTotalProducts() external view returns (uint256);

    /**
     * @notice Check if product is active and has inventory
     * @param productId The product ID
     * @return True if product is available
     */
    function isProductAvailable(uint256 productId) external view returns (bool);
}
