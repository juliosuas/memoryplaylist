import { useEffect, useState } from "react";
import { Music, Heart, Sparkles, ArrowLeft, Play, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  track_name: string;
  artist: string;
  album: string | null;
  album_cover?: string;
  is_new_discovery: boolean;
  youtubeId?: string;
}

interface PlaylistResultProps {
  playlistId: string;
  onBack: () => void;
}

const EMOTION_CONFIG: Record<string, { emoji: string; gradient: string }> = {
  enamorado: { emoji: "❤️", gradient: "from-rose-500 to-pink-500" },
  nostálgico: { emoji: "🥲", gradient: "from-amber-500 to-orange-500" },
  feliz: { emoji: "😀", gradient: "from-yellow-400 to-orange-400" },
  relajado: { emoji: "😌", gradient: "from-teal-400 to-cyan-400" },
  nervioso: { emoji: "😬", gradient: "from-purple-500 to-violet-500" },
  triste: { emoji: "😢", gradient: "from-blue-500 to-indigo-500" },
  reflexivo: { emoji: "💭", gradient: "from-slate-500 to-gray-500" },
  motivado: { emoji: "💪", gradient: "from-red-500 to-orange-500" },
  esperanzado: { emoji: "🌈", gradient: "from-green-400 to-emerald-400" },
  libre: { emoji: "😎", gradient: "from-sky-400 to-blue-500" },
};

export const PlaylistResult = ({ playlistId, onBack }: PlaylistResultProps) => {
  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
    const playlistData = playlists.find((p: any) => p.id === playlistId);
    if (playlistData) setPlaylist(playlistData);

    const allTracks = JSON.parse(localStorage.getItem("fryda_tracks") || "[]");
    setTracks(allTracks.filter((t: any) => t.playlist_id === playlistId));
    setLoading(false);
  }, [playlistId]);

  const handleLike = (track: Track) => {
    const prefs = JSON.parse(localStorage.getItem("fryda_preferences") || "[]");
    prefs.push({ id: Date.now().toString(), track_name: track.track_name, artist: track.artist, liked: true, created_at: new Date().toISOString() });
    try { localStorage.setItem("fryda_preferences", JSON.stringify(prefs)); } catch { localStorage.setItem("fryda_preferences", JSON.stringify(prefs.slice(-500))); }
    toast.success("Guardado en favoritos");
  };

  const openYouTubePlaylist = () => {
    const ids = tracks.map((t) => (t as any).youtubeId).filter(Boolean);
    if (ids.length) {
      window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(",")}`, "_blank");
      toast.success("¡Playlist abierta en YouTube!");
    }
  };

  const openSpotifySearch = (track: Track) => {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(`${track.track_name} ${track.artist}`)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Playlist no encontrada</p>
        <Button onClick={onBack}>Volver</Button>
      </div>
    );
  }

  const config = EMOTION_CONFIG[playlist.emotion] || { emoji: "🎵", gradient: "from-primary to-accent" };
  const newCount = tracks.filter((t) => t.is_new_discovery).length;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
        <ArrowLeft className="w-4 h-4" /> Nueva experiencia
      </Button>

      {/* Header */}
      <div className={cn("relative rounded-2xl p-6 text-center overflow-hidden bg-gradient-to-br", config.gradient)}>
        <div className="relative z-10 space-y-3">
          <span className="text-5xl">{config.emoji}</span>
          <h2 className="text-2xl font-bold text-white capitalize">{playlist.emotion}</h2>
          <p className="text-white/80 text-sm">{tracks.length} canciones • {newCount} descubrimientos</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={openYouTubePlaylist} className="flex-1 gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent">
          <Play className="w-4 h-4" /> Reproducir en YouTube
        </Button>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <div key={track.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <span className="w-6 text-sm text-muted-foreground font-mono">{i + 1}</span>
            {track.album_cover && <img src={track.album_cover} alt="" className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{track.track_name}</p>
                {track.is_new_discovery && <Sparkles className="w-3 h-3 text-accent flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" onClick={() => handleLike(track)}><Heart className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => openSpotifySearch(track)}><ExternalLink className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* New playlist button */}
      <Button variant="outline" onClick={onBack} className="w-full h-12 rounded-xl">
        Crear otra playlist
      </Button>
    </div>
  );
};
