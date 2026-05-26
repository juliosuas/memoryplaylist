import { Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PlaylistAccessState } from "@/lib/playlistAccess";

interface PaywallCardProps {
  access: PlaylistAccessState;
}

export function PaywallCard({ access }: PaywallCardProps) {
  const handleCheckout = () => {
    if (!access.checkoutUrl) {
      toast.error("Stripe todavía no está conectado. Falta configurar VITE_STRIPE_PAYMENT_LINK en Lovable.");
      return;
    }

    window.location.href = access.checkoutUrl;
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
          Acceso de lanzamiento: sin cuenta, sin fricción. Stripe maneja el pago.
        </p>
        <Button type="button" variant="gradient" onClick={handleCheckout}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Desbloquear
        </Button>
      </div>
    </section>
  );
}
