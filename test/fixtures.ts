import hre from "hardhat";

// @ts-ignore - ethers is injected by hardhat-toolbox
const { ethers } = hre;

export async function setupFixtures() {
  const [owner, seller, buyer, arbitrator, addr1, addr2] = await ethers.getSigners();

  // Deploy Mock CAMP Token
  let campToken: any = null;
  try {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    campToken = await MockERC20.deploy("CAMP Token", "CAMP", ethers.parseEther("1000000"));
    await campToken.waitForDeployment();
  } catch (error) {
    console.warn("MockERC20 not found");
  }

  // Deploy ProductListingContract
  const ProductListing = await ethers.getContractFactory("SwenAutosProductListing");
  const productListing = await ProductListing.deploy();
  await productListing.waitForDeployment();

  // Deploy EscrowContract
  const productListingAddress = await productListing.getAddress();
  const Escrow = await ethers.getContractFactory("SwenAutosEscrow");
  const escrow = await Escrow.deploy(productListingAddress);
  await escrow.waitForDeployment();

  // Deploy RatingContract
  const escrowAddress = await escrow.getAddress();
  const Rating = await ethers.getContractFactory("SwenAutosRating");
  const rating = await Rating.deploy(escrowAddress);
  await rating.waitForDeployment();

  // Distribute CAMP tokens
  if (campToken) {
    const amount = ethers.parseEther("10000");
    await campToken.transfer(seller.address, amount);
    await campToken.transfer(buyer.address, amount);
    await campToken.transfer(addr1.address, amount);
    await campToken.transfer(addr2.address, amount);
  }

  // Setup roles
  await escrow.setArbitrator(arbitrator.address);
  await rating.setEscrowContract(escrowAddress);

  return {
    owner,
    seller,
    buyer,
    arbitrator,
    addr1,
    addr2,
    productListing,
    escrow,
    rating,
    campToken,
  };
}

export { ethers };
