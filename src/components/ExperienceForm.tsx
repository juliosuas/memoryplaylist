import { useState } from "react";
import { toast } from "sonner";
import { generateSmartPlaylist, getPhotoInsight, PhotoAnalysis, MusicProfile } from "@/lib/playlistGenerator";
import { saveGeneratedPlaylist } from "@/lib/localPlaylistStore";
import {
  analyzePhotoWithRetry,
  describePhotoAnalysisError,
  isPhotoAnalysisConfigured,
  type PhotoAnalysisErrorCode,
} from "@/lib/photoAnalysis";

import { PhotoUpload } from "./fryda/PhotoUpload";
import { ArtistSearch } from "./fryda/ArtistSearch";
import { FormSection } from "./fryda/FormSection";
import { GenerateButton } from "./fryda/GenerateButton";
import { PlaylistLoader } from "./fryda/PlaylistLoader";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const DEFAULT_DISCOVERY_PERCENTAGE = 15;

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("No pudimos leer la imagen."));
    };
    reader.onerror = () => reject(new Error("No pudimos leer la imagen."));
    reader.readAsDataURL(file);
  });
}

async function normalizePhotoForBrowser(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("La imagen es demasiado grande. Prueba con una foto menor a 12 MB.");
  }

  if (!file.type.startsWith("image/") && !isHeicLike(file)) {
    throw new Error("Solo se permiten imágenes (JPG, PNG, WebP o HEIC de iPhone).");
  }

  if (!isHeicLike(file)) {
    return readFileAsDataUrl(file);
  }

  try {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.82,
    });
    const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
    return readFileAsDataUrl(jpegBlob);
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Tu iPhone mandó una foto HEIC y no pudimos convertirla. Exporta/manda la foto como JPG e inténtalo otra vez.");
  }
}

interface ExperienceFormProps {
  onPlaylistGenerated: (playlistId: string) => void;
}

const MOODS = [
  { id: "enamorado", label: "Enamorado", emoji: "❤️" },
  { id: "nostálgico", label: "Nostálgico", emoji: "🥲" },
  { id: "feliz", label: "Feliz", emoji: "😀" },
  { id: "relajado", label: "Relajado", emoji: "😌" },
  { id: "nervioso", label: "Nervioso", emoji: "😬" },
  { id: "triste", label: "Triste", emoji: "😢" },
  { id: "reflexivo", label: "Reflexivo", emoji: "💭" },
  { id: "motivado", label: "Motivado", emoji: "💪" },
  { id: "rapero", label: "Rapero", emoji: "🎤" },
  { id: "esperanzado", label: "Esperanzado", emoji: "🌈" },
  { id: "libre", label: "Libre", emoji: "😎" },
];

function deriveMoodFromPhoto(photoAnalysis: PhotoAnalysis | null): string {
  if (!photoAnalysis) return "relajado";

  const moodMap: Record<string, string> = {
    happy: "feliz",
    melancholic: "nostálgico",
    energetic: "motivado",
    peaceful: "relajado",
    romantic: "enamorado",
    nostalgic: "nostálgico",
    adventurous: "libre",
  };

  if (photoAnalysis.mood && moodMap[photoAnalysis.mood]) {
    return moodMap[photoAnalysis.mood];
  }

  if ((photoAnalysis.energy ?? 5) >= 8) return "motivado";
  if ((photoAnalysis.energy ?? 5) <= 3) return "reflexivo";
  if (photoAnalysis.timeOfDay === "night") return "nostálgico";

  return "relajado";
}

function deriveMomentFromPhoto(photoAnalysis: PhotoAnalysis | null): string {
  if (!photoAnalysis) return "tranquilo";

  const sceneMap: Record<string, string> = {
    beach: "vacaciones",
    city: photoAnalysis.timeOfDay === "night" ? "noche" : "evento",
    nature: "tranquilo",
    party: "fiesta",
    concert: "concierto",
    sunset: "noche",
    mountain: "vacaciones",
    road: "vacaciones",
    cafe: "inspiracion",
    indoor: photoAnalysis.timeOfDay === "night" ? "noche" : "tranquilo",
  };

  if (photoAnalysis.scene && sceneMap[photoAnalysis.scene]) {
    return sceneMap[photoAnalysis.scene];
  }

  if (photoAnalysis.activity === "celebrating") return "fiesta";
  if (photoAnalysis.timeOfDay === "night") return "noche";

  return "tranquilo";
}

