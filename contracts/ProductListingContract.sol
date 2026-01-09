// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ProductListingContract
 * @dev SwenAutos Product Listing Management
 * Allows sellers to create, update, and manage product listings
 */

contract ProductListingContract is Ownable, ReentrancyGuard {

    // State Variables
    uint256 private _productIdCounter;
    
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public sellerProducts;
    mapping(uint256 => bool) public productExists;
    
    mapping(address => bool) public isSeller;
    
    uint256[] public activeProductIds;
    mapping(uint256 => uint256) private activeProductIndex;

    // Data Structures
    struct Product {
        uint256 productId;
        address seller;
        string name;
        string description;
        string category;
        uint256 price;
        address priceToken;
        uint256 inventory;
        uint256 sold;
        string ipfsHash;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Events
    event ListingCreated(
        uint256 indexed productId,
        address indexed seller,
        string name,
        uint256 price,
        uint256 inventory,
        uint256 timestamp
    );

    event ListingUpdated(
        uint256 indexed productId,
        uint256 newPrice,
        uint256 newInventory,
        uint256 timestamp
    );

    event ListingDeactivated(
        uint256 indexed productId,
        address indexed seller,
        uint256 timestamp
    );

    event InventoryReduced(
        uint256 indexed productId,
        uint256 previousInventory,
        uint256 newInventory,
        uint256 timestamp
    );

    event InventoryRestored(
        uint256 indexed productId,
        uint256 previousInventory,
        uint256 newInventory,
        uint256 timestamp
    );

    modifier onlySeller() {
        require(isSeller[msg.sender], "Only registered sellers can call this function");
        _;
    }

    modifier onlySellerOfProduct(uint256 productId) {
        require(productExists[productId], "Product does not exist");
        require(products[productId].seller == msg.sender, "Only seller can modify this listing");
        _;
    }

    modifier productMustExist(uint256 productId) {
        require(productExists[productId], "Product does not exist");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
           _productIdCounter = 1; // Start from 1
    }

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
    ) external onlySeller nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "Product name required");
        require(price > 0, "Price must be greater than 0");
    // initialInventory may be zero (out-of-stock listing)
    // Allow priceToken to be address(0) to indicate native/native-ETH payments

        uint256 productId = _productIdCounter;
        _productIdCounter++;

        Product memory newProduct = Product({
            productId: productId,
            seller: msg.sender,
            name: name,
            description: description,
            category: category,
            price: price,
            priceToken: priceToken,
            inventory: initialInventory,
            sold: 0,
            ipfsHash: ipfsHash,
            isActive: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        products[productId] = newProduct;
        productExists[productId] = true;
        sellerProducts[msg.sender].push(productId);
        
        // Add to active products list
        activeProductIndex[productId] = activeProductIds.length;
        activeProductIds.push(productId);

        emit ListingCreated(
            productId,
            msg.sender,
            name,
            price,
            initialInventory,
            block.timestamp
        );

        return productId;
    }

    /**
     * @notice Register current address as a seller
     */
    function registerAsSeller() external {
        isSeller[msg.sender] = true;
    }

    /**
     * @notice Admin approves a seller
     * @param seller Address to approve
     */
    function approveSeller(address seller) external onlyOwner {
        isSeller[seller] = true;
    }

    /**
     * @notice Admin revokes a seller
     * @param seller Address to revoke
     */
    function revokeSeller(address seller) external onlyOwner {
        isSeller[seller] = false;
    }

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
        string memory category,
        uint256 price,
        address priceToken,
        uint256 inventory,
        string memory ipfsHash
    ) external onlySellerOfProduct(productId) nonReentrant {
        require(bytes(name).length > 0, "Product name required");
        require(price > 0, "Price must be greater than 0");
        require(inventory >= 0, "Inventory must be >= 0");

        Product storage product = products[productId];
    product.name = name;
    product.description = description;
    product.category = category;
    product.price = price;
    product.priceToken = priceToken;
    product.inventory = inventory;
        product.ipfsHash = ipfsHash;
        product.updatedAt = block.timestamp;

        emit ListingUpdated(productId, price, inventory, block.timestamp);
    }

    /**
     * @notice Deactivate a product listing
     * @param productId The product ID to deactivate
     */
    function deactivateListing(uint256 productId) external onlySellerOfProduct(productId) nonReentrant {
        Product storage product = products[productId];
        require(product.isActive, "Listing is already inactive");

        product.isActive = false;
        product.updatedAt = block.timestamp;

        // Remove from active products list
        uint256 index = activeProductIndex[productId];
        uint256 lastProductId = activeProductIds[activeProductIds.length - 1];
        activeProductIds[index] = lastProductId;
        activeProductIndex[lastProductId] = index;
        activeProductIds.pop();
        delete activeProductIndex[productId];

        emit ListingDeactivated(productId, msg.sender, block.timestamp);
    }

    /**
     * @notice Reduce inventory (called by escrow contract on successful order)
     * @param productId The product ID
     * @param quantity The quantity to reduce
     */
    function reduceInventory(uint256 productId, uint256 quantity)
        external
        productMustExist(productId)
        nonReentrant
    {
        Product storage product = products[productId];
        require(quantity > 0, "Quantity must be greater than 0");
        require(product.inventory >= quantity, "Insufficient inventory");
        require(product.isActive, "Product is not active");

        uint256 previousInventory = product.inventory;
        product.inventory -= quantity;
        product.sold += quantity;
        product.updatedAt = block.timestamp;

        emit InventoryReduced(productId, previousInventory, product.inventory, block.timestamp);
    }

    /**
     * @notice Restore inventory (called on order cancellation/refund)
     * @param productId The product ID
     * @param quantity The quantity to restore
     */
    function restoreInventory(uint256 productId, uint256 quantity)
        external
        productMustExist(productId)
        nonReentrant
    {
        Product storage product = products[productId];
        require(quantity > 0, "Quantity must be greater than 0");
        require(product.sold >= quantity, "Cannot restore more than sold");

        uint256 previousInventory = product.inventory;
        product.inventory += quantity;
        product.sold -= quantity;
        product.updatedAt = block.timestamp;

        emit InventoryRestored(productId, previousInventory, product.inventory, block.timestamp);
    }

    // View Functions

    /**
     * @notice Get product details by ID
     * @param productId The product ID
     * @return Product struct
     */
    function getProduct(uint256 productId)
        external
        view
        productMustExist(productId)
        returns (Product memory)
    {
        return products[productId];
    }

    /**
     * @notice Get all active products with pagination
     * @param offset Starting index
     * @param limit Number of results
     * @return Array of Product structs
     */
    function getAllActiveProducts(uint256 offset, uint256 limit)
        external
        view
        returns (Product[] memory)
    {
        require(offset < activeProductIds.length || activeProductIds.length == 0, "Offset out of bounds");
        require(limit > 0, "Limit must be greater than 0");

        uint256 end = offset + limit;
        if (end > activeProductIds.length) {
            end = activeProductIds.length;
        }

        uint256 resultSize = end - offset;
        Product[] memory result = new Product[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = products[activeProductIds[offset + i]];
        }

        return result;
    }

    /**
     * @notice Get all products from a seller
     * @param seller The seller's wallet address
     * @return Array of product IDs
     */
    function getSellerProducts(address seller)
        external
        view
        returns (uint256[] memory)
    {
        return sellerProducts[seller];
    }

    /**
     * @notice Get total number of products
     * @return Total product count
     */
    function getTotalProducts() external view returns (uint256) {
        return _productIdCounter - 1;
    }

    /**
     * @notice Get total number of active products
     * @return Total active product count
     */
    function getTotalActiveProducts() external view returns (uint256) {
        return activeProductIds.length;
    }

    /**
     * @notice Check if product is active and has inventory
     * @param productId The product ID
     * @return True if product is available
     */
    function isProductAvailable(uint256 productId, uint256 quantity) external view returns (bool) {
        if (!productExists[productId]) return false;
        Product memory product = products[productId];
        return product.isActive && product.inventory >= quantity;
    }

    /**
     * @notice Get all active product IDs with pagination
     * @param offset Starting index
     * @param limit Number of results
     * @return Array of product IDs
     */
    function getActiveProductIds(uint256 offset, uint256 limit)
        external
        view
        returns (uint256[] memory)
    {
        require(offset < activeProductIds.length || activeProductIds.length == 0, "Offset out of bounds");
        require(limit > 0, "Limit must be greater than 0");

        uint256 end = offset + limit;
        if (end > activeProductIds.length) {
            end = activeProductIds.length;
        }

        uint256 resultSize = end - offset;
        uint256[] memory result = new uint256[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = activeProductIds[offset + i];
        }

        return result;
    }
}

// Backwards-compatible alias for tests and external deployments
contract SwenAutosProductListing is ProductListingContract {}
