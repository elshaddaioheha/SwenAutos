import { expect } from "chai";
import hre from "hardhat";

// @ts-ignore
const { ethers } = hre;

describe("ProductListingContract", function () {
  let productListing: any;
  let seller: any;
  let buyer: any;
  let owner: any;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const ProductListing = await ethers.getContractFactory("SwenAutosProductListing");
    productListing = await ProductListing.deploy();
    await productListing.waitForDeployment();
  });

  describe("Product Creation", function () {
    it("Should create a product listing", async function () {
      const tx = await productListing.connect(seller).createListing(
        "Engine Part",
        "High-quality engine part",
        "Engine",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );

      await expect(tx).to.emit(productListing, "ListingCreated");
    });

    it("Should track product by seller", async function () {
      await productListing.connect(seller).createListing(
        "Engine Part",
        "High-quality engine part",
        "Engine",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );

      const products = await productListing.getSellerProducts(seller.address);
      expect(products.length).to.equal(1);
    });

    it("Should retrieve product details", async function () {
      await productListing.connect(seller).createListing(
        "Engine Part",
        "High-quality engine part",
        "Engine",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );

      const product = await productListing.getProduct(1);
      expect(product.name).to.equal("Engine Part");
      expect(product.seller).to.equal(seller.address);
      expect(product.inventory).to.equal(100);
    });
  });

  describe("Product Updates", function () {
    beforeEach(async function () {
      await productListing.connect(seller).createListing(
        "Engine Part",
        "High-quality engine part",
        "Engine",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );
    });

    it("Should update product price", async function () {
      const tx = await productListing.connect(seller).updateListing(
        1,
        "Engine Part",
        "Updated description",
        "Engine",
        ethers.parseEther("15"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );

      await expect(tx).to.emit(productListing, "ListingUpdated");

      const product = await productListing.getProduct(1);
      expect(product.price).to.equal(ethers.parseEther("15"));
    });

    it("Should prevent non-seller from updating", async function () {
      await expect(
        productListing.connect(buyer).updateListing(
          1,
          "Engine Part",
          "Updated",
          "Engine",
          ethers.parseEther("15"),
          ethers.ZeroAddress,
          100,
          "QmTest123"
        )
      ).to.be.reverted;
    });
  });

  describe("Inventory Management", function () {
    beforeEach(async function () {
      await productListing.connect(seller).createListing(
        "Engine Part",
        "High-quality engine part",
        "Engine",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest123"
      );
    });

    it("Should reduce inventory on order", async function () {
      const initialProduct = await productListing.getProduct(1);
      expect(initialProduct.inventory).to.equal(100);

      // Simulate escrow reducing inventory
      await productListing.reduceInventory(1, 10);

      const updatedProduct = await productListing.getProduct(1);
      expect(updatedProduct.inventory).to.equal(90);
      expect(updatedProduct.sold).to.equal(10);
    });

    it("Should restore inventory on refund", async function () {
      await productListing.reduceInventory(1, 10);
      await productListing.restoreInventory(1, 10);

      const product = await productListing.getProduct(1);
      expect(product.inventory).to.equal(100);
      expect(product.sold).to.equal(0);
    });

    it("Should prevent inventory reduction below zero", async function () {
      await expect(productListing.reduceInventory(1, 150)).to.be.reverted;
    });

    it("Should track product as unavailable when out of stock", async function () {
      await productListing.reduceInventory(1, 100);

      const isAvailable = await productListing.isProductAvailable(1, 1);
      expect(isAvailable).to.be.false;
    });
  });

  describe("Active Products Listing", function () {
    it("Should list active products with pagination", async function () {
      // Create 5 products
      for (let i = 0; i < 5; i++) {
        await productListing.connect(seller).createListing(
          `Product ${i}`,
          "Description",
          "Category",
          ethers.parseEther("10"),
          ethers.ZeroAddress,
          100,
          "QmTest"
        );
      }

      const activeProducts = await productListing.getAllActiveProducts(0, 3);
      expect(activeProducts.length).to.equal(3);
    });

    it("Should deactivate product listing", async function () {
      await productListing.connect(seller).createListing(
        "Product 1",
        "Description",
        "Category",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest"
      );

      const txDeactivate = await productListing.connect(seller).deactivateListing(1);
      await expect(txDeactivate).to.emit(productListing, "ListingDeactivated");

      const product = await productListing.getProduct(1);
      expect(product.isActive).to.be.false;
    });

    it("Should not list deactivated products in active list", async function () {
      await productListing.connect(seller).createListing(
        "Product 1",
        "Description",
        "Category",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        100,
        "QmTest"
      );

      await productListing.connect(seller).deactivateListing(1);

      const activeProducts = await productListing.getAllActiveProducts(0, 10);
      expect(activeProducts.length).to.equal(0);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle large inventory numbers", async function () {
      await productListing.connect(seller).createListing(
        "Bulk Item",
        "Description",
        "Category",
        ethers.parseEther("1"),
        ethers.ZeroAddress,
        1000000,
        "QmTest"
      );

      const product = await productListing.getProduct(1);
      expect(product.inventory).to.equal(1000000);
    });

    it("Should handle zero inventory", async function () {
      const tx = await productListing.connect(seller).createListing(
        "Limited Item",
        "Description",
        "Category",
        ethers.parseEther("10"),
        ethers.ZeroAddress,
        0,
        "QmTest"
      );

      await expect(tx).to.emit(productListing, "ListingCreated");
    });
  });
});
