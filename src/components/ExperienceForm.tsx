import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { TRACK_CATALOG, ARTISTS, SONGS } from "@/data/tracks";
import { Badge } from "@/components/ui/badge";

interface ExperienceFormProps {
  onPlaylistGenerated: (playlistId: string) => void;
}

const MOODS = [
  { id: "feliz", label: "Feliz", emoji: "😀" },
  { id: "nostálgico", label: "Nostálgico", emoji: "🥲" },
  { id: "chill", label: "Chill / Relajado", emoji: "😌" },
  { id: "triste", label: "Triste", emoji: "😢" },
  { id: "energético", label: "Energético", emoji: "⚡" },
  { id: "enamorado", label: "Enamorado", emoji: "❤️" },
  { id: "nervioso", label: "Nervioso", emoji: "😬" },
  { id: "melancólico", label: "Melancólico", emoji: "🌧️" },
  { id: "motivado", label: "Motivado / Enfocado", emoji: "💪" },
];

export const ExperienceForm = ({ onPlaylistGenerated }: ExperienceFormProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<{ type: 'artist' | 'song'; value: string; label: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (type: 'artist' | 'song', value: string, label: string) => {
    if (!selectedTags.find(t => t.value === value)) {
      setSelectedTags([...selectedTags, { type, value, label }]);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const removeTag = (value: string) => {
    setSelectedTags(selectedTags.filter(t => t.value !== value));
  };

  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const artistMatches = ARTISTS
      .filter(artist => artist.toLowerCase().includes(query))
      .slice(0, 5)
      .map(artist => ({ type: 'artist' as const, value: artist, label: artist }));
    
    const songMatches = SONGS
      .filter(song => song.label.toLowerCase().includes(query))
      .slice(0, 5)
      .map(song => ({ type: 'song' as const, value: song.value, label: song.label }));
    
    return [...artistMatches, ...songMatches].slice(0, 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error("Por favor selecciona un estado de ánimo");
      return;
    }

    setLoading(true);
    try {
      let photoUrl = null;

      // Convertir foto a base64 si existe
      if (photo) {
        const reader = new FileReader();
        photoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
        });
      }

      // Crear experiencia en localStorage
      const experienceId = Date.now().toString();
      const experience = {
        id: experienceId,
        mood: selectedMood,
        tags: selectedTags,
        photo_url: photoUrl,
        created_at: new Date().toISOString(),
      };

      const experiences = JSON.parse(localStorage.getItem("fryda_experiences") || "[]");
      experiences.push(experience);
      localStorage.setItem("fryda_experiences", JSON.stringify(experiences));

      // Generar playlist basada en mood y tags
      let candidateTracks = TRACK_CATALOG.filter(t => t.moods.includes(selectedMood));
      
      // Garantizar que cada tag tenga al menos 1 canción
      const guaranteedTracks: typeof TRACK_CATALOG = [];
      selectedTags.forEach(tag => {
        if (tag.type === 'artist') {
          const artistTrack = TRACK_CATALOG.find(t => 
            t.artist === tag.value && !guaranteedTracks.find(gt => gt.id === t.id)
          );
          if (artistTrack) guaranteedTracks.push(artistTrack);
        } else {
          const songTrack = TRACK_CATALOG.find(t => t.id === tag.value);
          if (songTrack && !guaranteedTracks.find(gt => gt.id === songTrack.id)) {
            guaranteedTracks.push(songTrack);
          }
        }
      });

      // Priorizar canciones de artistas seleccionados
      const artistTags = selectedTags.filter(t => t.type === 'artist').map(t => t.value);
      const priorityTracks = candidateTracks.filter(t => 
        artistTags.includes(t.artist) && !guaranteedTracks.find(gt => gt.id === t.id)
      );

      // Completar con canciones del mood
      const remainingTracks = candidateTracks.filter(t => 
        !guaranteedTracks.find(gt => gt.id === t.id) && 
        !priorityTracks.find(pt => pt.id === t.id)
      );

      // Shuffle y combinar para llegar a mínimo 20 canciones
      const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const playlistTracks = [
        ...guaranteedTracks,
        ...shuffleArray(priorityTracks).slice(0, 10),
        ...shuffleArray(remainingTracks),
      ].slice(0, 25); // Máximo 25 canciones

      // Si no llegamos a 20, completar con canciones aleatorias del catálogo
      if (playlistTracks.length < 20) {
        const allRemaining = TRACK_CATALOG.filter(t => 
          !playlistTracks.find(pt => pt.id === t.id)
        );
        playlistTracks.push(...shuffleArray(allRemaining).slice(0, 20 - playlistTracks.length));
      }

      const mockTracks = playlistTracks.map(t => ({
        track_name: t.track_name,
        artist: t.artist,
        album: t.album,
        album_cover: t.album_cover,
        is_new_discovery: t.is_new_discovery || Math.random() > 0.6,
      }));

      const playlistId = Date.now().toString();
      const playlist = {
        id: playlistId,
        experience_id: experienceId,
        name: `Playlist ${selectedMood}`,
        emotion: selectedMood,
        created_at: new Date().toISOString(),
      };

      const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
      playlists.push(playlist);
      localStorage.setItem("fryda_playlists", JSON.stringify(playlists));

      // Guardar tracks
      const tracks = mockTracks.map((track, index) => ({
        id: `${playlistId}-${index}`,
        playlist_id: playlistId,
        ...track,
        created_at: new Date().toISOString(),
      }));

      const allTracks = JSON.parse(localStorage.getItem("fryda_tracks") || "[]");
      allTracks.push(...tracks);
      localStorage.setItem("fryda_tracks", JSON.stringify(allTracks));

      toast.success(`¡Playlist generada! Emoción: ${selectedMood}`);
      onPlaylistGenerated(playlistId);

      // Reset form
      setSelectedMood("");
      setSelectedTags([]);
      setSearchQuery("");
      setPhoto(null);
      setPhotoPreview("");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al generar playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-[var(--shadow-soft)] backdrop-blur-sm bg-card/80">
      {/* Hero Title */}
      <div className="text-center py-8">
        <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Fryda
        </h1>
        <p className="text-muted-foreground italic">Every memory has its song</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Crea tu Playlist
        </h2>
        <p className="text-muted-foreground">
          Elige tu estado de ánimo y añade artistas o canciones para personalizar tu experiencia musical.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Mood */}
        <div className="space-y-3">
          <Label className="text-foreground text-lg">¿Cómo te sientes?</Label>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((mood) => (
              <Button
                key={mood.id}
                type="button"
                variant={selectedMood === mood.id ? "default" : "outline"}
                className={`h-auto py-3 flex flex-col items-center gap-1 ${
                  selectedMood === mood.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedMood(mood.id)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
        </div>
        {/* Upload de foto */}
        <div className="space-y-2">
          <Label htmlFor="photo" className="text-foreground">Foto (opcional)</Label>
          <div className="relative">
            {photoPreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview("");
                  }}
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click para subir una foto</span>
              </label>
            )}
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Autocompletar de artistas/canciones */}
        <div className="space-y-3">
          <Label className="text-foreground">Artistas o canciones (opcional)</Label>
          <div className="relative">
            <Input
              placeholder="Busca un artista o canción..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="border-input focus:ring-primary"
            />
            {showSuggestions && searchQuery && getSuggestions().length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {getSuggestions().map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2"
                    onClick={() => addTag(suggestion.type, suggestion.value, suggestion.label)}
                  >
                    <Badge variant={suggestion.type === 'artist' ? 'default' : 'secondary'} className="text-xs">
                      {suggestion.type === 'artist' ? '🎤' : '🎵'}
                    </Badge>
                    <span className="text-sm">{suggestion.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag.value} variant="outline" className="gap-1 pr-1">
                <span>{tag.type === 'artist' ? '🎤' : '🎵'} {tag.label}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag.value)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">
            Cada artista o canción que agregues estará representado en tu playlist final.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="gradient"
          className="w-full"
        >
          {loading ? (
            "Generando tu playlist..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Playlist
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