// Compress image to max 1200px and JPEG 0.7 quality
function resizeImage(base64: string, maxWidth = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64); // fallback to original
    img.src = base64;
  });
}

export const ExperienceForm = ({ onPlaylistGenerated }: ExperienceFormProps) => {
  const [selectedTags, setSelectedTags] = useState<Array<{ type: "artist" | "song"; value: string; label: string }>>([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [photoInsight, setPhotoInsight] = useState<string | null>(null);
  const [photoMusicProfile, setPhotoMusicProfile] = useState<MusicProfile | null>(null);
  const [photoError, setPhotoError] = useState<PhotoAnalysisErrorCode | null>(null);
  const [photoAnalysisSignature, setPhotoAnalysisSignature] = useState("");
  const [backendReady] = useState<boolean>(isPhotoAnalysisConfigured());

  const getAnalysisSignature = (photo = photoPreview) => JSON.stringify({
    photo: photo ? photo.slice(0, 80) : "",
    tags: selectedTags.map((t) => `${t.type}:${t.value}`).sort(),
    discovery: DEFAULT_DISCOVERY_PERCENTAGE,
  });

  const runPhotoAnalysis = async (compressedBase64: string, signature = getAnalysisSignature()) => {
    setAnalyzingPhoto(true);
    setPhotoError(null);

    try {
      const result = await analyzePhotoWithRetry({
        photoBase64: compressedBase64,
        selectedMood: "",
        selectedMomentType: "",
        selectedTags,
        newMusicPercentage: DEFAULT_DISCOVERY_PERCENTAGE,
      });

      if (result.data?.photoAnalysis) {
        const analysis = result.data.photoAnalysis as unknown as PhotoAnalysis;
        const musicProfile = (result.data.musicProfile as unknown as MusicProfile) ?? null;
        setPhotoAnalysis(analysis);
        setPhotoMusicProfile(musicProfile);
        setPhotoAnalysisSignature(signature);
        const insight = getPhotoInsight(analysis);
        setPhotoInsight(insight);
        if (insight) toast.success(insight);
        return { analysis, musicProfile };
      }

      const code = result.error ?? "unknown";
      console.error(`Photo analysis failed after ${result.attempts} attempts:`, code);
      setPhotoError(code);
      toast.error(describePhotoAnalysisError(code));
      return null;
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handlePhotoChange = async (file: File) => {
    setPhotoAnalysis(null);
    setPhotoInsight(null);
    setPhotoMusicProfile(null);
    setPhotoError(null);

    try {
      const raw = await normalizePhotoForBrowser(file);
      const compressed = await resizeImage(raw);
      setPhotoPreview(compressed);
      if (!backendReady) {
        toast.message("Analizando localmente mientras se publica el backend de IA.");
      }
      await runPhotoAnalysis(compressed, getAnalysisSignature(compressed));
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos cargar la imagen.";
      toast.error(message);
      setPhotoError("bad_request");
    }
  };

  const handleRetryAnalysis = async () => {
    if (!photoPreview || analyzingPhoto) return;
    await runPhotoAnalysis(photoPreview);
  };

  const handlePhotoRemove = () => {
    setPhotoPreview("");
    setPhotoAnalysis(null);
    setPhotoInsight(null);
    setPhotoMusicProfile(null);
    setPhotoError(null);
    setPhotoAnalysisSignature("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      toast.error("Sube una foto para que Fryda detecte el mood y arme la playlist.");
      return;
    }

    setLoading(true);
    try {
      const signature = getAnalysisSignature();
      let currentPhotoAnalysis = photoAnalysis;
      let musicProfile: MusicProfile | null = photoMusicProfile;

      // The user may upload the photo first and choose mood/moment/tags after.
      // Re-analyze right before generation when those inputs changed so the
      // photo -> music profile path is always current, not stale.
      if (photoPreview && (!currentPhotoAnalysis || photoAnalysisSignature !== signature)) {
        const refreshed = await runPhotoAnalysis(photoPreview, signature);
        if (refreshed) {
          currentPhotoAnalysis = refreshed.analysis;
          musicProfile = refreshed.musicProfile;
        } else if (!currentPhotoAnalysis) {
          toast.message("Seguiremos con una playlist local para no bloquearte.");
        }
      }

      const detectedMood = deriveMoodFromPhoto(currentPhotoAnalysis);
      const detectedMoment = deriveMomentFromPhoto(currentPhotoAnalysis);

      const playlistTracks = generateSmartPlaylist(
        detectedMood,
        detectedMoment,
        selectedTags,
        DEFAULT_DISCOVERY_PERCENTAGE,
        currentPhotoAnalysis,
        musicProfile
      );

      if (!playlistTracks || playlistTracks.length === 0) {
        console.error("Playlist generator returned empty tracks");
        toast.error("No pudimos armar la playlist. Intenta con otro mood.");
        setLoading(false);
        return;
      }

      const tracksToSave = playlistTracks.map((t) => ({
        track_name: t.track_name,
        artist: t.artist,
        album: t.album,
        album_cover: t.album_cover,
        is_new_discovery: !selectedTags.some((tag) =>
          tag.type === "artist"
            ? t.artist.toLowerCase() === tag.value.toLowerCase()
            : t.id === tag.value
        ),
        youtubeId: t.youtubeId || "",
      }));

      const experienceId = Date.now().toString();
      const experience = {
        id: experienceId,
        mood: detectedMood,
        moment_type: detectedMoment,
        tags: selectedTags,
        photo_analysis: currentPhotoAnalysis,
        new_music_percentage: DEFAULT_DISCOVERY_PERCENTAGE,
        created_at: new Date().toISOString(),
      };

      const playlistId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const moodLabel = MOODS.find((m) => m.id === detectedMood)?.emoji || "📸";
      const playlistName = currentPhotoAnalysis
        ? `${moodLabel} ${detectedMood} • ${getPhotoInsight(currentPhotoAnalysis)?.split(" ").slice(0, 2).join(" ") || "foto"}`
        : `${moodLabel} Playlist de tu foto`;

      const playlist = {
        id: playlistId,
        experience_id: experienceId,
        name: playlistName,
        emotion: detectedMood,
        moment_type: detectedMoment,
        new_music_percentage: DEFAULT_DISCOVERY_PERCENTAGE,
        tags: selectedTags,
        photo_analysis: currentPhotoAnalysis,
        created_at: new Date().toISOString(),
      };

      const tracks = tracksToSave.map((track, index) => ({
        id: `${playlistId}-${index}`,
        playlist_id: playlistId,
        ...track,
        created_at: new Date().toISOString(),
      }));

      const persisted = saveGeneratedPlaylist({ experience, playlist, tracks });
      if (!persisted) {
        toast.message("Tu navegador no permitió guardar todo, pero abriremos tu playlist ahora mismo.");
      }

      // Brief transition so generation feels intentional without slowing the demo.
      await new Promise((r) => setTimeout(r, 1400));

      const insight = currentPhotoAnalysis ? getPhotoInsight(currentPhotoAnalysis) : null;
      toast.success(insight ? `¡Playlist creada! ${insight}` : "¡Playlist generada con éxito!");
      setLoading(false);
      onPlaylistGenerated(playlistId);

      // Reset
      setSelectedTags([]);
      setPhotoPreview("");
      setPhotoAnalysis(null);
      setPhotoInsight(null);
      setPhotoMusicProfile(null);
      setPhotoError(null);
      setPhotoAnalysisSignature("");
    } catch (error: unknown) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al generar playlist");
    } finally {
      setLoading(false);
    }
  };

  // Show loader when generating
  if (loading) {
    return <PlaylistLoader hasPhoto={!!photoPreview} onCancel={() => setLoading(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Sube una foto" subtitle="Fryda detecta el mood, el momento y la energía automáticamente.">
        <PhotoUpload
          photoPreview={photoPreview}
          photoInsight={photoInsight}
          isAnalyzing={analyzingPhoto}
          errorMessage={photoError ? describePhotoAnalysisError(photoError) : null}
          onRetryAnalysis={photoError ? handleRetryAnalysis : undefined}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
        />
      </FormSection>

      {photoInsight && !analyzingPhoto && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground animate-fade-up">
          <span className="font-semibold">Lectura de la foto:</span> {photoInsight}. Ajustaré la playlist desde esa vibra.
        </div>
      )}

      <FormSection title="Opcional: afina con tu gusto" subtitle="Si agregas artistas o canciones, Fryda se pega más a tu sonido. Si no, la foto manda.">
        <ArtistSearch
          selectedTags={selectedTags}
          onAddTag={(tag) => setSelectedTags([...selectedTags, tag])}
          onRemoveTag={(value) => setSelectedTags(selectedTags.filter((t) => t.value !== value))}
        />
      </FormSection>

      <div className="pt-4">
        <GenerateButton isLoading={loading} disabled={!photoPreview || analyzingPhoto} />
      </div>
    </form>
  );
};
