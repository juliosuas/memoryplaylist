import { TRACK_CATALOG, TrackData } from "@/data/tracks";

export interface MusicProfile {
  primaryMoods: string[];
  secondaryMoods: string[];
  energyRange: [number, number];
  tempoPreference: string;
  genreHints: string[];
  atmosphereKeywords: string[];
}

export interface PhotoAnalysis {
  dominantColors: string[];
  lighting: string;
  scene: string;
  mood: string;
  activity: string;
  season: string;
  timeOfDay: string;
  people: string;
  energy: number;
}

interface ScoredTrack {
  track: TrackData;
  score: number;
  isKnown: boolean;
}

// Función para mezclar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generar playlist inteligente basada en análisis de foto y perfil musical
export function generateSmartPlaylist(
  selectedMood: string,
  selectedMomentType: string,
  selectedTags: Array<{ type: "artist" | "song"; value: string; label: string }>,
  newMusicPercentage: number,
  photoAnalysis?: PhotoAnalysis | null,
  musicProfile?: MusicProfile | null
): TrackData[] {
  const targetSize = 25;

  const norm = (s: string) => (s || "").trim().toLowerCase();

  // Aliases para moods (por si el usuario piensa en un mood "rapero")
  const moodAliases: Record<string, string[]> = {
    rapero: ["rapero", "motivado", "nervioso", "libre"],
    rap: ["rapero", "motivado", "nervioso", "libre"],
    hiphop: ["rapero", "motivado", "nervioso", "libre"],
    "hip hop": ["rapero", "motivado", "nervioso", "libre"],
  };

  const effectiveMoods = moodAliases[norm(selectedMood)] ?? [selectedMood];

  const selectedSongIds = new Set(
    selectedTags.filter((t) => t.type === "song").map((t) => t.value)
  );
  const selectedArtists = new Set(
    selectedTags
      .filter((t) => t.type === "artist")
      .map((t) => norm(t.value))
  );

  const tagScoreForTrack = (track: TrackData) => {
    // Canción explícita pesa más que artista.
    if (selectedSongIds.has(track.id)) return 60;
    if (selectedArtists.has(norm(track.artist))) return 45;
    return 0;
  };

  // Tracks "pineados" por tags: SIEMPRE deben aparecer en la playlist si existen.
  const pinnedTracks = TRACK_CATALOG
    .map((t) => ({ track: t, tagScore: tagScoreForTrack(t) }))
    .filter((x) => x.tagScore > 0)
    .sort((a, b) => b.tagScore - a.tagScore)
    .map((x) => x.track);

  const pinnedMax = selectedTags.length
    ? Math.min(8, Math.max(1, selectedTags.length * 2))
    : 0;
  const pinnedSelection = shuffleArray(pinnedTracks).slice(0, Math.min(pinnedMax, targetSize));
  const pinnedIds = new Set(pinnedSelection.map((t) => t.id));

  // Puntuar cada track
  const scoredTracks: ScoredTrack[] = TRACK_CATALOG.map((track) => {
    let score = 0;

    // === PUNTUACIÓN POR TAGS (artista/canción) ===
    const tagScore = tagScoreForTrack(track);
    const isKnown = tagScore > 0;
    score += tagScore;

    // === PUNTUACIÓN POR MOOD ===
    if (effectiveMoods.some((m) => track.moods.includes(m))) {
      score += 5;
    }

    // +1 punto por cada mood secundario del perfil
    if (musicProfile?.secondaryMoods) {
      track.moods.forEach((trackMood) => {
        if (musicProfile.secondaryMoods.includes(trackMood)) {
          score += 1;
        }
      });
    }

    // === PUNTUACIÓN POR TIPO DE MOMENTO ===
    if (selectedMomentType && track.moment_types?.includes(selectedMomentType)) {
      score += 3;
    }

    // === PUNTUACIÓN POR ANÁLISIS VISUAL (si hay foto) ===
    if (photoAnalysis) {
      const sceneToMoment: Record<string, string[]> = {
        beach: ["vacaciones"],
        city: ["noche", "fiesta"],
        nature: ["tranquilo", "vacaciones"],
        party: ["fiesta"],
        concert: ["concierto"],
        sunset: ["noche", "tranquilo"],
        mountain: ["vacaciones", "tranquilo"],
        road: ["vacaciones"],
        cafe: ["tranquilo", "inspiracion"],
        indoor: ["tranquilo", "noche"],
      };

      const relatedMoments = sceneToMoment[photoAnalysis.scene] || [];
      if (track.moment_types?.some((mt) => relatedMoments.includes(mt))) {
        score += 2;
      }

      const photoMoodToTrackMoods: Record<string, string[]> = {
        happy: ["feliz", "motivado", "libre"],
        melancholic: ["nostálgico", "triste", "reflexivo"],
        energetic: ["motivado", "libre", "feliz"],
        peaceful: ["relajado", "reflexivo", "tranquilo"],
        romantic: ["enamorado", "nostálgico"],
        nostalgic: ["nostálgico", "reflexivo"],
        adventurous: ["libre", "motivado", "feliz"],
      };

      const relatedMoods = photoMoodToTrackMoods[photoAnalysis.mood] || [];
      if (track.moods.some((m) => relatedMoods.includes(m))) {
        score += 2;
      }

      if (track.energy) {
        const energyDiff = Math.abs(track.energy - photoAnalysis.energy);
        if (energyDiff <= 2) score += 2;
        else if (energyDiff <= 4) score += 1;
      }

      if (track.visualScenes?.includes(photoAnalysis.scene)) {
        score += 2;
      }

      if (track.colorVibes && photoAnalysis.dominantColors) {
        const matchingColors = track.colorVibes.filter((c) => photoAnalysis.dominantColors.includes(c));
        score += matchingColors.length * 0.5;
      }

      const timeToMoments: Record<string, string[]> = {
        morning: ["tranquilo"],
        afternoon: ["vacaciones", "inspiracion"],
        evening: ["noche", "despedida"],
        night: ["noche", "fiesta", "concierto"],
      };

      const timeRelatedMoments = timeToMoments[photoAnalysis.timeOfDay] || [];
      if (track.moment_types?.some((mt) => timeRelatedMoments.includes(mt))) {
        score += 1;
      }

      if (
        photoAnalysis.season === "summer" &&
        track.moment_types?.some((mt) => ["vacaciones", "fiesta"].includes(mt))
      ) {
        score += 1;
      }
      if (
        photoAnalysis.season === "winter" &&
        track.moods.some((m) => ["nostálgico", "reflexivo", "relajado"].includes(m))
      ) {
        score += 1;
      }
    }

    // === PUNTUACIÓN POR GÉNERO (si hay hints) ===
    if (musicProfile?.genreHints && track.genres) {
      const matchingGenres = track.genres.filter((g) => musicProfile.genreHints.includes(g));
      score += matchingGenres.length * 0.5;
    }

    return { track, score, isKnown };
  });

  // Filtrar tracks con puntuación > 0 y ordenar
  const relevantTracks = scoredTracks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pools (sin duplicar los pineados)
  const knownTracks = relevantTracks.filter((t) => t.isKnown && !pinnedIds.has(t.track.id));
  const newTracks = relevantTracks.filter((t) => !t.isKnown && !pinnedIds.has(t.track.id));

  // Calcular distribución según slider (sobre el espacio restante)
  const remainingSlots = targetSize - pinnedSelection.length;
  const clampedNewPct = Math.min(100, Math.max(0, newMusicPercentage));
  const countNew = Math.round(remainingSlots * (clampedNewPct / 100));
  const countKnown = remainingSlots - countNew;

  const selectedKnown = shuffleArray(knownTracks.slice(0, Math.max(countKnown * 3, 15)))
    .slice(0, countKnown)
    .map((t) => t.track);

  const selectedNew = shuffleArray(newTracks.slice(0, Math.max(countNew * 3, 20)))
    .slice(0, countNew)
    .map((t) => t.track);

  let playlist = [...pinnedSelection, ...selectedKnown, ...selectedNew];

  // Completar si faltan tracks
  if (playlist.length < targetSize) {
    const already = new Set(playlist.map((t) => t.id));

    const moodFill = TRACK_CATALOG.filter(
      (t) => effectiveMoods.some((m) => t.moods.includes(m)) && !already.has(t.id)
    );

    const fallbackFill = TRACK_CATALOG.filter((t) => !already.has(t.id));

    const fillFrom = moodFill.length > 0 ? moodFill : fallbackFill;
    playlist = [...playlist, ...shuffleArray(fillFrom).slice(0, targetSize - playlist.length)];
  }

  // Mantener relevancia: los pineados van primero y el resto tiene variedad por shuffle parcial.
  return playlist.slice(0, targetSize);
}

