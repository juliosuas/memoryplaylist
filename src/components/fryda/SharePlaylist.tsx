import { useState, useRef } from "react";
import { Share2, Copy, Download, Link, Check, Heart, Music } from "lucide-react";
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
  config: { gradient: string; gradientFrom: string; gradientTo: string };
}

const EMOTION_LABELS: Record<string, string> = {
  enamorado: "Enamorado",
  nostálgico: "Nostálgico",
  feliz: "Feliz",
  relajado: "Relajado",
  nervioso: "Nervioso",
  triste: "Triste",
  reflexivo: "Reflexivo",
  motivado: "Motivado",
  rapero: "Rapero",
  esperanzado: "Esperanzado",
  libre: "Libre",
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
      toast.success("Enlace copiado");
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
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement("a");
      link.download = `fryda-playlist-${playlist.emotion}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Imagen descargada");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar la imagen");
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Mi playlist "${emotionLabel}" en Fryda: ${tracks.slice(0, 2).map((t) => `${t.track_name} - ${t.artist}`).join(", ")}... #Fryda #Music`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Mira mi playlist "${emotionLabel}" generada con IA en Fryda!\n${tracks.slice(0, 3).map((t) => `• ${t.track_name} - ${t.artist}`).join("\n")}\n\nCrea la tuya: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full gap-2 h-11 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Compartir playlist
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
              className={cn("relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br", config.gradient)}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)" }}
              />
              {/* Header */}
              <div className="relative z-10 mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight capitalize">{playlist.emotion}</p>
                    <p className="text-white/70 text-xs">{tracks.length} canciones · {newCount} descubrimientos</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Heart className="w-3 h-3 text-white/60 fill-white/60" />
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
                  <p className="text-white/50 text-[10px] pt-1">+{tracks.length - 6} canciones más</p>
                )}
              </div>
            </div>
          </div>

          {/* Share actions */}
          <div className="px-6 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadCard} className="gap-2 rounded-xl h-10">
                <Download className="w-3.5 h-3.5" />
                Descargar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2 rounded-xl h-10">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link className="w-3.5 h-3.5" />}
                {copied ? "Copiado" : "Copiar enlace"}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-green-500/10 border border-transparent hover:border-green-500/20 transition-all group"
              >
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-green-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-[10px] text-muted-foreground group-hover:text-green-600 font-medium transition-colors">WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all group"
              >
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-sky-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-[10px] text-muted-foreground group-hover:text-sky-600 font-medium transition-colors">Twitter</span>
              </button>
              <button
                onClick={handleShareNative}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
              >
                <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-muted-foreground group-hover:text-primary font-medium transition-colors">Más</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
