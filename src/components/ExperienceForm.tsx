import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateSmartPlaylist, getPhotoInsight, PhotoAnalysis, MusicProfile } from "@/lib/playlistGenerator";

import { MoodSelector, MOOD_ICONS } from "./fryda/MoodSelector";
import { MomentSelector, MOMENT_ICONS } from "./fryda/MomentSelector";
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
  { id: "enamorado",   label: "Enamorado",   icon: MOOD_ICONS["enamorado"].icon,   color: MOOD_ICONS["enamorado"].color },
  { id: "nostálgico",  label: "Nostálgico",  icon: MOOD_ICONS["nostálgico"].icon,  color: MOOD_ICONS["nostálgico"].color },
  { id: "feliz",       label: "Feliz",       icon: MOOD_ICONS["feliz"].icon,       color: MOOD_ICONS["feliz"].color },
  { id: "relajado",    label: "Relajado",    icon: MOOD_ICONS["relajado"].icon,    color: MOOD_ICONS["relajado"].color },
  { id: "nervioso",    label: "Nervioso",    icon: MOOD_ICONS["nervioso"].icon,    color: MOOD_ICONS["nervioso"].color },
  { id: "triste",      label: "Triste",      icon: MOOD_ICONS["triste"].icon,      color: MOOD_ICONS["triste"].color },
  { id: "reflexivo",   label: "Reflexivo",   icon: MOOD_ICONS["reflexivo"].icon,   color: MOOD_ICONS["reflexivo"].color },
  { id: "motivado",    label: "Motivado",    icon: MOOD_ICONS["motivado"].icon,    color: MOOD_ICONS["motivado"].color },
  { id: "rapero",      label: "Rapero",      icon: MOOD_ICONS["rapero"].icon,      color: MOOD_ICONS["rapero"].color },
  { id: "esperanzado", label: "Esperanzado", icon: MOOD_ICONS["esperanzado"].icon, color: MOOD_ICONS["esperanzado"].color },
  { id: "libre",       label: "Libre",       icon: MOOD_ICONS["libre"].icon,       color: MOOD_ICONS["libre"].color },
];

const MOMENTS = [
  { id: "vacaciones",  label: "Vacaciones",     icon: MOMENT_ICONS["vacaciones"] },
  { id: "fiesta",      label: "Fiesta",          icon: MOMENT_ICONS["fiesta"] },
  { id: "tranquilo",   label: "Día tranquilo",   icon: MOMENT_ICONS["tranquilo"] },
  { id: "despedida",   label: "Despedida",       icon: MOMENT_ICONS["despedida"] },
  { id: "concierto",   label: "Concierto",       icon: MOMENT_ICONS["concierto"] },
  { id: "noche",       label: "Noche especial",  icon: MOMENT_ICONS["noche"] },
  { id: "inspiracion", label: "Inspiración",     icon: MOMENT_ICONS["inspiracion"] },
  { id: "evento",      label: "Evento",          icon: MOMENT_ICONS["evento"] },
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

  const handlePhotoChange = async (file: File) => {
    setPhotoAnalysis(null);
    setPhotoInsight(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result as string;
      const compressed = await resizeImage(raw);
      setPhotoPreview(compressed);

      setAnalyzingPhoto(true);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-photo", {
          body: {
            photoBase64: compressed,
            selectedMood,
            selectedMomentType,
            selectedTags,
            newMusicPercentage: newMusicPercentage[0],
          },
        });

        if (error) {
          console.error("Error analizando foto:", error);
          toast.error("No se pudo analizar la foto. Puedes continuar sin ella.");
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
        toast.error("Error al analizar la foto. Puedes continuar sin ella.");
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

      // If photo exists but wasn't analyzed yet, analyze now
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
      const playlistName = currentPhotoAnalysis
        ? `${selectedMood} · ${getPhotoInsight(currentPhotoAnalysis)?.split(" ").slice(0, 3).join(" ") || selectedMood}`
        : `Playlist · ${selectedMood}`;

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
    return <PlaylistLoader hasPhoto={!!photoPreview} />;
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
