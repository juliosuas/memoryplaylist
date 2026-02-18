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

const EMOTION_CONFIG: Record<string, { emoji: string; gradient: string; gradientFrom: string; gradientTo: string }> = {
  enamorado: { emoji: "❤️", gradient: "from-rose-500 to-pink-500", gradientFrom: "#f43f5e", gradientTo: "#ec4899" },
  nostálgico: { emoji: "🥲", gradient: "from-amber-500 to-orange-500", gradientFrom: "#f59e0b", gradientTo: "#f97316" },
  feliz: { emoji: "😀", gradient: "from-yellow-400 to-orange-400", gradientFrom: "#facc15", gradientTo: "#fb923c" },
  relajado: { emoji: "😌", gradient: "from-teal-400 to-cyan-400", gradientFrom: "#2dd4bf", gradientTo: "#22d3ee" },
  nervioso: { emoji: "😬", gradient: "from-purple-500 to-violet-500", gradientFrom: "#a855f7", gradientTo: "#8b5cf6" },
  triste: { emoji: "😢", gradient: "from-blue-500 to-indigo-500", gradientFrom: "#3b82f6", gradientTo: "#6366f1" },
  reflexivo: { emoji: "💭", gradient: "from-slate-500 to-gray-500", gradientFrom: "#64748b", gradientTo: "#6b7280" },
  motivado: { emoji: "💪", gradient: "from-red-500 to-orange-500", gradientFrom: "#ef4444", gradientTo: "#f97316" },
  rapero: { emoji: "🎤", gradient: "from-zinc-700 to-gray-600", gradientFrom: "#3f3f46", gradientTo: "#4b5563" },
  esperanzado: { emoji: "🌈", gradient: "from-green-400 to-emerald-400", gradientFrom: "#4ade80", gradientTo: "#34d399" },
  libre: { emoji: "😎", gradient: "from-sky-400 to-blue-500", gradientFrom: "#38bdf8", gradientTo: "#3b82f6" },
};

const CLOSING_MESSAGES: Record<string, { title: string; body: string }> = {
  enamorado: {
    title: "El amor tiene su propia banda sonora 💕",
    body: "Estas canciones guardan la esencia de ese sentimiento. Vuelve a escucharlas cuando quieras revivir ese momento tan especial.",
  },
  nostálgico: {
    title: "Los recuerdos suenan mejor con música 🌅",
    body: "Hay algo mágico en cómo una canción puede transportarte de regreso a un momento exacto. Cuida estos recuerdos, son tuyos para siempre.",
  },
  feliz: {
    title: "La felicidad se siente doble con la canción perfecta 😊",
    body: "La música que te hace sonreír siempre estará aquí. Vuelve cuando quieras revivir este momento tan luminoso.",
  },
  relajado: {
    title: "Respira profundo, este es tu momento de paz 🍃",
    body: "Estas canciones son tu refugio. Guárdalas para esos instantes en que necesitas desconectarte del mundo.",
  },
  nervioso: {
    title: "La música puede calmar hasta el corazón más inquieto 💜",
    body: "Deja que estas canciones te acompañen y recuerda: todo pasa. Este momento también.",
  },
  triste: {
    title: "A veces la música nos entiende mejor que nadie 💙",
    body: "Está bien sentir. La música no juzga, solo acompaña. Esperamos que estas canciones te hagan sentir un poco menos solo/a.",
  },
  reflexivo: {
    title: "Los grandes pensamientos merecen grandes canciones 🌙",
    body: "Dale espacio a tu mente para procesar, crear y soñar. Estas melodías son el fondo perfecto para tus reflexiones más profundas.",
  },
  motivado: {
    title: "Nada puede detenerte con esta energía 🔥",
    body: "Llevas dentro todo lo que necesitas. Esta playlist es el combustible para que lo demuestres. ¡A por todas!",
  },
  rapero: {
    title: "Las mejores rimas nacen de los sentimientos más reales 🎤",
    body: "Cada beat es una historia, cada canción un capítulo. Sigue creando, sigue fluyendo.",
  },
  esperanzado: {
    title: "El futuro suena increíble desde aquí 🌈",
    body: "Hay algo hermoso en creer que lo mejor está por venir. Estas canciones son el soundtrack de tus sueños más grandes.",
  },
  libre: {
    title: "La aventura suena mejor con la música correcta 🌊",
    body: "El mundo es tuyo para explorarlo. Estas canciones son tus compañeras perfectas en cada camino que elijas tomar.",
  },
};

const MOMENT_LABELS: Record<string, string> = {
  vacaciones: "unas vacaciones",
  fiesta: "una fiesta",
  tranquilo: "un día tranquilo",
  despedida: "una despedida",
  concierto: "un concierto",
  noche: "una noche especial",
  inspiracion: "un momento de inspiración",
  evento: "un evento especial",
};

