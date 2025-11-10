import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Track {
  id: string;
  track_name: string;
  artist: string;
  album: string | null;
  is_new_discovery: boolean;
}

interface PlaylistResultProps {
  playlistId: string;
  onBack: () => void;
}

export const PlaylistResult = ({ playlistId, onBack }: PlaylistResultProps) => {
  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  const loadPlaylist = async () => {
    try {
      // Cargar desde localStorage
      const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
      const playlistData = playlists.find((p: any) => p.id === playlistId);

      if (!playlistData) throw new Error("Playlist no encontrada");
      setPlaylist(playlistData);

      const allTracks = JSON.parse(localStorage.getItem("fryda_tracks") || "[]");
      const tracksData = allTracks.filter((t: any) => t.playlist_id === playlistId);
      setTracks(tracksData || []);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error al cargar playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTrack = async (track: Track) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("fryda_current_user") || "null");
      if (!currentUser) return;

      const preferences = JSON.parse(localStorage.getItem("fryda_preferences") || "[]");
      preferences.push({
        id: Date.now().toString(),
        user_id: currentUser.id,
        track_name: track.track_name,
        artist: track.artist,
        liked: true,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("fryda_preferences", JSON.stringify(preferences));

      toast.success("Guardado en tus favoritos");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar favorito");
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </Card>
    );
  }

  if (!playlist) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Playlist no encontrada</p>
        <Button onClick={onBack} className="mt-4">
          Volver
        </Button>
      </Card>
    );
  }

  const getEmotionEmoji = (emotion: string) => {
    const emotions: Record<string, string> = {
      feliz: "😊",
      nostálgico: "🌅",
      energético: "⚡",
      melancólico: "🌙",
      tranquilo: "🌊",
      romántico: "💕",
      motivado: "🔥",
    };
    return emotions[emotion.toLowerCase()] || "🎵";
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Nueva Experiencia
      </Button>

      <Card className="p-6 space-y-6 shadow-[var(--shadow-glow)] backdrop-blur-sm bg-gradient-to-br from-card to-secondary/20">
        {/* Emoción detectada */}
        <div className="text-center space-y-3 pb-6 border-b border-border">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent text-4xl">
            {getEmotionEmoji(playlist.emotion)}
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {playlist.emotion}
            </h2>
            <p className="text-muted-foreground mt-1">Tu banda sonora emocional</p>
          </div>
        </div>

        {/* Lista de canciones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              {tracks.length} Canciones
            </h3>
            {playlist.discovery_percentage > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-accent" />
                {tracks.filter((t) => t.is_new_discovery).length} nuevas
              </span>
            )}
          </div>

          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="text-sm font-mono text-muted-foreground w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{track.track_name}</h4>
                      {track.is_new_discovery && (
                        <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleLikeTrack(track)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Crear Otra Playlist
          </Button>
        </div>
      </Card>
    </div>
  );
};
