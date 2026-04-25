import { useState } from "react";
import { toast } from "sonner";
import { generateSmartPlaylist, getPhotoInsight, PhotoAnalysis, MusicProfile } from "@/lib/playlistGenerator";
import {
  analyzePhotoWithRetry,
  describePhotoAnalysisError,
  isPhotoAnalysisConfigured,
  type PhotoAnalysisErrorCode,
} from "@/lib/photoAnalysis";

import { MoodSelector } from "./fryda/MoodSelector";
import { MomentSelector } from "./fryda/MomentSelector";
import { PhotoUpload } from "./fryda/PhotoUpload";
import { ArtistSearch } from "./fryda/ArtistSearch";
import { DiscoverySlider } from "./fryda/DiscoverySlider";
import { FormSection } from "./fryda/FormSection";
import { GenerateButton } from "./fryda/GenerateButton";
import { PlaylistLoader } from "./fryda/PlaylistLoader";

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

const MOMENTS = [
  { id: "vacaciones", label: "Vacaciones", emoji: "🏖️" },
  { id: "fiesta", label: "Fiesta", emoji: "💃" },
  { id: "tranquilo", label: "Día tranquilo", emoji: "🏡" },
  { id: "despedida", label: "Despedida", emoji: "💔" },
  { id: "concierto", label: "Concierto", emoji: "🎶" },
  { id: "noche", label: "Noche especial", emoji: "🌃" },
  { id: "inspiracion", label: "Inspiración", emoji: "💡" },
  { id: "evento", label: "Evento", emoji: "📸" },
];

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
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedMomentType, setSelectedMomentType] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<{ type: "artist" | "song"; value: string; label: string }>>([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [newMusicPercentage, setNewMusicPercentage] = useState([50]);
  const [loading, setLoading] = useState(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [photoInsight, setPhotoInsight] = useState<string | null>(null);
  const [photoMusicProfile, setPhotoMusicProfile] = useState<MusicProfile | null>(null);
  const [photoError, setPhotoError] = useState<PhotoAnalysisErrorCode | null>(null);
  const [backendReady] = useState<boolean>(isPhotoAnalysisConfigured());

  const runPhotoAnalysis = async (compressedBase64: string) => {
    setAnalyzingPhoto(true);
    setPhotoError(null);

    const result = await analyzePhotoWithRetry({
      photoBase64: compressedBase64,
      selectedMood,
      selectedMomentType,
      selectedTags,
      newMusicPercentage: newMusicPercentage[0],
    });

    if (result.data?.photoAnalysis) {
      const analysis = result.data.photoAnalysis as unknown as PhotoAnalysis;
      setPhotoAnalysis(analysis);
      setPhotoMusicProfile((result.data.musicProfile as unknown as MusicProfile) ?? null);
      const insight = getPhotoInsight(analysis);
      setPhotoInsight(insight);
      if (insight) toast.success(insight);
    } else {
      const code = result.error ?? "unknown";
      console.error(`Photo analysis failed after ${result.attempts} attempts:`, code);
      setPhotoError(code);
      toast.error(describePhotoAnalysisError(code));
    }

    setAnalyzingPhoto(false);
  };

  const handlePhotoChange = async (file: File) => {
    setPhotoAnalysis(null);
    setPhotoInsight(null);
    setPhotoMusicProfile(null);
    setPhotoError(null);

    if (!backendReady) {
      toast.error("El backend de IA no está disponible en este momento.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result as string;
      const compressed = await resizeImage(raw);
      setPhotoPreview(compressed);
      await runPhotoAnalysis(compressed);
    };
    reader.readAsDataURL(file);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error("Selecciona cómo te sentiste en ese momento");
      return;
    }

    setLoading(true);
    try {
      // Photo analysis is performed at upload time (with retries) and the
      // result is cached in state. handleSubmit just consumes it.
      const currentPhotoAnalysis = photoAnalysis;
      const musicProfile: MusicProfile | null = photoMusicProfile;

      const playlistTracks = generateSmartPlaylist(
        selectedMood,
        selectedMomentType,
        selectedTags,
        newMusicPercentage[0],
        currentPhotoAnalysis,
        musicProfile
      );

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
        try { localStorage.setItem("fryda_experiences", JSON.stringify(trimmed)); } catch {}
      }

      const playlistId = Date.now().toString();
      const moodLabel = MOODS.find((m) => m.id === selectedMood)?.emoji || "";
      const playlistName = currentPhotoAnalysis
        ? `${moodLabel} ${selectedMood} • ${getPhotoInsight(currentPhotoAnalysis)?.split(" ").slice(0, 2).join(" ") || "📸"}`
        : `${moodLabel} Playlist ${selectedMood}`;

      const playlist = {
        id: playlistId,
        experience_id: experienceId,
        name: playlistName,
        emotion: selectedMood,
        moment_type: selectedMomentType,
        new_music_percentage: newMusicPercentage[0],
        tags: selectedTags,
        photo_analysis: currentPhotoAnalysis,
        created_at: new Date().toISOString(),
      };

      const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
      playlists.push(playlist);
      try {
        localStorage.setItem("fryda_playlists", JSON.stringify(playlists));
      } catch {
        const trimmed = playlists.slice(-50);
        try { localStorage.setItem("fryda_playlists", JSON.stringify(trimmed)); } catch {}
      }

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
        try { localStorage.setItem("fryda_tracks", JSON.stringify(trimmed)); } catch {}
      }

      // Long dramatic wait so the loader builds suspense before revealing the playlist
      await new Promise((r) => setTimeout(r, 8000));

      const insight = currentPhotoAnalysis ? getPhotoInsight(currentPhotoAnalysis) : null;
      toast.success(insight ? `¡Playlist creada! ${insight}` : "¡Playlist generada con éxito!");
      onPlaylistGenerated(playlistId);

      // Reset
      setSelectedMood("");
      setSelectedMomentType("");
      setSelectedTags([]);
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

  // Show loader when generating
  if (loading) {
    return <PlaylistLoader hasPhoto={!!photoPreview} onCancel={() => setLoading(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection step={1} title="Sube una foto" subtitle="La IA analizará los colores, escenas y emociones">
        <PhotoUpload
          photoPreview={photoPreview}
          photoInsight={photoInsight}
          isAnalyzing={analyzingPhoto}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
        />
      </FormSection>

      <FormSection step={2} title="¿Cómo te sentías?" subtitle="Elige la emoción que mejor describe ese momento">
        <MoodSelector moods={MOODS} selected={selectedMood} onSelect={setSelectedMood} />
      </FormSection>

      <FormSection step={3} title="¿Qué tipo de momento era?" subtitle="Opcional - ayuda a afinar las recomendaciones">
        <MomentSelector moments={MOMENTS} selected={selectedMomentType} onSelect={setSelectedMomentType} />
      </FormSection>

      <FormSection step={4} title="Canciones o artistas que recuerdes" subtitle="Opcional - usaremos tu gusto musical para personalizar">
        <ArtistSearch
          selectedTags={selectedTags}
          onAddTag={(tag) => setSelectedTags([...selectedTags, tag])}
          onRemoveTag={(value) => setSelectedTags(selectedTags.filter((t) => t.value !== value))}
        />
      </FormSection>

      <FormSection step={5} title="Balance musical" subtitle="¿Más favoritos conocidos o descubrir música nueva?">
        <DiscoverySlider value={newMusicPercentage} onChange={setNewMusicPercentage} />
      </FormSection>

      <div className="pt-4">
        <GenerateButton isLoading={loading} disabled={!selectedMood} />
      </div>
    </form>
  );
};
