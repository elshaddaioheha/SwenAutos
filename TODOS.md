# SwenAutos Marketplace - Project Status & TODOs

## Current State
- **Frontend**: Next.js 14, TailwindCSS, Supabase Auth (Buyer/Seller roles), CAMP Network Wallet Connection.
- **Smart Contracts**: Hardhat with OpenZeppelin v5. Key contracts:
  - `ProductListingContract`: Permissionless listing creation (frontend restricted to sellers).
  - `EscrowContract`: Handles product purchases, funding, shipping, and delivery confirmation.
  - `RatingContract`: Allows buyers to rate completed transactions.
- **Testing**:
  - Validated build (`npm run validate`).
  - Unit tests for contracts consolidated in `test/`.
  - UI tests in `test/ui/`.

## Remaining TODOs

### 1. Smart Contract Enhancements
- [ ] **On-Chain Seller Registry (Critical for Security)**:
  - Currently, valid buyers can technically invoke `createListing` directly on the blockchain if they bypass the frontend.
  - *Recommendation*: Add a `mapping(address => bool) isSeller` to `ProductListingContract`. Add `modifier onlySeller`.
  - Implement an admin dashboard or simplified flow to "approve" sellers or let them register on-chain.

### 2. Payments & Pricing
- [ ] **Fiat Integration**: The 'Pay with Card' button is a UI mock/wrapper.
  - Need to integrate Paystack or Flutterwave SDK for real fiat-to-crypto on-ramping or direct payment handling.
- [ ] **Oracle Integration**:
  - `EscrowContract` relies on manually set prices. For dynamic pricing (CAMP/USD), integrate a price feed oracle (e.g., Pyth or Chainlink if available on CAMP).

### 3. User Experience
- [ ] **Dashboard Stats**:
  - The seller dashboard shows placeholder stats. Connect these to real graph queries (The Graph) or index events using Supabase to show real "Total Sales", "Active Orders", etc.
- [ ] **Email Notifications**:
  - Set up Supabase Edge Functions to send transactional emails (e.g., "Order Received", "Item Shipped") using Resend or SendGrid.

### 4. Admin Features
- [ ] **Dispute Resolution**:
  - `EscrowContract` has an `arbitrator` role.
  - Build an Admin Dashboard to view `disputed` orders and call `resolveDispute`.

### 5. Deployment
- [ ] **Mainnet Readiness**:
  - Audit smart contracts.
  - Verify contracts on CAMP Explorer.

## Notes on Auth
We have implemented an OTP-like flow for Email verification on the frontend to improve UX. Ensure your Supabase project is configured to supported "Email OTP" if you want the code delivery to work seamlessly, otherwise the link provided in the email will still work as a fallback.
