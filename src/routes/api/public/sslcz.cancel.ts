import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request) {
  const form = await request.formData().catch(() => null);
  const tranId = form?.get("tran_id")?.toString() ?? "";
  const url = `/iupc?payment=cancel&tran_id=${encodeURIComponent(tranId)}`;
  return new Response(null, { status: 303, headers: { Location: url } });
}

export const Route = createFileRoute("/api/public/sslcz/cancel")({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
      GET: async ({ request }) => handle(request),
    },
  },
});
