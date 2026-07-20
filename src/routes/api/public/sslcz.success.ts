import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request) {
  const form = await request.formData().catch(() => null);
  const tranId = form?.get("tran_id")?.toString() ?? "";
  const amount = form?.get("amount")?.toString() ?? "";
  const url = `/iupc?payment=success&tran_id=${encodeURIComponent(tranId)}&amount=${encodeURIComponent(amount)}`;
  return new Response(null, { status: 303, headers: { Location: url } });
}

export const Route = createFileRoute("/api/public/sslcz/success")({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
      GET: async ({ request }) => handle(request),
    },
  },
});
