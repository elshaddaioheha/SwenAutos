import { parseUnits } from "ethers";

/**
 * Convert a token amount (e.g., 1.5) to base units string using token decimals
 * @param amount decimal string or number
 * @param decimals token decimals (default 18)
 */
export function toTokenUnits(amount: string | number, decimals = 18) {
  return parseUnits(String(amount), decimals).toString();
}

/**
 * Convert a fiat amount (e.g., Naira) to token base units given price per token in fiat.
 * Example: fiatToTokenUnits(2500, 5000, 18) -> returns token units for 0.5 token
 */
export function fiatToTokenUnits(fiatAmount: number, pricePerTokenFiat: number, decimals = 18) {
  if (pricePerTokenFiat <= 0) throw new Error("pricePerTokenFiat must be > 0");
  const tokenAmount = fiatAmount / pricePerTokenFiat;
  return toTokenUnits(tokenAmount, decimals);
}
