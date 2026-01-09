# SwenAutos Marketplace - Project Status & TODOs

## Current State
- **Frontend**: Next.js 14, TailwindCSS, Supabase Auth (Buyer/Seller roles), CAMP Network Wallet Connection.
  - **Data Integration**: Connected to real blockchain data for:
    - Product Catalog & Shop (read from `ProductListingContract`)
    - Buyer Order History (read from `EscrowContract`)
    - Seller Dashboard (My Listings, My Orders, Create Listing, Mark Shipped)
- **Smart Contracts**: Hardhat with OpenZeppelin v5. Deployed on CAMP Testnet (Local/Remote).
- **Testing**:
  - Validated build (`npm run validate`).
  - Unit tests for contracts consolidated in `test/`.
  - UI tests in `test/ui/`.

## Phase 3: Seller Implementation - COMPLETE ✅
- [x] **Create Listing**: Connected `useProductListing` to form.
- [x] **My Listings**: Fetching seller products from chain.
- [x] **Sales Dashboard**: Fetching seller orders and enabling "Mark as Shipped" functionality.
- [x] **Seller Registry**: Added on-chain `isSeller` mapping and registration flow.

## Phase 4: Payments & Pricing - IN PROGRESS 🔄
- [x] **Fiat Integration**: Integrated Paystack for Naira payments leading to order confirmation.
- [ ] **Oracle Integration**: Need to integrate price feed for dynamic crypto pricing.

## Phase 5: Security & Optimization - COMPLETE ✅
- [x] **Escrow Vulnerability**: Fixed unchecked order amounts in `EscrowContract`.
- [x] **Database Security**: Added SQL policies for RLS.
- [x] **Cleanup**: Replaced mock setTimeout logic with real Supabase calls.
- [x] **Secrets**: Cleaned up sensitive files and configured gitignore.
- [x] **SEO**: Added dynamic metadata and image optimization.
- [x] **Package Manager**: Switched to `pnpm`.

## Remaining TODOs

### 1. Smart Contract Enhancements
- [x] **On-Chain Seller Registry (Critical for Security)**:
  - Added `mapping(address => bool) isSeller` to `ProductListingContract`.
  - Added `modifier onlySeller` to `createListing`.
  - Added `registerAsSeller` function.



### 3. User Experience
- [x] **Dashboard Stats**:
  - Connected seller dashboard to real Supabase data for total listings, orders, and earnings.
- [ ] **Email Notifications**:
  - Set up Supabase Edge Functions to send transactional emails (e.g., "Order Received", "Item Shipped") using Resend or SendGrid.

### 4. Admin Features
- [x] **Dispute Resolution**:
  - `EscrowContract` has an `arbitrator` role.
  - Build an Admin Dashboard to view `disputed` orders and call `resolveDispute`.

### 5. Deployment
- [ ] **Mainnet Readiness**:
  - Audit smart contracts.
  - Verify contracts on CAMP Explorer.

## Notes on Auth
We have implemented an OTP-like flow for Email verification on the frontend to improve UX. Ensure your Supabase project is configured to supported "Email OTP" if you want the code delivery to work seamlessly, otherwise the link provided in the email will still work as a fallback.
