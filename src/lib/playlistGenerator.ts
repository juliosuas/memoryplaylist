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
  selectedTags: Array<{ type: 'artist' | 'song'; value: string; label: string }>,
  newMusicPercentage: number,
  photoAnalysis?: PhotoAnalysis | null,
  musicProfile?: MusicProfile | null
): TrackData[] {
  
  // Identificar canciones conocidas (de artistas o canciones del usuario)
  const knownSongIds = new Set<string>();
  TRACK_CATALOG.forEach(track => {
    const isKnown = selectedTags.some(tag => {
      if (tag.type === 'artist') {
        return track.artist.toLowerCase() === tag.value.toLowerCase();
      } else {
        return track.id === tag.value || track.track_name.toLowerCase().includes(tag.label.toLowerCase());
      }
    });
    if (isKnown) knownSongIds.add(track.id);
  });

  // Puntuar cada track
  const scoredTracks: ScoredTrack[] = TRACK_CATALOG.map(track => {
    let score = 0;
    const isKnown = knownSongIds.has(track.id);

    // === PUNTUACIÓN POR MOOD ===
    // +5 puntos si coincide el mood principal
    if (track.moods.includes(selectedMood)) {
      score += 5;
    }
    
    // +1 punto por cada mood secundario del perfil
    if (musicProfile?.secondaryMoods) {
      track.moods.forEach(trackMood => {
        if (musicProfile.secondaryMoods.includes(trackMood)) {
          score += 1;
        }
      });
    }

    // === PUNTUACIÓN POR TIPO DE MOMENTO ===
    // +3 puntos si coincide el tipo de momento
    if (selectedMomentType && track.moment_types?.includes(selectedMomentType)) {
      score += 3;
    }

    // === PUNTUACIÓN POR ANÁLISIS VISUAL (si hay foto) ===
    if (photoAnalysis) {
      // Mapeo de escenas de foto a moment_types
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
      if (track.moment_types?.some(mt => relatedMoments.includes(mt))) {
        score += 2;
      }

      // Mapeo de mood de foto a moods de canciones
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
      if (track.moods.some(m => relatedMoods.includes(m))) {
        score += 2;
      }

      // Bonus por energía similar
      if (track.energy) {
        const energyDiff = Math.abs(track.energy - photoAnalysis.energy);
        if (energyDiff <= 2) score += 2;
        else if (energyDiff <= 4) score += 1;
      }

      // Bonus por escenas visuales coincidentes
      if (track.visualScenes?.includes(photoAnalysis.scene)) {
        score += 2;
      }

      // Bonus por colores/vibes
      if (track.colorVibes && photoAnalysis.dominantColors) {
        const matchingColors = track.colorVibes.filter(c => 
          photoAnalysis.dominantColors.includes(c)
        );
        score += matchingColors.length * 0.5;
      }

      // Ajuste por tiempo del día
      const timeToMoments: Record<string, string[]> = {
        morning: ["tranquilo"],
        afternoon: ["vacaciones", "inspiracion"],
        evening: ["noche", "despedida"],
        night: ["noche", "fiesta", "concierto"],
      };

      const timeRelatedMoments = timeToMoments[photoAnalysis.timeOfDay] || [];
      if (track.moment_types?.some(mt => timeRelatedMoments.includes(mt))) {
        score += 1;
      }

      // Ajuste por temporada
      if (photoAnalysis.season === "summer" && 
          track.moment_types?.some(mt => ["vacaciones", "fiesta"].includes(mt))) {
        score += 1;
      }
      if (photoAnalysis.season === "winter" && 
          track.moods.some(m => ["nostálgico", "reflexivo", "relajado"].includes(m))) {
        score += 1;
      }
    }

    // === PUNTUACIÓN POR GÉNERO (si hay hints) ===
    if (musicProfile?.genreHints && track.genres) {
      const matchingGenres = track.genres.filter(g => 
        musicProfile.genreHints.includes(g)
      );
      score += matchingGenres.length * 0.5;
    }

    return { track, score, isKnown };
  });

  // Filtrar tracks con puntuación > 0 y ordenar
  const relevantTracks = scoredTracks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Separar conocidas de nuevas
  const knownTracks = relevantTracks.filter(t => t.isKnown);
  const newTracks = relevantTracks.filter(t => !t.isKnown);

  // Calcular distribución según slider
  const targetSize = 25;
  const countNew = Math.round(targetSize * (newMusicPercentage / 100));
  const countKnown = targetSize - countNew;

  // Seleccionar con algo de aleatoriedad para variedad
  const selectedKnown = shuffleArray(knownTracks.slice(0, Math.max(countKnown * 3, 15)))
    .slice(0, countKnown)
    .map(t => t.track);
  
  const selectedNew = shuffleArray(newTracks.slice(0, Math.max(countNew * 3, 20)))
    .slice(0, countNew)
    .map(t => t.track);

  let playlist = [...selectedKnown, ...selectedNew];

  // Si no hay suficientes, completar con tracks del mood principal
  if (playlist.length < 20) {
    const filler = TRACK_CATALOG.filter(t => 
      t.moods.includes(selectedMood) && !playlist.find(pt => pt.id === t.id)
    );
    playlist.push(...shuffleArray(filler).slice(0, 20 - playlist.length));
  }

  // Shuffle final y limitar
  return shuffleArray(playlist).slice(0, targetSize);
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
