import { Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PlaylistAccessState } from "@/lib/playlistAccess";
import { createCheckoutSession } from "@/lib/checkout";

interface PaywallCardProps {
  access: PlaylistAccessState;
}

export function PaywallCard({ access }: PaywallCardProps) {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const handleCheckout = async () => {
    setIsStartingCheckout(true);
    try {
      const checkoutUrl = await createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout start failed:", error);
      toast.error("Stripe todavía no está conectado. Falta configurar la Edge Function y sus secretos.");
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <section className="rounded-lg border border-primary/25 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
          <Lock className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Ya usaste tus 3 playlists gratis</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Desbloquea Memory Playlist y sigue creando playlists desde tus fotos con un pago sencillo por Stripe.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-xs text-muted-foreground">
          Acceso de lanzamiento: USD $4.99 sugerido. Stripe maneja el pago.
        </p>
        <Button type="button" variant="gradient" onClick={handleCheckout} disabled={isStartingCheckout}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {isStartingCheckout ? "Abriendo Stripe..." : "Desbloquear"}
        </Button>
      </div>
    </section>
  );
}
