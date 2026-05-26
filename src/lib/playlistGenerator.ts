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

const artistKey = (track: TrackData) => track.artist.trim().toLowerCase();

function addWithArtistLimit(
  target: TrackData[],
  candidates: TrackData[],
  artistCount: Map<string, number>,
  usedIds: Set<string>,
  targetSize: number,
  maxPerArtist = 2
) {
  const overflow: TrackData[] = [];

  for (const track of candidates) {
    if (usedIds.has(track.id) || target.length >= targetSize) continue;
    const key = artistKey(track);
    const count = artistCount.get(key) ?? 0;

    if (count < maxPerArtist) {
      target.push(track);
      usedIds.add(track.id);
      artistCount.set(key, count + 1);
    } else {
      overflow.push(track);
    }
  }

  return overflow;
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
      score += 10;
    }

    // +1 punto por cada mood secundario del perfil
    if (musicProfile?.secondaryMoods) {
      track.moods.forEach((trackMood) => {
        if (musicProfile.secondaryMoods.includes(trackMood)) {
          score += 3;
        }
      });
    }

    // === PUNTUACIÓN POR TIPO DE MOMENTO ===
    if (selectedMomentType && track.moment_types?.includes(selectedMomentType)) {
      score += 6;
    }

    // === PUNTUACIÓN POR ENERGY RANGE DEL PERFIL ===
    if (musicProfile?.energyRange && track.energy) {
      const [lo, hi] = musicProfile.energyRange;
      if (track.energy >= lo && track.energy <= hi) {
        score += 4;
      } else if (track.energy >= lo - 1 && track.energy <= hi + 1) {
        score += 2;
      }
    }

    // === PUNTUACIÓN POR ANÁLISIS VISUAL (si hay foto) ===
    if (photoAnalysis) {
      // Normalize dominantColors to always be an array
      const domColors = Array.isArray(photoAnalysis.dominantColors)
        ? photoAnalysis.dominantColors
        : typeof photoAnalysis.dominantColors === "string" && photoAnalysis.dominantColors
          ? [photoAnalysis.dominantColors]
          : [];
      const validScene = photoAnalysis.scene && photoAnalysis.scene !== "undefined" ? photoAnalysis.scene : null;
      const validMood = photoAnalysis.mood && photoAnalysis.mood !== "undefined" ? photoAnalysis.mood : null;

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

      if (validScene) {
        const relatedMoments = sceneToMoment[validScene] || [];
        if (track.moment_types?.some((mt) => relatedMoments.includes(mt))) {
          score += 4;
        }
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

      if (validMood) {
        const relatedMoods = photoMoodToTrackMoods[validMood] || [];
        if (track.moods.some((m) => relatedMoods.includes(m))) {
          score += 5;
        }
      }

      if (track.energy) {
        const energyDiff = Math.abs(track.energy - (photoAnalysis.energy || 5));
        if (energyDiff <= 2) score += 2;
        else if (energyDiff <= 4) score += 1;
      }

      if (validScene && track.visualScenes?.includes(validScene)) {
        score += 2;
      }

      if (track.colorVibes && domColors.length > 0) {
        const matchingColors = track.colorVibes.filter((c) => domColors.includes(c));
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
      score += matchingGenres.length * 1.5;
    }

    return { track, score, isKnown };
  });

  // Filtrar tracks con puntuación > 0 y ordenar
  const relevantTracks = scoredTracks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pools (sin duplicar los pineados)
  // Si el usuario seleccionó tags, "known" = tags. Si no, "known" = top picks por mood/momento.
  const hasTags = selectedTags.length > 0;
  const knownTracks = hasTags
    ? relevantTracks.filter((t) => t.isKnown && !pinnedIds.has(t.track.id))
    : relevantTracks.filter((t) => t.score >= 10 && !pinnedIds.has(t.track.id));
  const newTracks = hasTags
    ? relevantTracks.filter((t) => !t.isKnown && !pinnedIds.has(t.track.id))
    : relevantTracks.filter((t) => t.score < 10 && !pinnedIds.has(t.track.id));

  // Calcular distribución según slider (sobre el espacio restante)
  const remainingSlots = targetSize - pinnedSelection.length;
  const clampedNewPct = Math.min(100, Math.max(0, newMusicPercentage));
  const countNew = Math.round(remainingSlots * (clampedNewPct / 100));
  const countKnown = remainingSlots - countNew;

  const selectedKnown = shuffleArray(knownTracks.slice(0, Math.max(countKnown * 4, 25))).map((t) => t.track);
  const selectedNew = shuffleArray(newTracks.slice(0, Math.max(countNew * 4, 30))).map((t) => t.track);

  // === DIVERSIDAD POR ARTISTA ===
  // Máximo 2 pistas del mismo artista antes de recurrir a overflow.
  const artistCount = new Map<string, number>();
  const usedIds = new Set(pinnedSelection.map((t) => t.id));
  pinnedSelection.forEach((t) => {
    const k = artistKey(t);
    artistCount.set(k, (artistCount.get(k) ?? 0) + 1);
  });

  const diversified: TrackData[] = [...pinnedSelection];
  const overflow = [
    ...addWithArtistLimit(diversified, selectedKnown.slice(0, countKnown), artistCount, usedIds, targetSize),
    ...addWithArtistLimit(diversified, selectedNew.slice(0, countNew), artistCount, usedIds, targetSize),
  ];

  // Completar primero con tracks relevantes respetando diversidad.
  const moodFill = relevantTracks
    .map((item) => item.track)
    .filter((track) => effectiveMoods.some((m) => track.moods.includes(m)));
  const broadFill = relevantTracks.map((item) => item.track);
  addWithArtistLimit(diversified, shuffleArray([...moodFill, ...broadFill]), artistCount, usedIds, targetSize);

  // Último recurso: catálogo completo, todavía respetando max 2 por artista.
  addWithArtistLimit(diversified, shuffleArray(TRACK_CATALOG), artistCount, usedIds, targetSize);

  if (diversified.length < targetSize) {
    const remaining = overflow.filter((track) => !usedIds.has(track.id));
    diversified.push(...remaining.slice(0, targetSize - diversified.length));
  }

  return diversified.slice(0, targetSize);
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

  if (insights.length > 0) return insights[0];

  // Fallbacks so we ALWAYS show that the photo was analyzed.
  const energy = photoAnalysis.energy || 5;
  if (energy >= 8) return "⚡ Energía intensa detectada";
  if (energy <= 3) return "🌙 Ambiente sereno detectado";

  const lightingLabels: Record<string, string> = {
    bright: "☀️ Luz brillante capturada",
    dim: "🕯️ Luz tenue capturada",
    golden: "🌇 Luz dorada mágica",
    "blue-hour": "🌆 Hora azul detectada",
    night: "🌃 Atmósfera nocturna",
    natural: "🌤️ Luz natural balanceada",
  };
  if (photoAnalysis.lighting && lightingLabels[photoAnalysis.lighting]) {
    return lightingLabels[photoAnalysis.lighting];
  }

  return "📸 Foto analizada con IA";
}
