import hre from "hardhat";

async function main() {
    // @ts-ignore - ethers is injected by hardhat-toolbox
    const { ethers } = hre;
    
    console.log("Deploying SwenAutos contracts to CAMP network...");

    // 1. Deploy Product Listing Contract (no dependencies)
    const ProductListing = await ethers.getContractFactory("SwenAutosProductListing");
    const productListing = await ProductListing.deploy();
    await productListing.waitForDeployment();
    const productListingAddress = await productListing.getAddress();
    console.log(`ProductListingContract deployed to: ${productListingAddress}`);

    // 2. Deploy Escrow Contract (linked to ProductListing)
    const Escrow = await ethers.getContractFactory("SwenAutosEscrow");
    const escrow = await Escrow.deploy(productListingAddress);
    await escrow.waitForDeployment();
    const escrowAddress = await escrow.getAddress();
    console.log(`EscrowContract deployed to: ${escrowAddress}`);

    // 3. Deploy Rating Contract (linked to Escrow)
    const Rating = await ethers.getContractFactory("SwenAutosRating");
    const rating = await Rating.deploy(escrowAddress);
    await rating.waitForDeployment();
    const ratingAddress = await rating.getAddress();
    console.log(`RatingContract deployed to: ${ratingAddress}`);

    console.log("\nDeployment Complete! Add these to your .env.local file:");
    console.log(`NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
    console.log(`NEXT_PUBLIC_RATING_CONTRACT_ADDRESS=${ratingAddress}`);
    console.log(`NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS=${productListingAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
