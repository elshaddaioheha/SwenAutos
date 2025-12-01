# SwenAutos Marketplace

## 🚗 Overview
SwenAutos is a decentralized marketplace for authentic auto parts, built for the African market. It solves the critical issues of counterfeit parts and lack of trust by leveraging the **CAMP Network** for transparency and **Origin SDK** for seamless user onboarding.

## 🏆 Hackathon Track
**TechyJaunt x CAMP Network Buildathon**
- **Track**: Infrastructure / Commerce
- **Network**: BaseCAMP Testnet

## ✨ Key Features
- **🔍 Smart Search**: Find parts by Year, Make, Model (YMM) or VIN.
- **🛡️ Trust & Safety**: Escrow-protected payments and verified seller ratings.
- **💳 Flexible Payments**: Pay with Fiat (Naira) or Crypto (CAMP/USDC).
- **📦 Origin SDK Integration**: Seamless wallet connection and user authentication.
- **📱 Mobile-First Design**: Optimized for users on the go.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, Framer Motion
- **Blockchain**: Hardhat, Ethers.js, Viem
- **Integration**: Origin SDK, Paystack (Fiat)
- **Network**: BaseCAMP Testnet

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swenautos-marketplace.git
   cd swenautos-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env.local` and fill in your credentials.
   ```bash
   cp .env.example .env.local
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see the app.

## ⛓️ Smart Contracts

Deployed on **BaseCAMP Testnet**:
- **Escrow**: `[Add Address]`
- **ProductListing**: `[Add Address]`
- **Rating**: `[Add Address]`

To deploy contracts yourself:
```bash
npx hardhat run contracts/scripts/deploy.ts --network basecamp
```

## 🧪 Testing
Run the smart contract test suite:
```bash
npx hardhat test
```

## 👥 Team
- **SwenAutos Team**

---
Built with ❤️ for the Camp Network Africa Buildathon.
