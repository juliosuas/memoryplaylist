const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function safeOrigin(origin: unknown): string {
  if (typeof origin !== "string") return "https://memoryplaylist.lovable.app";

  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && !url.hostname.includes("localhost") && url.hostname !== "127.0.0.1") {
      return "https://memoryplaylist.lovable.app";
    }
    return url.origin;
  } catch {
    return "https://memoryplaylist.lovable.app";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  if (!STRIPE_SECRET_KEY) {
    return jsonResponse({ error: "stripe_not_configured" }, 500);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const origin = safeOrigin(body.origin);
  const successUrl = `${origin}/?checkout=success`;
  const cancelUrl = `${origin}/?checkout=cancelled`;
  const priceId = Deno.env.get("STRIPE_PRICE_ID");
  const amount = Number(Deno.env.get("STRIPE_PAYMENT_AMOUNT_CENTS") ?? "499");
  const currency = (Deno.env.get("STRIPE_PAYMENT_CURRENCY") ?? "usd").toLowerCase();

  const params = new URLSearchParams({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    "metadata[product]": "memory_playlist_launch_pass",
  });

  if (priceId) {
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
  } else {
    params.set("line_items[0][price_data][currency]", currency);
    params.set("line_items[0][price_data][unit_amount]", String(Number.isFinite(amount) ? amount : 499));
    params.set("line_items[0][price_data][product_data][name]", "Memory Playlist Launch Pass");
    params.set("line_items[0][quantity]", "1");
  }

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const stripeData = await stripeResponse.json();
  if (!stripeResponse.ok || !stripeData.url) {
    console.error("Stripe Checkout session failed:", stripeData);
    return jsonResponse({ error: "stripe_session_failed" }, 502);
  }

  return jsonResponse({ url: stripeData.url });
});