const SCENE_LABELS: Record<string, string> = {
  beach: "playa", forest: "naturaleza", city: "ciudad", mountain: "montaña",
  indoor: "interior", outdoor: "exterior", night: "noche", party: "fiesta",
  concert: "concierto", travel: "viaje", home: "hogar", nature: "naturaleza",
};

function buildDescription(playlist: any): string {
  const parts: string[] = [];

  if (playlist.photo_analysis) {
    const pa = playlist.photo_analysis;
    const scene = SCENE_LABELS[pa.scene] || pa.scene;
    const mood = pa.mood;
    if (scene || mood) {
      parts.push(`Detectamos ${[scene, mood].filter(Boolean).join(" con ambiente ")} en tu foto.`);
    }
  }

  const emotion = playlist.emotion;
  if (emotion) {
    parts.push(`Tu estado de ánimo ${emotion} nos guió para elegir canciones que resuenen contigo.`);
  }

  const moment = playlist.moment_type;
  if (moment && MOMENT_LABELS[moment]) {
    parts.push(`Perfectas para ${MOMENT_LABELS[moment]}.`);
  }

  const pct = playlist.new_music_percentage;
  if (pct !== undefined && pct !== null) {
    if (pct >= 70) {
      parts.push(`Incluimos ${pct}% de canciones nuevas para que descubras algo diferente.`);
    } else if (pct <= 30) {
      parts.push(`Priorizamos tus favoritos conocidos (${100 - pct}%) para que te sientas cómodo/a.`);
    } else {
      parts.push(`Balanceamos ${100 - pct}% de favoritos con ${pct}% de nuevos descubrimientos.`);
    }
  }

  return parts.join(" ");
}

// Track image with fallback
function TrackCover({ src, alt }: { src?: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
        <Music className="w-5 h-5 text-primary/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
      onError={() => setBroken(true)}
    />
  );
}

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

  const config = EMOTION_CONFIG[playlist.emotion] || { emoji: "🎵", gradient: "from-primary to-accent", gradientFrom: "", gradientTo: "" };
  const newCount = tracks.filter((t) => t.is_new_discovery).length;
  const description = buildDescription(playlist);
  const closing = CLOSING_MESSAGES[playlist.emotion];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
        <ArrowLeft className="w-4 h-4" /> Nueva experiencia
      </Button>

      {/* Header with animated gradient shimmer */}
      <div
        className={cn("relative rounded-2xl p-6 text-center overflow-hidden bg-gradient-to-br", config.gradient)}
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient-shift 4s ease infinite",
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.5s infinite",
          }}
        />
        <div className="relative z-10 space-y-3">
          <span className="text-5xl drop-shadow-lg" style={{ animation: "float 3s ease-in-out infinite" }}>
            {config.emoji}
          </span>
          <h2 className="text-2xl font-bold text-white capitalize">{playlist.emotion}</h2>
          <p className="text-white/80 text-sm">{tracks.length} canciones • {newCount} descubrimientos</p>
        </div>
      </div>

      {/* Personalized description */}
      {description && (
        <div
          className="rounded-xl p-4 border border-primary/20 bg-primary/5 animate-fade-up"
          style={{ animationDelay: "0.15s", animationFillMode: "both" }}
        >
          <div className="flex gap-3 items-start">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={openYouTubePlaylist} className="flex-1 gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
          <Play className="w-4 h-4" /> Reproducir en YouTube
        </Button>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all animate-fade-up"
            style={{ animationDelay: `${0.05 + i * 0.04}s`, animationFillMode: "both" }}
          >
            <span className="w-6 text-sm text-muted-foreground font-mono flex-shrink-0">{i + 1}</span>
            <TrackCover src={track.album_cover} alt={track.track_name} />
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

      {/* Personalized closing message */}
      {closing && (
        <div
          className={cn(
            "relative rounded-2xl p-6 overflow-hidden text-center space-y-3 animate-scale-in",
            "bg-gradient-to-br",
            config.gradient
          )}
          style={{ animationDelay: `${0.05 + tracks.length * 0.04 + 0.1}s`, animationFillMode: "both" }}
        >
          {/* Subtle shimmer */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s infinite",
            }}
          />
          <div className="relative z-10 space-y-2">
            <p className="text-white font-bold text-lg leading-tight">{closing.title}</p>
            <p className="text-white/85 text-sm leading-relaxed">{closing.body}</p>
          </div>
        </div>
      )}

      {/* New playlist button */}
      <Button variant="outline" onClick={onBack} className="w-full h-12 rounded-xl">
        Crear otra playlist
      </Button>
    </div>
  );
};
