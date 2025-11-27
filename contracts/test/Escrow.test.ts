import { expect } from "chai";
import hre from "hardhat";

// @ts-ignore
const { ethers } = hre;

describe("EscrowContract", function () {
  let escrow: any;
  let productListing: any;
  let campToken: any;
  let owner: any;
  let seller: any;
  let buyer: any;
  let arbitrator: any;

  beforeEach(async function () {
    [owner, seller, buyer, arbitrator] = await ethers.getSigners();

    // Deploy ProductListing
    const ProductListing = await ethers.getContractFactory("SwenAutosProductListing");
    productListing = await ProductListing.deploy();
    await productListing.waitForDeployment();

    // Deploy Escrow
    const productListingAddress = await productListing.getAddress();
    const Escrow = await ethers.getContractFactory("SwenAutosEscrow");
    escrow = await Escrow.deploy(productListingAddress);
    await escrow.waitForDeployment();

    // Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    campToken = await MockERC20.deploy("CAMP Token", "CAMP", ethers.parseEther("1000000"));
    await campToken.waitForDeployment();

    // Distribute tokens
    const amount = ethers.parseEther("10000");
    await campToken.transfer(buyer.address, amount);
    await campToken.transfer(seller.address, amount);

    // Setup escrow
    await escrow.setArbitrator(arbitrator.address);

    // Create a product listing
    await productListing.connect(seller).createListing(
      "Engine Part",
      "High-quality engine part",
      "Engine",
      ethers.parseEther("10"),
      await campToken.getAddress(),
      100,
      "QmTest123"
    );
  });

  describe("Order Creation", function () {
    it("Should create an order", async function () {
      const tx = await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0, // CAMP_TOKEN
        "payment-id-1"
      );

      await expect(tx).to.emit(escrow, "OrderCreated");
    });

    it("Should set correct order details", async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      const order = await escrow.getOrder(1);
      expect(order.buyer).to.equal(buyer.address);
      expect(order.seller).to.equal(seller.address);
      expect(order.amount).to.equal(ethers.parseEther("10"));
    });
  });

  describe("Escrow Funding", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );
    });

    it("Should fund escrow with CAMP token", async function () {
      const campTokenAddress = await campToken.getAddress();
      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));

      const tx = await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));
      await expect(tx).to.emit(escrow, "OrderFunded");
    });

    it("Should reduce product inventory on funding", async function () {
      const productBefore = await productListing.getProduct(1);
      expect(productBefore.inventory).to.equal(100);

      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));

      const productAfter = await productListing.getProduct(1);
      expect(productAfter.inventory).to.equal(99);
    });

    it("Should prevent double funding", async function () {
      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("20"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));

      await expect(
        escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"))
      ).to.be.reverted;
    });

    it("Should prevent non-buyer from funding", async function () {
      await campToken.connect(seller).approve(await escrow.getAddress(), ethers.parseEther("10"));

      await expect(
        escrow.connect(seller).fundEscrow(1, ethers.parseEther("10"))
      ).to.be.reverted;
    });
  });

  describe("Order Lifecycle", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));
    });

    it("Should mark order as shipped", async function () {
      const tx = await escrow.connect(seller).markShipped(1, "TRACK123");
      await expect(tx).to.emit(escrow, "OrderShipped");

      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(3); // SHIPPED status
    });

    it("Should confirm delivery", async function () {
      await escrow.connect(seller).markShipped(1, "TRACK123");

      const tx = await escrow.connect(buyer).confirmDelivery(1);
      await expect(tx).to.emit(escrow, "OrderDeliveryConfirmed");

      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(4); // DELIVERED status
    });

    it("Should release funds to seller", async function () {
      await escrow.connect(seller).markShipped(1, "TRACK123");
      await escrow.connect(buyer).confirmDelivery(1);

      const sellerBalanceBefore = await campToken.balanceOf(seller.address);
      
      const tx = await escrow.connect(buyer).releaseFundsToSeller(1, ethers.parseEther("10"));
      await expect(tx).to.emit(escrow, "FundsReleasedToSeller");

      const sellerBalanceAfter = await campToken.balanceOf(seller.address);
      expect(sellerBalanceAfter).to.equal(sellerBalanceBefore + ethers.parseEther("10"));
    });
  });

  describe("Refund Logic", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));
    });

    it("Should refund buyer before shipment", async function () {
      const buyerBalanceBefore = await campToken.balanceOf(buyer.address);

      const tx = await escrow.connect(seller).refundBuyer(1, ethers.parseEther("10"));
      await expect(tx).to.emit(escrow, "RefundIssuedToBuyer");

      const buyerBalanceAfter = await campToken.balanceOf(buyer.address);
      expect(buyerBalanceAfter).to.equal(buyerBalanceBefore + ethers.parseEther("10"));
    });

    it("Should restore inventory on refund", async function () {
      const productBefore = await productListing.getProduct(1);
      expect(productBefore.inventory).to.equal(99); // After funding

      await escrow.connect(seller).refundBuyer(1, ethers.parseEther("10"));

      const productAfter = await productListing.getProduct(1);
      expect(productAfter.inventory).to.equal(100); // Restored
    });
  });

  describe("Dispute Resolution", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));
      await escrow.connect(seller).markShipped(1, "TRACK123");
    });

    it("Should open a dispute", async function () {
      const tx = await escrow.connect(buyer).openDispute(
        1,
        0, // PRODUCT_NOT_RECEIVED
        "QmDisputeDescription"
      );

      await expect(tx).to.emit(escrow, "DisputeOpened");

      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(5); // DISPUTED status
    });

    it("Should resolve dispute in favor of buyer", async function () {
      await escrow.connect(buyer).openDispute(
        1,
        0,
        "QmDisputeDescription"
      );

      const buyerBalanceBefore = await campToken.balanceOf(buyer.address);

      const tx = await escrow.connect(arbitrator).resolveDispute(
        1,
        ethers.parseEther("10"), // Full refund to buyer
        0 // Nothing to seller
      );

      await expect(tx).to.emit(escrow, "DisputeResolved");

      const buyerBalanceAfter = await campToken.balanceOf(buyer.address);
      expect(buyerBalanceAfter).to.equal(buyerBalanceBefore + ethers.parseEther("10"));
    });

    it("Should resolve dispute with split funds", async function () {
      await escrow.connect(buyer).openDispute(1, 1, "QmDisputeDescription"); // QUALITY_ISSUE

      await escrow.connect(arbitrator).resolveDispute(
        1,
        ethers.parseEther("5"), // 50% to buyer
        ethers.parseEther("5")  // 50% to seller
      );

      const order = await escrow.getOrder(1);
      expect(order.status).to.equal(6); // COMPLETED
    });

    it("Should prevent non-arbitrator from resolving dispute", async function () {
      await escrow.connect(buyer).openDispute(1, 0, "QmDisputeDescription");

      await expect(
        escrow.connect(buyer).resolveDispute(1, ethers.parseEther("5"), ethers.parseEther("5"))
      ).to.be.reverted;
    });
  });

  describe("Auto-Release", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(1, ethers.parseEther("10"));
      await escrow.connect(seller).markShipped(1, "TRACK123");
      await escrow.connect(buyer).confirmDelivery(1);
    });

    it("Should auto-release funds after deadline", async function () {
      // Fast-forward time
      await hre.network.provider.send("hardhat_mine", ["0x1000000"]);

      const sellerBalanceBefore = await campToken.balanceOf(seller.address);

      const tx = await escrow.autoReleaseIfEligible(1);
      await expect(tx).to.emit(escrow, "OrderAutoReleased");

      const sellerBalanceAfter = await campToken.balanceOf(seller.address);
      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
    });
  });

  describe("Edge Cases", function () {
    it("Should prevent operations on non-existent order", async function () {
      await expect(escrow.getOrder(999)).to.be.reverted;
    });

    it("Should handle multiple orders from same buyer", async function () {
      // Create first order
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-1"
      );

      // Create second order
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-2"
      );

      const buyerOrders = await escrow.getBuyerOrders(buyer.address);
      expect(buyerOrders.length).to.be.gte(2);
    });
  });
});
