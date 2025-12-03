"use client"
import React, { useState } from "react";
import Link from "next/link";
import PrintableReceipt from "../../../components/PrintableReceipt";
import { logEvent } from "../../../lib/analytics";
import { createOrderOnChain, approveToken, fundEscrow } from "../../../lib/escrowHooks";
import { CONTRACT_ADDRESSES } from "../../../lib/campNetwork";
import { fiatToTokenUnits } from "../../../lib/tokenUtils";
import { useToast } from "../../../components/ToastProvider";

export default function DeliveryAndPaymentPage() {
  const [delivery, setDelivery] = useState<"home" | "pickup">("home");
  const [paymentMethod, setPaymentMethod] = useState<"naira" | "crypto">("naira");
  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({ state: "", city: "", street: "", phone: "" });

  const toast = useToast();

  const orderSummary = {
    items: [
      { name: "Toyota Camry Brake Pad Set", qty: 1, price: 12500 },
      { name: "Honda Accord Air Filter", qty: 2, price: 17800 },
      { name: "Mercedes Shock Absorber", qty: 1, price: 28500 },
    ],
    deliveryFee: delivery === "home" ? 2500 : 0,
  };

  const subtotal = orderSummary.items.reduce((s, it) => s + it.price * it.qty, 0);
  const total = subtotal + orderSummary.deliveryFee;

  async function handleCompletePayment() {

    logEvent("checkout_complete_clicked", { paymentMethod, delivery });
    if (!agree) {
      toast.push({ message: "Please agree to the Terms and Escrow Policy.", type: "error" });
      return;
    }
    try {
      setProcessing(true);
      // 1) Create order on-chain (requires seller address). We attempt to use NEXT_PUBLIC_DEFAULT_SELLER or fallback to product listing address as seller.
      const seller = (process.env.NEXT_PUBLIC_DEFAULT_SELLER as string) || CONTRACT_ADDRESSES.PRODUCT_LISTING;
      // productId is required by the contract; using placeholder 1 for demo — replace with actual product id
      const productId = 1;
      // Convert fiat total (₦) to token units. This requires a pricePerToken in Naira; defaulting to 1000 Naira per CAMP token if not provided.
      const pricePerToken = Number(process.env.NEXT_PUBLIC_CAMP_PRICE_NAIRA) || 1000;
      const amountRaw = fiatToTokenUnits(total, pricePerToken, 18); // returns string base units

      toast.push({ message: "Creating order on-chain...", type: "info" });
      const { tx: createTx, receipt, orderId } = await createOrderOnChain(productId, seller, amountRaw, CONTRACT_ADDRESSES.MOCK_ERC20, 0, "");
      toast.push({ message: `Order create tx submitted (${createTx.hash}). Waiting confirmation...`, type: "info" });
      await createTx.wait();
      const resolvedOrderId = orderId ?? 0;

      // 2) Approve token to escrow
      toast.push({ message: "Approving CAMP token for escrow...", type: "info" });
      const approveTx = await approveToken(CONTRACT_ADDRESSES.MOCK_ERC20, CONTRACT_ADDRESSES.ESCROW, amountRaw);
      await approveTx.wait();

      // 3) Fund escrow
      toast.push({ message: "Funding escrow...", type: "info" });
      const fundTx = await fundEscrow(resolvedOrderId, amountRaw);
      toast.push({ message: `Funding tx submitted (${fundTx.hash}). Waiting confirmation...`, type: "info" });
      await fundTx.wait();

      toast.push({ message: "Payment complete — funds are in escrow.", type: "success" });
      // navigate to order confirmation page
      window.location.href = `/order-confirmation/${resolvedOrderId || "1"}`;
    } catch (err) {
      console.error(err);
      toast.push({ message: "Payment failed: " + ((err as any)?.message ?? "Unknown"), type: "error" });
    } finally {
      setProcessing(false);
    }
  }

  function handleBackToCart() {
    logEvent("back_to_cart_clicked", {});
    window.location.href = "/cart";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold">SA</div>
            <span className="font-bold text-2xl text-blue-700">SwenAutos</span>
          </div>
          <div className="text-sm font-semibold">Secure Checkout</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <section className="col-span-8">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-2xl font-bold mb-4">Choose Delivery Method</h2>

            <div className="space-y-4">
              <label className={`block p-4 rounded-lg border ${delivery === "home" ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Home Delivery</div>
                    <div className="text-sm text-gray-500">Get parts delivered to your address • 3-5 business days</div>
                  </div>
                  <div>
                    <input type="radio" name="delivery" checked={delivery === "home"} onChange={() => setDelivery("home")} />
                  </div>
                </div>
                <div className="mt-3 font-semibold">From ₦2,500</div>
              </label>

              <label className={`block p-4 rounded-lg border ${delivery === "pickup" ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Pickup from Seller</div>
                    <div className="text-sm text-gray-500">Collect parts directly • Available immediately</div>
                  </div>
                  <div>
                    <input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} />
                  </div>
                </div>
                <div className="mt-3 font-semibold text-green-600">Free</div>
              </label>
            </div>

            {delivery === "home" && (
              <div className="mt-6 bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input className="p-2 border rounded" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  <input className="p-2 border rounded" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  <input className="col-span-2 p-2 border rounded" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                  <input className="col-span-2 p-2 border rounded" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

            <div className="flex items-center gap-4 bg-gray-100 p-3 rounded mb-4">
              <button onClick={() => { setPaymentMethod("naira"); logEvent("payment_toggle", { to: "naira" }); }} className={`px-4 py-2 rounded ${paymentMethod === "naira" ? "bg-blue-700 text-white" : "bg-white text-gray-700"}`}>Pay with Naira (₦)</button>
              <button onClick={() => { setPaymentMethod("crypto"); logEvent("payment_toggle", { to: "crypto" }); }} className={`px-4 py-2 rounded ${paymentMethod === "crypto" ? "bg-blue-700 text-white" : "bg-white text-gray-700"}`}>Pay with Crypto</button>
            </div>

            {paymentMethod === "naira" ? (
              <div className="space-y-4">
                <label className="block p-3 border rounded bg-blue-50 border-blue-400">
                  <div className="font-bold">Debit/Credit Card</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, Verve accepted</div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <input className="p-2 border rounded col-span-2" placeholder="Card Number" />
                  <input className="p-2 border rounded" placeholder="Expiry Date" />
                  <input className="p-2 border rounded" placeholder="CVV" />
                  <input className="p-2 border rounded col-span-2" placeholder="Cardholder Name" />
                </div>
              </div>
            ) : (
              <div className="p-3 border rounded">Crypto payments will use CAMP token. Connect your wallet at checkout.</div>
            )}

            <div className="mt-6 bg-blue-50 p-3 rounded flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white">i</div>
              <div>
                <div className="font-semibold">Payment Protected by Escrow</div>
                <div className="text-sm text-gray-600">Your payment is held safely until you confirm receipt of the parts.</div>
                <div className="mt-1">
                  <Link href="/legal/escrow-policy" onClick={() => logEvent("learn_more_escrow_clicked", {})} className="text-blue-700 font-semibold">Learn more</Link>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="agree" className="text-sm">I agree to the <Link href="/terms-of-service" className="text-blue-700">Terms of Service</Link> and <Link href="/legal/escrow-policy" className="text-blue-700">Escrow Policy</Link>.</label>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button onClick={handleBackToCart} className="px-4 py-2 border rounded">Back to Cart</button>
              <button onClick={handleCompletePayment} disabled={processing} className="px-4 py-2 bg-blue-700 text-white rounded font-bold">{processing ? "Processing..." : "Complete Payment"}</button>
            </div>
          </div>
        </section>

        <aside className="col-span-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold text-xl mb-3">Order Summary</h3>
            <div className="space-y-3">
              {orderSummary.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-500">Qty: {it.qty}</div>
                  </div>
                  <div className="font-bold">₦{(it.price * it.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between text-gray-600"> <div>Subtotal</div> <div>₦{subtotal.toLocaleString()}</div> </div>
              <div className="flex justify-between text-gray-600"> <div>Delivery Fee</div> <div>₦{orderSummary.deliveryFee.toLocaleString()}</div> </div>
              <div className="mt-3 flex justify-between items-end"> <div className="font-bold text-lg">Total</div> <div className="font-extrabold text-2xl text-blue-700">₦{total.toLocaleString()}</div> </div>
            </div>

            <div className="mt-4">
              <PrintableReceipt buyer={{ name: "Customer", email: "you@example.com" }} order={{ id: "12345", items: orderSummary.items, subtotal, delivery: orderSummary.deliveryFee, total }} />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
