import { BrowserProvider, Contract, parseUnits } from "ethers";
import { CONTRACT_ADDRESSES, CAMP_NETWORK_CONFIG } from "./campNetwork";

const ESCROW_ABI = [
  "function getOrder(uint256) view returns (tuple(uint256 orderId,address buyer,address seller,uint256 productId,uint256 amount,address paymentToken,uint8 paymentMethod,string externalPaymentId,uint8 status,uint256 createdAt,uint256 fundedAt,uint256 shippedAt,uint256 deliveredAt,string trackingNumber,uint256 autoReleaseDeadline))",
  "function canBuyerConfirmDelivery(uint256) view returns (bool)",
  "function createOrder(uint256,address,uint256,address,uint8,string)",
  "function fundEscrow(uint256,uint256)",
  "function confirmDelivery(uint256)",
  "function releaseFundsToSeller(uint256,uint256)",
  "event OrderCreated(uint256 indexed orderId,address indexed buyer,address indexed seller,uint256 productId,uint256 amount,uint8 paymentMethod,uint256 timestamp)"
];

const ERC20_ABI = ["function approve(address,uint256) external returns (bool)"];

function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    // Use injected provider if available
    return new BrowserProvider((window as any).ethereum);
  }
  // Fallback: attempt to create BrowserProvider (read-only won't work without rpc), but keep for typing
  return null as any;
}

async function getSignerOrProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return signer;
  }
  return null;
}

export async function getOrder(orderId: number) {
  try {
    const provider = getProvider();
    if (!provider) throw new Error("No provider available");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, provider);
    const o = await contract.getOrder(orderId);
    return o;
  } catch (e) {
    console.error("getOrder failed", e);
    throw e;
  }
}

export async function canBuyerConfirmDelivery(orderId: number) {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, signer);
    const ok = await contract.canBuyerConfirmDelivery(orderId);
    return ok;
  } catch (e) {
    console.error("canBuyerConfirmDelivery failed", e);
    throw e;
  }
}

export async function approveToken(tokenAddress: string, spender: string, amountRaw: string) {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const token = new Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await token.approve(spender, amountRaw);
    return tx;
  } catch (e) {
    console.error("approveToken failed", e);
    throw e;
  }
}

export async function fundEscrow(orderId: number, amountRaw: string) {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, signer);
    const tx = await contract.fundEscrow(orderId, amountRaw);
    return tx;
  } catch (e) {
    console.error("fundEscrow failed", e);
    throw e;
  }
}

export async function createOrderOnChain(productId: number, seller: string, amountRaw: string, paymentToken?: string, paymentMethod = 0, externalPaymentId = "") {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, signer);
    const tx = await contract.createOrder(productId, seller, amountRaw, paymentToken || CONTRACT_ADDRESSES.MOCK_ERC20, paymentMethod, externalPaymentId);
    const receipt = await tx.wait();
    // Try to parse OrderCreated event
    let orderId: number | null = null;
    for (const log of receipt.logs) {
      try {
        if (log.address.toLowerCase() !== CONTRACT_ADDRESSES.ESCROW.toLowerCase()) continue;
        const parsed = contract.interface.parseLog(log);
        if (parsed && parsed.name === "OrderCreated") {
          orderId = Number(parsed.args.orderId.toString());
          break;
        }
      } catch (e) {
        // ignore
      }
    }
    return { tx, receipt, orderId };
  } catch (e) {
    console.error("createOrderOnChain failed", e);
    throw e;
  }
}

export async function confirmDeliveryOnChain(orderId: number) {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, signer);
    const tx = await contract.confirmDelivery(orderId);
    return tx;
  } catch (e) {
    console.error("confirmDelivery failed", e);
    throw e;
  }
}

export async function releaseFundsToSellerOnChain(orderId: number, amountRaw: string) {
  try {
    const signer = await getSignerOrProvider();
    if (!signer) throw new Error("No wallet connected");
    const contract = new Contract(CONTRACT_ADDRESSES.ESCROW, ESCROW_ABI, signer);
    const tx = await contract.releaseFundsToSeller(orderId, amountRaw);
    return tx;
  } catch (e) {
    console.error("releaseFundsToSeller failed", e);
    throw e;
  }
}
