import { useState } from "react";
import { Check, ClipboardList, Link, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  config: { emoji: string };
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
  const [copied, setCopied] = useState<"list" | "link" | null>(null);

  const playlistEmotion = playlist.emotion ?? "playlist";
  const emotionLabel = EMOTION_LABELS[playlistEmotion] || playlistEmotion;
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
  const trackListText = tracks
    .slice(0, 10)
    .map((track, index) => `${index + 1}. ${track.track_name} - ${track.artist}`)
    .join("\n");
  const shareText = `Mi playlist ${emotionLabel} en Memory Playlist:\n${trackListText}\n\n${portableShareUrl}`;

  const copy = async (value: string, kind: "list" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success(kind === "list" ? "Lista copiada" : "Link copiado");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await copy(shareText, "list");
      return;
    }

    try {
      await navigator.share({
        title: `Playlist ${emotionLabel} en Memory Playlist`,
        text: shareText,
        url: portableShareUrl,
      });
    } catch (err: unknown) {
      if (!(err instanceof DOMException) || err.name !== "AbortError") {
        toast.error("No se pudo compartir");
      }
    }
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
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{config.emoji}</span>
              Compartir playlist
            </DialogTitle>
            <DialogDescription>
              Copia la lista o un enlace que restaura esta playlist.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="mb-3 text-sm font-medium capitalize">{emotionLabel}</p>
            <ol className="space-y-1 text-sm text-muted-foreground">
              {tracks.slice(0, 5).map((track) => (
                <li key={track.id} className="truncate">
                  {track.track_name} - {track.artist}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-2">
            <Button onClick={() => copy(shareText, "list")} className="gap-2 rounded-xl">
              {copied === "list" ? <Check className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
              {copied === "list" ? "Copiado" : "Copiar lista"}
            </Button>
            <Button variant="outline" onClick={() => copy(portableShareUrl, "link")} className="gap-2 rounded-xl">
              {copied === "link" ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
              {copied === "link" ? "Copiado" : "Copiar link"}
            </Button>
            <Button variant="ghost" onClick={handleNativeShare} className="gap-2 rounded-xl">
              <Share2 className="w-4 h-4" />
              Compartir del sistema
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
