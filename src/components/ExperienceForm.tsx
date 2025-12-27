import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, X, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ARTISTS, SONGS } from "@/data/tracks";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SettingsDialog } from "./SettingsDialog";
import { supabase } from "@/integrations/supabase/client";
import { generateSmartPlaylist, getPhotoInsight, PhotoAnalysis, MusicProfile } from "@/lib/playlistGenerator";

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
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [photoInsight, setPhotoInsight] = useState<string | null>(null);

  // Utilidad: comprimir imagen a dataURL JPEG para ahorrar espacio en localStorage
  const compressImage = (file: File, maxWidth = 1024, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoAnalysis(null);
      setPhotoInsight(null);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        
        // Analizar foto con IA automáticamente
        setAnalyzingPhoto(true);
        try {
          const { data, error } = await supabase.functions.invoke('analyze-photo', {
            body: {
              photoBase64: base64,
              selectedMood,
              selectedMomentType,
              selectedTags,
              newMusicPercentage: newMusicPercentage[0],
            },
          });
          
          if (error) {
            console.error("Error analizando foto:", error);
          } else if (data?.photoAnalysis) {
            setPhotoAnalysis(data.photoAnalysis);
            const insight = getPhotoInsight(data.photoAnalysis);
            setPhotoInsight(insight);
            if (insight) {
              toast.success(insight);
            }
          }
        } catch (err) {
          console.error("Error en análisis:", err);
        } finally {
          setAnalyzingPhoto(false);
        }
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
      // Si hay foto y no se ha analizado aún, analizarla
      let currentPhotoAnalysis = photoAnalysis;
      let musicProfile: MusicProfile | null = null;
      
      if (photoPreview && !photoAnalysis) {
        toast.info("Analizando tu foto con IA...");
        try {
          const { data, error } = await supabase.functions.invoke('analyze-photo', {
            body: {
              photoBase64: photoPreview,
              selectedMood,
              selectedMomentType,
              selectedTags,
              newMusicPercentage: newMusicPercentage[0],
            },
          });
          
          if (!error && data?.photoAnalysis) {
            currentPhotoAnalysis = data.photoAnalysis;
            musicProfile = data.musicProfile;
          }
        } catch (err) {
          console.error("Error analizando foto:", err);
        }
      }

      // Generar playlist usando el algoritmo inteligente
      const playlistTracks = generateSmartPlaylist(
        selectedMood,
        selectedMomentType,
        selectedTags,
        newMusicPercentage[0],
        currentPhotoAnalysis,
        musicProfile
      );

      // Preparar tracks para guardar
      const tracksToSave = playlistTracks.map(t => ({
        track_name: t.track_name,
        artist: t.artist,
        album: t.album,
        album_cover: t.album_cover,
        is_new_discovery: !selectedTags.some(tag => 
          tag.type === 'artist' 
            ? t.artist.toLowerCase() === tag.value.toLowerCase()
            : t.track_name.toLowerCase().includes(tag.label.toLowerCase())
        ),
        youtubeId: t.youtubeId || '',
      }));

      // Crear experiencia (sin guardar foto completa en localStorage)
      const experienceId = Date.now().toString();
      const experience = {
        id: experienceId,
        mood: selectedMood,
        moment_type: selectedMomentType,
        tags: selectedTags,
        photo_analysis: currentPhotoAnalysis,
        new_music_percentage: newMusicPercentage[0],
        created_at: new Date().toISOString(),
      };

      const experiences = JSON.parse(localStorage.getItem("fryda_experiences") || "[]");
      experiences.push(experience);
      try {
        localStorage.setItem("fryda_experiences", JSON.stringify(experiences));
      } catch {
        const trimmed = experiences.slice(-20);
        try {
          localStorage.setItem("fryda_experiences", JSON.stringify(trimmed));
        } catch {
          // Ignorar
        }
      }

      // Crear playlist
      const playlistId = Date.now().toString();
      const playlistName = currentPhotoAnalysis 
        ? `Playlist ${selectedMood} • ${getPhotoInsight(currentPhotoAnalysis)?.split(' ')[0] || '📸'}`
        : `Playlist ${selectedMood}`;
      
      const playlist = {
        id: playlistId,
        experience_id: experienceId,
        name: playlistName,
        emotion: selectedMood,
        photo_analysis: currentPhotoAnalysis,
        created_at: new Date().toISOString(),
      };

      const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
      playlists.push(playlist);
      try {
        localStorage.setItem("fryda_playlists", JSON.stringify(playlists));
      } catch {
        const trimmed = playlists.slice(-50);
        try {
          localStorage.setItem("fryda_playlists", JSON.stringify(trimmed));
        } catch {
          // Ignorar
        }
      }

      // Guardar tracks
      const tracks = tracksToSave.map((track, index) => ({
        id: `${playlistId}-${index}`,
        playlist_id: playlistId,
        ...track,
        created_at: new Date().toISOString(),
      }));

      const allTracks = JSON.parse(localStorage.getItem("fryda_tracks") || "[]");
      allTracks.push(...tracks);
      try {
        localStorage.setItem("fryda_tracks", JSON.stringify(allTracks));
      } catch {
        const trimmed = allTracks.slice(-2000);
        try {
          localStorage.setItem("fryda_tracks", JSON.stringify(trimmed));
        } catch {
          // Ignorar
        }
      }

      const insight = currentPhotoAnalysis ? getPhotoInsight(currentPhotoAnalysis) : null;
      toast.success(
        insight 
          ? `¡Playlist personalizada! ${insight}` 
          : `¡Playlist generada! Emoción: ${selectedMood}`
      );
      onPlaylistGenerated(playlistId);

      // Reset form
      setSelectedMood("");
      setSelectedMomentType("");
      setSelectedTags([]);
      setSearchQuery("");
      setPhoto(null);
      setPhotoPreview("");
      setPhotoAnalysis(null);
      setPhotoInsight(null);
      setNewMusicPercentage([50]);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al generar playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SettingsDialog />
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
                {analyzingPhoto && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Analizando foto con IA...</span>
                    </div>
                  </div>
                )}
                {photoInsight && !analyzingPhoto && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                    <span className="text-sm font-medium">{photoInsight}</span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview("");
                    setPhotoAnalysis(null);
                    setPhotoInsight(null);
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
    </>
  );
};
