import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateSmartPlaylist, getPhotoInsight, PhotoAnalysis, MusicProfile } from "@/lib/playlistGenerator";

import { MoodSelector } from "./fryda/MoodSelector";
import { MomentSelector } from "./fryda/MomentSelector";
import { PhotoUpload } from "./fryda/PhotoUpload";
import { ArtistSearch } from "./fryda/ArtistSearch";
import { DiscoverySlider } from "./fryda/DiscoverySlider";
import { FormSection } from "./fryda/FormSection";
import { GenerateButton } from "./fryda/GenerateButton";

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

  const handlePhotoChange = async (file: File) => {
    setPhotoAnalysis(null);
    setPhotoInsight(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);

      setAnalyzingPhoto(true);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-photo", {
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
  };

  const handlePhotoRemove = () => {
    setPhotoPreview("");
    setPhotoAnalysis(null);
    setPhotoInsight(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error("Selecciona cómo te sentiste en ese momento");
      return;
    }

    setLoading(true);
    try {
      let currentPhotoAnalysis = photoAnalysis;
      let musicProfile: MusicProfile | null = null;

      if (photoPreview && !photoAnalysis) {
        toast.info("Analizando tu foto...");
        try {
          const { data, error } = await supabase.functions.invoke("analyze-photo", {
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
            : t.track_name.toLowerCase().includes(tag.label.toLowerCase())
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
        try {
          localStorage.setItem("fryda_experiences", JSON.stringify(trimmed));
        } catch {}
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
        } catch {}
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
        try {
          localStorage.setItem("fryda_tracks", JSON.stringify(trimmed));
        } catch {}
      }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photo Upload */}
      <FormSection
        step={1}
        title="Sube una foto"
        subtitle="La IA analizará los colores, escenas y emociones"
      >
        <PhotoUpload
          photoPreview={photoPreview}
          photoInsight={photoInsight}
          isAnalyzing={analyzingPhoto}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
        />
      </FormSection>

      {/* Mood Selection */}
      <FormSection
        step={2}
        title="¿Cómo te sentías?"
        subtitle="Elige la emoción que mejor describe ese momento"
      >
        <MoodSelector moods={MOODS} selected={selectedMood} onSelect={setSelectedMood} />
      </FormSection>

      {/* Moment Type */}
      <FormSection
        step={3}
        title="¿Qué tipo de momento era?"
        subtitle="Opcional - ayuda a afinar las recomendaciones"
      >
        <MomentSelector moments={MOMENTS} selected={selectedMomentType} onSelect={setSelectedMomentType} />
      </FormSection>

      {/* Artist/Song Search */}
      <FormSection
        step={4}
        title="Canciones o artistas que recuerdes"
        subtitle="Opcional - usaremos tu gusto musical para personalizar"
      >
        <ArtistSearch
          selectedTags={selectedTags}
          onAddTag={(tag) => setSelectedTags([...selectedTags, tag])}
          onRemoveTag={(value) => setSelectedTags(selectedTags.filter((t) => t.value !== value))}
        />
      </FormSection>

      {/* Discovery Slider */}
      <FormSection
        step={5}
        title="Balance musical"
        subtitle="¿Más favoritos conocidos o descubrir música nueva?"
      >
        <DiscoverySlider value={newMusicPercentage} onChange={setNewMusicPercentage} />
      </FormSection>

      {/* Submit Button */}
      <div className="pt-4">
        <GenerateButton isLoading={loading} disabled={!selectedMood} />
      </div>
    </form>
  );
};
