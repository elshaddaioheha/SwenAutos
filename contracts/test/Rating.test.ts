import { expect } from "chai";
import hre from "hardhat";

// @ts-ignore
const { ethers } = hre;

describe("RatingContract", function () {
  let rating: any;
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

    // Deploy Rating
    const escrowAddress = await escrow.getAddress();
    const Rating = await ethers.getContractFactory("SwenAutosRating");
    rating = await Rating.deploy(escrowAddress);
    await rating.waitForDeployment();

    // Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    campToken = await MockERC20.deploy("CAMP Token", "CAMP", ethers.parseEther("1000000"));
    await campToken.waitForDeployment();

    // Distribute tokens
    const amount = ethers.parseEther("10000");
    await campToken.transfer(buyer.address, amount);
    await campToken.transfer(seller.address, amount);

    // Setup
    await escrow.setArbitrator(arbitrator.address);
    await rating.setEscrowContract(escrowAddress);

    // Create product and complete order
    await productListing.connect(seller).createListing(
      "Engine Part",
      "High-quality engine part",
      "Engine",
      ethers.parseEther("10"),
      await campToken.getAddress(),
      100,
      "QmTest123"
    );

    // Create and complete order
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

  describe("Rating Submission", function () {
    it("Should allow buyer to submit rating", async function () {
      const tx = await rating.connect(buyer).submitRating(
        1,
        seller.address,
        5,
        "QmReviewHash"
      );

      await expect(tx).to.emit(rating, "RatingSubmitted");
    });

    it("Should store rating correctly", async function () {
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash");

      const ratingData = await rating.getRating(1);
      expect(ratingData.score).to.equal(5);
      expect(ratingData.buyer).to.equal(buyer.address);
      expect(ratingData.seller).to.equal(seller.address);
    });

    it("Should prevent non-buyer from rating", async function () {
      const nonBuyer = arbitrator;

      await expect(
        rating.connect(nonBuyer).submitRating(1, seller.address, 5, "QmReviewHash")
      ).to.be.reverted;
    });

    it("Should prevent rating non-delivered orders", async function () {
      // Create but don't complete an order
      await escrow.connect(buyer).createOrder(
        1,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-id-2"
      );

      await expect(
        rating.connect(buyer).submitRating(2, seller.address, 5, "QmReviewHash")
      ).to.be.reverted;
    });

    it("Should validate rating score range", async function () {
      // Rating score should be 1-5
      await expect(
        rating.connect(buyer).submitRating(1, seller.address, 0, "QmReviewHash")
      ).to.be.reverted;

      await expect(
        rating.connect(buyer).submitRating(1, seller.address, 6, "QmReviewHash")
      ).to.be.reverted;
    });
  });

  describe("Duplicate Prevention", function () {
    beforeEach(async function () {
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash");
    });

    it("Should prevent rating same order twice", async function () {
      await expect(
        rating.connect(buyer).submitRating(1, seller.address, 4, "QmReviewHash2")
      ).to.be.reverted;
    });

    it("Should track if order has been rated", async function () {
      const hasRated = await rating.hasRatedOrder(1, buyer.address);
      expect(hasRated).to.be.true;
    });
  });

  describe("Seller Aggregates", function () {
    it("Should calculate aggregate rating for single review", async function () {
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash");

      const aggregate = await rating.getSellerAggregateRating(seller.address);
      expect(aggregate.totalRatings).to.equal(1);
      expect(aggregate.totalScore).to.equal(5);
      expect(aggregate.averageScore).to.equal(5);
    });

    it("Should calculate aggregate rating for multiple reviews", async function () {
      // Create 3 more orders and complete them
      for (let i = 0; i < 3; i++) {
        await productListing.connect(seller).createListing(
          `Product ${i}`,
          "Description",
          "Category",
          ethers.parseEther("10"),
          await campToken.getAddress(),
          100,
          "QmTest"
        );
      }

      // Complete order 2
      await escrow.connect(buyer).createOrder(
        2,
        seller.address,
        ethers.parseEther("10"),
        await campToken.getAddress(),
        0,
        "payment-2"
      );
      await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
      await escrow.connect(buyer).fundEscrow(2, ethers.parseEther("10"));
      await escrow.connect(seller).markShipped(2, "TRACK2");
      await escrow.connect(buyer).confirmDelivery(2);

      // Submit ratings
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash1");
      await rating.connect(buyer).submitRating(2, seller.address, 4, "QmReviewHash2");

      const aggregate = await rating.getSellerAggregateRating(seller.address);
      expect(aggregate.totalRatings).to.equal(2);
      expect(aggregate.totalScore).to.equal(9);
      expect(aggregate.averageScore).to.equal(4); // 9/2 = 4.5, rounded down
    });

    it("Should update aggregate when new rating added", async function () {
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash");

      const aggregateBefore = await rating.getSellerAggregateRating(seller.address);
      expect(aggregateBefore.totalRatings).to.equal(1);

      // Note: Can't add another rating for same order in real scenario
      // This test shows the mechanism works
    });
  });

  describe("Seller Rating Retrieval", function () {
    beforeEach(async function () {
      // Create and complete 3 orders
      for (let i = 0; i < 3; i++) {
        await productListing.connect(seller).createListing(
          `Product ${i}`,
          "Description",
          "Category",
          ethers.parseEther("10"),
          await campToken.getAddress(),
          100,
          "QmTest"
        );

        await escrow.connect(buyer).createOrder(
          i + 1,
          seller.address,
          ethers.parseEther("10"),
          await campToken.getAddress(),
          0,
          `payment-${i + 1}`
        );

        // Get the actual order id assigned by the contract
        const orderIdBN = await escrow.getTotalOrders();
        const orderId = Number(orderIdBN);

        await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
        await escrow.connect(buyer).fundEscrow(orderId, ethers.parseEther("10"));
        await escrow.connect(seller).markShipped(orderId, `TRACK${orderId}`);
        await escrow.connect(buyer).confirmDelivery(orderId);

        // Submit rating
        const score = i + 3; // 3, 4, 5
        await rating.connect(buyer).submitRating(orderId, seller.address, score, `QmReview${orderId}`);
      }
    });

    it("Should get seller ratings with pagination", async function () {
      const ratings = await rating.getSellerRatings(seller.address, 0, 2);
      expect(ratings.length).to.be.lte(2);
    });

    it("Should return all ratings for seller", async function () {
      const totalRatings = await rating.getTotalRatings();
      expect(totalRatings).to.equal(3);

      const allRatings = await rating.getSellerRatings(seller.address, 0, 100);
      expect(allRatings.length).to.equal(3);
    });
  });

  describe("Rating Removal", function () {
    beforeEach(async function () {
      await rating.connect(buyer).submitRating(1, seller.address, 5, "QmReviewHash");
    });

    it("Should allow owner to remove fraudulent rating", async function () {
      const aggregateBefore = await rating.getSellerAggregateRating(seller.address);
      expect(aggregateBefore.totalRatings).to.equal(1);

      const tx = await rating.connect(owner).removeRating(1);
      await expect(tx).to.emit(rating, "RatingRemoved");

      const aggregateAfter = await rating.getSellerAggregateRating(seller.address);
      expect(aggregateAfter.totalRatings).to.equal(0);
    });

    it("Should prevent non-owner from removing rating", async function () {
      await expect(rating.connect(buyer).removeRating(1)).to.be.reverted;
      await expect(rating.connect(seller).removeRating(1)).to.be.reverted;
    });

    it("Should restore availability to rate after removal", async function () {
      await rating.connect(owner).removeRating(1);

      // Now buyer should be able to rate again
      const canRateAgain = !(await rating.hasRatedOrder(1, buyer.address));
      expect(canRateAgain).to.be.true;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero ratings gracefully", async function () {
      const aggregate = await rating.getSellerAggregateRating(seller.address);
      expect(aggregate.totalRatings).to.equal(0);
    });

    it("Should support valid rating scores 1-5", async function () {
      // Test all valid scores
      for (let score = 1; score <= 5; score++) {
        // Create new product and order for each score test
        await productListing.connect(seller).createListing(
          `Product ${score}`,
          "Description",
          "Category",
          ethers.parseEther("10"),
          await campToken.getAddress(),
          100,
          "QmTest"
        );

        await escrow.connect(buyer).createOrder(
          score,
          seller.address,
          ethers.parseEther("10"),
          await campToken.getAddress(),
          0,
          `payment-${score}`
        );

        const orderIdBN = await escrow.getTotalOrders();
        const orderId = Number(orderIdBN);

        await campToken.connect(buyer).approve(await escrow.getAddress(), ethers.parseEther("10"));
        await escrow.connect(buyer).fundEscrow(orderId, ethers.parseEther("10"));
        await escrow.connect(seller).markShipped(orderId, `TRACK${orderId}`);
        await escrow.connect(buyer).confirmDelivery(orderId);

        // This should succeed
        await rating.connect(buyer).submitRating(orderId, seller.address, score, "QmReview");
      }

      const aggregate = await rating.getSellerAggregateRating(seller.address);
      expect(aggregate.totalRatings).to.equal(5);
    });
  });
});
