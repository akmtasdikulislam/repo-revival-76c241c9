import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

/**
 * SSLCommerz IPN validator.
 * Verifies `verify_sign` (MD5 of sorted key=value pairs + md5(store_passwd)).
 */
async function handle(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return new Response("Bad request", { status: 400 });

  const storePassword = process.env.SSLCZ_STORE_PASSWORD;
  if (!storePassword) return new Response("Not configured", { status: 500 });

  const params: Record<string, string> = {};
  form.forEach((v, k) => {
    params[k] = String(v);
  });
  const receivedSign = params["verify_sign"];
  const signKey = params["verify_key"];
  if (!receivedSign || !signKey) {
    return new Response("Missing signature", { status: 400 });
  }
  const keys = signKey.split(",").sort();
  const pwHash = createHash("md5").update(storePassword).digest("hex");
  const raw =
    keys.map((k) => `${k}=${params[k] ?? ""}`).join("&") + `&store_passwd=${pwHash}`;
  const expected = createHash("md5").update(raw).digest("hex");
  if (expected !== receivedSign) {
    return new Response("Invalid signature", { status: 401 });
  }

  // TODO: persist successful payment (tran_id, amount, status) when a DB is added.
  // For now we accept the IPN and log it server-side.
  console.log("[SSLCZ IPN]", {
    tran_id: params["tran_id"],
    status: params["status"],
    amount: params["amount"],
    currency: params["currency"],
    val_id: params["val_id"],
  });

  return new Response("OK");
}

export const Route = createFileRoute("/api/public/sslcz/ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
    },
  },
});
