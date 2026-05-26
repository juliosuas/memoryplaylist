import { useState, useRef } from "react";
import { Share2, Download, ClipboardList, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createSharePayload, type StoredPlaylist, type StoredTrack } from "@/lib/localPlaylistStore";

interface Track {
  id: string;
  playlist_id?: string;
  track_name: string;
  artist: string;
  album?: string | null;
  youtubeId?: string;
  is_new_discovery: boolean;
}

interface SharePlaylistProps {
  playlist: StoredPlaylist;
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

  const playlistEmotion = playlist.emotion ?? "playlist";
  const emotionLabel = EMOTION_LABELS[playlistEmotion] || playlistEmotion;
  const previewTracks = tracks.slice(0, 6);
  const newCount = tracks.filter((t) => t.is_new_discovery).length;
  const sharePayload = createSharePayload({
    playlist,
    tracks: tracks.map((track) => ({
      id: track.id,
      playlist_id: track.playlist_id ?? playlist.id,
      track_name: track.track_name,
      artist: track.artist,
      album: track.album ?? null,
      is_new_discovery: track.is_new_discovery,
      youtubeId: track.youtubeId,
    })) satisfies StoredTrack[],
  });
  const portableShareUrl = `${window.location.origin}${window.location.pathname}#share=${sharePayload}`;
  const shareText = `Mi playlist ${emotionLabel} en Memory Playlist:\n${tracks
    .slice(0, 10)
    .map((track, index) => `${index + 1}. ${track.track_name} - ${track.artist}`)
    .join("\n")}\n\nCrea la tuya: ${portableShareUrl}`;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("¡Lista copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar la lista");
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi playlist ${emotionLabel} en Memory Playlist`,
          text: shareText,
          url: portableShareUrl,
        });
      } catch (err: unknown) {
        if (!(err instanceof DOMException) || err.name !== "AbortError") toast.error("No se pudo compartir");
      }
    } else {
      handleCopySummary();
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
      link.download = `memoryplaylist-${playlistEmotion}.png`;
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
      `🎵 Mi playlist "${emotionLabel}" en Memory Playlist: ${tracks.slice(0, 2).map((t) => `${t.track_name} - ${t.artist}`).join(", ")}... #MemoryPlaylist #Music`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(portableShareUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎵 Mira mi playlist "${emotionLabel}" generada con IA en Memory Playlist!\n${tracks.slice(0, 3).map((t) => `• ${t.track_name} - ${t.artist}`).join("\n")}\n\nCrea la tuya: ${portableShareUrl}`
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
            <DialogDescription>
              Descarga una imagen, copia la lista o comparte un enlace portable de esta playlist.
            </DialogDescription>
          </DialogHeader>

          {/* Visual preview card */}
          <div className="px-6 pb-4">
            <div
              ref={cardRef}
              className={cn(
                "relative min-h-[320px] rounded-2xl overflow-hidden p-5 bg-gradient-to-br",
                config.gradient
              )}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {/* Shimmer overlay */}
              {playlist.photo_preview && (
                <img
                  src={playlist.photo_preview}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
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
                  <span className="text-white/80 text-xs font-medium">Memory Playlist · Turn a photo into songs for the moment</span>
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
                onClick={handleCopySummary}
                className="gap-2 rounded-xl h-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <ClipboardList className="w-3.5 h-3.5" />}
                {copied ? "¡Copiado!" : "Copiar lista"}
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
