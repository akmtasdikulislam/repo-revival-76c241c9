import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";



type InitInput = {
  amount: number;
  teamName: string;
  institution: string;
  leaderEmail: string;
  leaderPhone: string;
  event: string;
};

export const initSslczSession = createServerFn({ method: "POST" })
  .inputValidator((data: InitInput) => data)
  .handler(async ({ data }) => {
    const storeId = process.env.SSLCZ_STORE_ID;
    const storePassword = process.env.SSLCZ_STORE_PASSWORD;
    const isSandbox = (process.env.SSLCZ_IS_SANDBOX ?? "true") !== "false";
    if (!storeId || !storePassword) {
      throw new Error("SSLCommerz credentials are not configured");
    }

    const tranId =
      data.event.toUpperCase() +
      "-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 8).toUpperCase();

    let base = process.env.PUBLIC_SITE_URL || process.env.SITE_URL || "";
    if (!base) {
      try {
        const req = getRequest();
        const url = new URL(req.url);
        const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
        const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
        base = `${proto}://${host}`;
      } catch {
        base = "";
      }
    }
    const params: Record<string, string> = {
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(data.amount),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${base}/api/public/sslcz/success`,
      fail_url: `${base}/api/public/sslcz/fail`,
      cancel_url: `${base}/api/public/sslcz/cancel`,
      ipn_url: `${base}/api/public/sslcz/ipn`,
      shipping_method: "NO",
      product_name: "BUP CSE Tech Carnival 2.0 — IUPC Registration",
      product_category: "EventRegistration",
      product_profile: "non-physical-goods",
      cus_name: data.teamName || "IUPC Team",
      cus_email: data.leaderEmail,
      cus_phone: data.leaderPhone,
      cus_add1: data.institution || "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      value_a: data.event,
      value_b: data.teamName,
      value_c: data.institution,
    };

    const endpoint = isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const body = new URLSearchParams(params).toString();
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as {
      status?: string;
      GatewayPageURL?: string;
      failedreason?: string;
    };
    if (json.status !== "SUCCESS" || !json.GatewayPageURL) {
      throw new Error(json.failedreason || "Failed to initiate payment session");
    }
    return { gatewayUrl: json.GatewayPageURL, tranId };
  });