// Función para determinar el mood secundario más relevante basado en la foto
export function getPhotoInsight(photoAnalysis: PhotoAnalysis | null): string | null {
  if (!photoAnalysis) return null;

  const insights: string[] = [];

  if (photoAnalysis.scene) {
    const sceneLabels: Record<string, string> = {
      beach: "🏖️ Vibes de playa detectadas",
      city: "🌆 Ambiente urbano capturado",
      nature: "🌿 Conexión con la naturaleza",
      party: "🎉 Energía de fiesta",
      concert: "🎸 Momento de música en vivo",
      sunset: "🌅 Atardecer mágico",
      mountain: "⛰️ Aventura en las alturas",
      road: "🛣️ Espíritu viajero",
      cafe: "☕ Momento acogedor",
    };
    if (sceneLabels[photoAnalysis.scene]) {
      insights.push(sceneLabels[photoAnalysis.scene]);
    }
  }

  if (photoAnalysis.mood) {
    const moodLabels: Record<string, string> = {
      happy: "😊 Felicidad en la imagen",
      melancholic: "💭 Tono melancólico",
      energetic: "⚡ Alta energía",
      peaceful: "😌 Paz y tranquilidad",
      romantic: "💕 Ambiente romántico",
      nostalgic: "📷 Nostalgia capturada",
      adventurous: "🌟 Espíritu aventurero",
    };
    if (moodLabels[photoAnalysis.mood]) {
      insights.push(moodLabels[photoAnalysis.mood]);
    }
  }

  return insights.length > 0 ? insights[0] : null;
}
