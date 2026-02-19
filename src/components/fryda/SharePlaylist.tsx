import { useState, useRef } from "react";
import { Share2, Copy, Download, X, Link, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  track_name: string;
  artist: string;
  is_new_discovery: boolean;
}

interface SharePlaylistProps {
  playlist: any;
  tracks: Track[];
  config: { emoji: string; gradient: string; gradientFrom: string; gradientTo: string };
}

const EMOTION_LABELS: Record<string, string> = {
  enamorado: "Enamorado ❤️",
  nostálgico: "Nostálgico 🥲",
  feliz: "Feliz 😀",
  relajado: "Relajado 😌",
  nervioso: "Nervioso 😬",
  triste: "Triste 😢",
  reflexivo: "Reflexivo 💭",
  motivado: "Motivado 💪",
  rapero: "Rapero 🎤",
  esperanzado: "Esperanzado 🌈",
  libre: "Libre 😎",
};

export const SharePlaylist = ({ playlist, tracks, config }: SharePlaylistProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareUrl = window.location.href;
  const emotionLabel = EMOTION_LABELS[playlist.emotion] || playlist.emotion;
  const previewTracks = tracks.slice(0, 6);
  const newCount = tracks.filter((t) => t.is_new_discovery).length;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("¡Enlace copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi playlist ${emotionLabel} en Fryda`,
          text: `Escucha mi playlist personalizada: ${tracks.slice(0, 3).map((t) => `${t.track_name} - ${t.artist}`).join(", ")} y más`,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") toast.error("No se pudo compartir");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCard = async () => {
    const card = cardRef.current;
    if (!card) return;

    toast.info("Generando imagen...");
    try {
      // Dynamic import to keep bundle size small
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `fryda-playlist-${playlist.emotion}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("¡Imagen descargada!");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar la imagen");
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🎵 Mi playlist "${emotionLabel}" en Fryda: ${tracks.slice(0, 2).map((t) => `${t.track_name} - ${t.artist}`).join(", ")}... #Fryda #Music`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎵 Mira mi playlist "${emotionLabel}" generada con IA en Fryda!\n${tracks.slice(0, 3).map((t) => `• ${t.track_name} - ${t.artist}`).join("\n")}\n\nCrea la tuya: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex-1 gap-2 h-12 rounded-xl border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm w-full p-0 overflow-hidden rounded-2xl gap-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-lg font-bold">Compartir playlist</DialogTitle>
          </DialogHeader>

          {/* Visual preview card */}
          <div className="px-6 pb-4">
            <div
              ref={cardRef}
              className={cn(
                "relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br",
                config.gradient
              )}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                }}
              />

              {/* Header */}
              <div className="relative z-10 mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{config.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight capitalize">{playlist.emotion}</p>
                    <p className="text-white/70 text-xs">{tracks.length} canciones · {newCount} descubrimientos</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                    <span className="text-[10px]">♥</span>
                  </div>
                  <span className="text-white/80 text-xs font-medium">Fryda · Every memory has its song</span>
                </div>
              </div>

              {/* Track list */}
              <div className="relative z-10 space-y-1.5">
                {previewTracks.map((track, i) => (
                  <div key={track.id} className="flex items-center gap-2">
                    <span className="text-white/50 text-[10px] w-3 font-mono">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-xs font-medium truncate block">{track.track_name}</span>
                      <span className="text-white/60 text-[10px] truncate block">{track.artist}</span>
                    </div>
                    {track.is_new_discovery && (
                      <span className="text-[8px] text-white/70 bg-white/20 rounded px-1 py-0.5 flex-shrink-0">NEW</span>
                    )}
                  </div>
                ))}
                {tracks.length > 6 && (
                  <p className="text-white/50 text-[10px] pt-1">+{tracks.length - 6} canciones más...</p>
                )}
              </div>
            </div>
          </div>

          {/* Share actions */}
          <div className="px-6 pb-6 space-y-3">
            {/* Primary actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCard}
                className="gap-2 rounded-xl h-10"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 rounded-xl h-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link className="w-3.5 h-3.5" />}
                {copied ? "¡Copiado!" : "Copiar enlace"}
              </Button>
            </div>

            {/* Social share */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-green-500/10 hover:border-green-500/30 border border-transparent transition-all group"
              >
                <span className="text-xl">💬</span>
                <span className="text-[10px] text-muted-foreground group-hover:text-green-600 font-medium">WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-sky-500/10 hover:border-sky-500/30 border border-transparent transition-all group"
              >
                <span className="text-xl">𝕏</span>
                <span className="text-[10px] text-muted-foreground group-hover:text-sky-600 font-medium">Twitter / X</span>
              </button>
              <button
                onClick={handleShareNative}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
              >
                <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                <span className="text-[10px] text-muted-foreground group-hover:text-primary font-medium">Más...</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
