import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { TRACK_CATALOG, ARTISTS, SONGS } from "@/data/tracks";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface ExperienceFormProps {
  onPlaylistGenerated: (playlistId: string) => void;
}

const MOODS = [
  { id: "enamorado", label: "Enamorado(a)", emoji: "❤️" },
  { id: "nostálgico", label: "Nostálgico(a)", emoji: "🥲" },
  { id: "feliz", label: "Feliz", emoji: "😀" },
  { id: "relajado", label: "Relajado(a)", emoji: "😌" },
  { id: "nervioso", label: "Nervioso(a)", emoji: "😬" },
  { id: "triste", label: "Triste", emoji: "😢" },
  { id: "reflexivo", label: "Reflexivo(a)", emoji: "💭" },
  { id: "motivado", label: "Motivado(a)", emoji: "💪" },
  { id: "esperanzado", label: "Esperanzado(a)", emoji: "🌈" },
  { id: "libre", label: "Libre / Aventurero(a)", emoji: "😎" },
];

const MOMENT_TYPES = [
  { id: "vacaciones", label: "Vacaciones o viaje", emoji: "🏖️" },
  { id: "fiesta", label: "Fiesta o celebración", emoji: "💃" },
  { id: "tranquilo", label: "Día tranquilo", emoji: "🏡" },
  { id: "despedida", label: "Despedida o cierre", emoji: "💔" },
  { id: "concierto", label: "Concierto o música en vivo", emoji: "🎶" },
  { id: "noche", label: "Noche especial", emoji: "🌃" },
  { id: "inspiracion", label: "Inspiración o creación", emoji: "💡" },
  { id: "evento", label: "Sesión de fotos o evento", emoji: "📸" },
];

export const ExperienceForm = ({ onPlaylistGenerated }: ExperienceFormProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedMomentType, setSelectedMomentType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<{ type: 'artist' | 'song'; value: string; label: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [newMusicPercentage, setNewMusicPercentage] = useState<number[]>([50]);
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
      toast.error("Por favor selecciona cómo te sentiste en ese momento");
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
        moment_type: selectedMomentType,
        tags: selectedTags,
        photo_url: photoUrl,
        new_music_percentage: newMusicPercentage[0],
        created_at: new Date().toISOString(),
      };

      const experiences = JSON.parse(localStorage.getItem("fryda_experiences") || "[]");
      experiences.push(experience);
      localStorage.setItem("fryda_experiences", JSON.stringify(experiences));

      // Shuffle helper
      const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      // Identificar canciones conocidas (de artistas o canciones ingresadas por el usuario)
      const knownSongs = TRACK_CATALOG.filter(track => 
        selectedTags.some(tag => {
          if (tag.type === 'artist') {
            return track.artist.toLowerCase() === tag.value.toLowerCase();
          } else {
            return track.id === tag.value || track.track_name.toLowerCase().includes(tag.label.toLowerCase());
          }
        })
      );

      // Identificar música nueva del mismo mood (excluyendo las conocidas)
      const newSongs = TRACK_CATALOG.filter(track => 
        track.moods.includes(selectedMood) && 
        !knownSongs.some(known => known.id === track.id)
      );

      // Calcular cantidad de canciones según el porcentaje del slider
      const percentage = newMusicPercentage[0];
      const targetSize = 25;
      let countKnown = 0;
      let countNew = 0;

      if (percentage === 0) {
        // 0%: Solo canciones conocidas
        countKnown = targetSize;
        countNew = 0;
      } else if (percentage === 100) {
        // 100%: Solo música nueva
        countKnown = 0;
        countNew = targetSize;
      } else if (percentage <= 49) {
        // 1-49%: Mayoría conocidas (70-90%)
        const knownRatio = 0.9 - (percentage / 49) * 0.2; // 0.9 a 0.7
        countKnown = Math.round(targetSize * knownRatio);
        countNew = targetSize - countKnown;
      } else {
        // 50-99%: De 50/50 a casi todas nuevas
        const ratio = percentage / 100;
        countKnown = Math.round(targetSize * (1 - ratio));
        countNew = targetSize - countKnown;
      }

      // Seleccionar canciones
      const selectedKnown = shuffleArray(knownSongs).slice(0, countKnown);
      const selectedNew = shuffleArray(newSongs).slice(0, countNew);
      
      let playlistTracks = [...selectedKnown, ...selectedNew];

      // Si no llegamos a 20 canciones, completar con canciones aleatorias del mood
      if (playlistTracks.length < 20) {
        const allMoodTracks = TRACK_CATALOG.filter(t => 
          t.moods.includes(selectedMood) && 
          !playlistTracks.find(pt => pt.id === t.id)
        );
        playlistTracks.push(...shuffleArray(allMoodTracks).slice(0, 20 - playlistTracks.length));
      }

      // Si aún no llegamos a 20, usar todo el catálogo
      if (playlistTracks.length < 20) {
        const allRemaining = TRACK_CATALOG.filter(t => 
          !playlistTracks.find(pt => pt.id === t.id)
        );
        playlistTracks.push(...shuffleArray(allRemaining).slice(0, 20 - playlistTracks.length));
      }

      // Shuffle final para mezclar conocidas y nuevas
      playlistTracks = shuffleArray(playlistTracks).slice(0, targetSize);

      const mockTracks = playlistTracks.map(t => ({
        track_name: t.track_name,
        artist: t.artist,
        album: t.album,
        album_cover: t.album_cover,
        is_new_discovery: !knownSongs.some(known => known.id === t.id),
        youtubeId: t.youtubeId || '',
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
      setSelectedMomentType("");
      setSelectedTags([]);
      setSearchQuery("");
      setPhoto(null);
      setPhotoPreview("");
      setNewMusicPercentage([50]);
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
          Revive tu Memoria
        </h2>
        <p className="text-muted-foreground">
          Recuerda ese momento especial y crea una playlist que capture su esencia.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Selección de Mood */}
        <div className="space-y-3">
          <Label className="text-foreground text-lg">¿Cómo te sentiste en ese momento?</Label>
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

        {/* Selección de tipo de momento */}
        <div className="space-y-3">
          <Label className="text-foreground text-lg">¿Qué tipo de momento fue?</Label>
          <div className="grid grid-cols-2 gap-2">
            {MOMENT_TYPES.map((type) => (
              <Button
                key={type.id}
                type="button"
                variant={selectedMomentType === type.id ? "default" : "outline"}
                className={`h-auto py-3 flex flex-col items-center gap-1 ${
                  selectedMomentType === type.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedMomentType(type.id)}
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className="text-xs text-center">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Autocompletar de artistas/canciones */}
        <div className="space-y-3">
          <Label className="text-foreground">Artistas o canciones que recuerdes</Label>
          <div className="relative">
            <Input
              placeholder="Agrega artistas o canciones que recuerdes de ese momento..."
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

        {/* Slider de música nueva */}
        <div className="space-y-3">
          <Label className="text-foreground text-lg">
            ¿Qué porcentaje de música nueva te gustaría descubrir?
          </Label>
          <div className="space-y-2">
            <Slider
              value={newMusicPercentage}
              onValueChange={setNewMusicPercentage}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conocida</span>
              <span className="font-semibold text-foreground">{newMusicPercentage[0]}% nueva</span>
              <span>Nueva</span>
            </div>
          </div>
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
