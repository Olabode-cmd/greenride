/*
 * Simulated Paystack payment flow for development and demo purposes.
 * Uses the TEST public key — no real transactions are processed.
 *
 * In production this would initialise a Paystack transaction via the
 * backend, receive an authorization URL, and open the Paystack checkout
 * WebView. Here we simulate a 1.5s network round-trip and always resolve
 * successfully so the booking flow can be demonstrated end-to-end.
 */
import { PAYSTACK_CONFIG } from "./paystack-config";

export interface PaymentResult {
  reference: string;
  status: "success" | "failed";
  amountNgn: number;
}

export async function simulatePayment(
  amountNgn: number,
): Promise<PaymentResult> {
  /*
   * Log the public key to confirm the correct config is loaded.
   * The secret key is never used client-side.
   */
  console.log(
    `[Paystack] Initiating test payment — key: ${PAYSTACK_CONFIG.PUBLIC_KEY.slice(0, 16)}…`,
  );

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    reference: `GR-${Date.now()}`,
    status: "success",
    amountNgn,
  };
}
