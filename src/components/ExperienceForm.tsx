import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ExperienceFormProps {
  onPlaylistGenerated: (playlistId: string) => void;
}

export const ExperienceForm = ({ onPlaylistGenerated }: ExperienceFormProps) => {
  const [description, setDescription] = useState("");
  const [musicListened, setMusicListened] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [discoveryPercentage, setDiscoveryPercentage] = useState([50]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Por favor describe tu experiencia");
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
        description,
        photo_url: photoUrl,
        created_at: new Date().toISOString(),
      };

      const experiences = JSON.parse(localStorage.getItem("fryda_experiences") || "[]");
      experiences.push(experience);
      localStorage.setItem("fryda_experiences", JSON.stringify(experiences));

      // Mock análisis emocional
      const emotions = ["feliz", "nostálgico", "energético", "melancólico", "tranquilo", "romántico", "motivado"];
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];

      // Catálogo de canciones por género/artista
      const musicCatalog: Record<string, Array<{track_name: string, artist: string, album: string, is_new_discovery: boolean}>> = {
        "rock": [
          { track_name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", is_new_discovery: false },
          { track_name: "R U Mine?", artist: "Arctic Monkeys", album: "AM", is_new_discovery: true },
          { track_name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", is_new_discovery: false },
          { track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", is_new_discovery: true },
        ],
        "jazz": [
          { track_name: "Take Five", artist: "Dave Brubeck", album: "Time Out", is_new_discovery: false },
          { track_name: "So What", artist: "Miles Davis", album: "Kind of Blue", is_new_discovery: true },
          { track_name: "Autumn Leaves", artist: "Bill Evans", album: "Portrait in Jazz", is_new_discovery: false },
          { track_name: "My Funny Valentine", artist: "Chet Baker", album: "Chet Baker Sings", is_new_discovery: true },
        ],
        "lofi": [
          { track_name: "We'll Be Fine", artist: "Jinsang", album: "Solitude", is_new_discovery: false },
          { track_name: "Affection", artist: "Jinsang", album: "Life", is_new_discovery: true },
          { track_name: "Coffee", artist: "Idealism", album: "Rainy Evening", is_new_discovery: false },
          { track_name: "Apartment", artist: "Tusken", album: "Dreams", is_new_discovery: true },
        ],
        "pop": [
          { track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", is_new_discovery: false },
          { track_name: "Shake It Off", artist: "Taylor Swift", album: "1989", is_new_discovery: true },
          { track_name: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", is_new_discovery: false },
          { track_name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", is_new_discovery: true },
        ],
        "indie": [
          { track_name: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", is_new_discovery: false },
          { track_name: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", is_new_discovery: true },
          { track_name: "Somebody Else", artist: "The 1975", album: "I Like It When You Sleep", is_new_discovery: false },
          { track_name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", is_new_discovery: true },
        ],
        "classic": [
          { track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", is_new_discovery: false },
          { track_name: "Let It Be", artist: "The Beatles", album: "Let It Be", is_new_discovery: true },
          { track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", is_new_discovery: false },
          { track_name: "Hotel California", artist: "Eagles", album: "Hotel California", is_new_discovery: true },
        ],
      };

      // Función para seleccionar canciones basadas en la música escuchada
      const selectTracksBasedOnMusic = (musicText: string): Array<{track_name: string, artist: string, album: string, is_new_discovery: boolean}> => {
        const lowerText = musicText.toLowerCase();
        let selectedTracks: Array<{track_name: string, artist: string, album: string, is_new_discovery: boolean}> = [];
        
        // Buscar coincidencias con géneros
        Object.keys(musicCatalog).forEach(genre => {
          if (lowerText.includes(genre)) {
            selectedTracks.push(...musicCatalog[genre]);
          }
        });

        // Buscar coincidencias con artistas específicos
        if (lowerText.includes("arctic monkeys") || lowerText.includes("arctic")) {
          selectedTracks.push(...musicCatalog["indie"].filter(t => t.artist.includes("Arctic Monkeys")));
        }
        if (lowerText.includes("beatles")) {
          selectedTracks.push(...musicCatalog["classic"].filter(t => t.artist.includes("Beatles")));
        }
        if (lowerText.includes("queen")) {
          selectedTracks.push(...musicCatalog["rock"].filter(t => t.artist.includes("Queen")));
        }

        // Si no hay coincidencias, usar canciones por defecto
        if (selectedTracks.length === 0) {
          selectedTracks = [
            { track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", is_new_discovery: false },
            { track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", is_new_discovery: true },
            { track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", is_new_discovery: false },
            { track_name: "Walking On Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", is_new_discovery: true },
            { track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", is_new_discovery: false },
          ];
        }

        // Limitar a 5 canciones únicas
        const uniqueTracks = Array.from(new Map(selectedTracks.map(t => [t.track_name, t])).values());
        return uniqueTracks.slice(0, 5);
      };

      // Seleccionar canciones basadas en la música escuchada
      const mockTracks = musicListened.trim() 
        ? selectTracksBasedOnMusic(musicListened)
        : [
            { track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", is_new_discovery: false },
            { track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", is_new_discovery: true },
            { track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", is_new_discovery: false },
            { track_name: "Walking On Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", is_new_discovery: true },
            { track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", is_new_discovery: false },
          ];

      const playlistId = Date.now().toString();
      const playlist = {
        id: playlistId,
        experience_id: experienceId,
        name: `Playlist ${detectedEmotion}`,
        emotion: detectedEmotion,
        discovery_percentage: discoveryPercentage[0],
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

      toast.success(`¡Playlist generada! Emoción: ${detectedEmotion}`);
      onPlaylistGenerated(playlistId);

      // Reset form
      setDescription("");
      setMusicListened("");
      setPhoto(null);
      setPhotoPreview("");
      setDiscoveryPercentage([50]);
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
          Comparte tu Momento
        </h2>
        <p className="text-muted-foreground">
          Describe lo que sientes, los olores, las sensaciones... Nosotros crearemos la banda sonora perfecta.
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

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Describe tu experiencia
          </Label>
          <Textarea
            id="description"
            placeholder="Estoy en la playa al atardecer, siento la brisa salada, el aroma del mar... me siento nostálgico pero en paz..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="resize-none border-input focus:ring-primary"
            required
          />
        </div>

        {/* Música escuchada */}
        <div className="space-y-2">
          <Label htmlFor="musicListened" className="text-foreground">
            ¿Qué canciones, artistas o géneros escuchaste durante este momento?
          </Label>
          <Textarea
            id="musicListened"
            placeholder="Ejemplo: Arctic Monkeys, jazz suave, playlist de lo-fi, etc."
            value={musicListened}
            onChange={(e) => setMusicListened(e.target.value)}
            rows={3}
            className="resize-none border-input focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground italic">
            Entre más detalles des de la música que escuchaste ese día o en esa experiencia, mejor podrá Fryda ajustar la playlist a tu recuerdo.
          </p>
        </div>

        {/* Slider de descubrimiento */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground">Descubrimiento</Label>
            <span className="text-sm font-medium text-primary">{discoveryPercentage[0]}%</span>
          </div>
          <Slider
            value={discoveryPercentage}
            onValueChange={setDiscoveryPercentage}
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {discoveryPercentage[0] < 30
              ? "Más canciones familiares"
              : discoveryPercentage[0] > 70
              ? "Más canciones nuevas para descubrir"
              : "Balance entre familiar y nuevo"}
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
