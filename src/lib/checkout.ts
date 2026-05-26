import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(): Promise<string> {
  const mockUrl = localStorage.getItem("memoryplaylist_checkout_mock_url");
  if (mockUrl) return mockUrl;

  if (!isSupabaseConfigured) {
    throw new Error("checkout_not_configured");
  }

  const origin = window.location.origin;
  const { data, error } = await supabase.functions.invoke<CheckoutResponse>("create-checkout-session", {
    body: { origin },
  });

  if (error) {
    console.error("Stripe checkout function failed:", error);
    throw new Error("checkout_unavailable");
  }

  if (data?.error || !data?.url) {
    throw new Error(data?.error || "checkout_unavailable");
  }

  return data.url;
}
