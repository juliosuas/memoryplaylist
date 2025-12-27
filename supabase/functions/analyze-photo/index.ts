import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PhotoAnalysis {
  dominantColors: string[];  // warm, cool, neutral, vibrant, muted
  lighting: string;          // bright, dim, golden, blue-hour, night, natural
  scene: string;             // beach, city, nature, indoor, party, concert, sunset, mountain
  mood: string;              // happy, melancholic, energetic, peaceful, romantic, nostalgic
  activity: string;          // dancing, relaxing, traveling, celebrating, reflecting
  season: string;            // summer, winter, autumn, spring, undefined
  timeOfDay: string;         // morning, afternoon, evening, night
  people: string;            // solo, couple, group, crowd, none
  energy: number;            // 1-10 scale
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      photoBase64, 
      selectedMood, 
      selectedMomentType, 
      selectedTags, 
      newMusicPercentage 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurada");

    let photoAnalysis: PhotoAnalysis | null = null;

    // Analizar foto con IA si se proporciona
    if (photoBase64) {
      console.log("Analizando foto con IA...");
      
      const analysisPrompt = `Analiza esta imagen y extrae patrones visuales para crear una playlist musical personalizada.

Devuelve SOLO un JSON válido sin markdown ni explicaciones con esta estructura exacta:
{
  "dominantColors": ["warm" o "cool" o "neutral" o "vibrant" o "muted"],
  "lighting": "bright" o "dim" o "golden" o "blue-hour" o "night" o "natural",
  "scene": "beach" o "city" o "nature" o "indoor" o "party" o "concert" o "sunset" o "mountain" o "road" o "cafe",
  "mood": "happy" o "melancholic" o "energetic" o "peaceful" o "romantic" o "nostalgic" o "adventurous",
  "activity": "dancing" o "relaxing" o "traveling" o "celebrating" o "reflecting" o "socializing" o "exploring",
  "season": "summer" o "winter" o "autumn" o "spring" o "undefined",
  "timeOfDay": "morning" o "afternoon" o "evening" o "night",
  "people": "solo" o "couple" o "group" o "crowd" o "none",
  "energy": número del 1 al 10
}

Analiza colores, iluminación, expresiones, ambiente y contexto visual para determinar cada campo.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: analysisPrompt },
                { type: "image_url", image_url: { url: photoBase64 } },
              ],
            },
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("Error de IA:", aiResponse.status, errorText);
        // Continuar sin análisis de foto
      } else {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content?.trim() || "";
        console.log("Respuesta IA:", content);
        
        // Extraer JSON del contenido
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            photoAnalysis = JSON.parse(jsonMatch[0]);
            console.log("Análisis de foto:", photoAnalysis);
          }
        } catch (parseError) {
          console.error("Error parseando JSON:", parseError);
        }
      }
    }

    // Construir perfil de música basado en todos los inputs
    const musicProfile = buildMusicProfile(
      photoAnalysis,
      selectedMood,
      selectedMomentType,
      newMusicPercentage
    );

    console.log("Perfil musical generado:", musicProfile);

    return new Response(
      JSON.stringify({
        success: true,
        photoAnalysis,
        musicProfile,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error en analyze-photo:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

interface MusicProfile {
  primaryMoods: string[];
  secondaryMoods: string[];
  energyRange: [number, number];
  tempoPreference: string;  // slow, medium, upbeat, fast
  genreHints: string[];
  atmosphereKeywords: string[];
}

function buildMusicProfile(
  photoAnalysis: PhotoAnalysis | null,
  selectedMood: string,
  selectedMomentType: string,
  newMusicPercentage: number
): MusicProfile {
  const profile: MusicProfile = {
    primaryMoods: [selectedMood],
    secondaryMoods: [],
    energyRange: [3, 7],
    tempoPreference: "medium",
    genreHints: [],
    atmosphereKeywords: [],
  };

  // Mapeo de moods del formulario a atributos musicales
  const moodMapping: Record<string, { energy: [number, number]; tempo: string; secondary: string[] }> = {
    enamorado: { energy: [4, 7], tempo: "medium", secondary: ["romántico", "feliz"] },
    nostálgico: { energy: [3, 6], tempo: "slow", secondary: ["reflexivo", "triste"] },
    feliz: { energy: [6, 9], tempo: "upbeat", secondary: ["motivado", "libre"] },
    relajado: { energy: [2, 5], tempo: "slow", secondary: ["tranquilo", "reflexivo"] },
    nervioso: { energy: [5, 8], tempo: "fast", secondary: ["motivado"] },
    triste: { energy: [2, 5], tempo: "slow", secondary: ["nostálgico", "reflexivo"] },
    reflexivo: { energy: [3, 6], tempo: "slow", secondary: ["nostálgico", "relajado"] },
    motivado: { energy: [7, 10], tempo: "fast", secondary: ["feliz", "libre"] },
    esperanzado: { energy: [5, 8], tempo: "medium", secondary: ["feliz", "motivado"] },
    libre: { energy: [6, 9], tempo: "upbeat", secondary: ["feliz", "motivado"] },
  };

  if (moodMapping[selectedMood]) {
    const mapping = moodMapping[selectedMood];
    profile.energyRange = mapping.energy;
    profile.tempoPreference = mapping.tempo;
    profile.secondaryMoods = mapping.secondary;
  }

  // Ajustar según tipo de momento
  const momentMapping: Record<string, { genres: string[]; atmosphere: string[]; energyBoost: number }> = {
    vacaciones: { genres: ["tropical", "indie", "reggaeton"], atmosphere: ["summer", "beach", "freedom"], energyBoost: 1 },
    fiesta: { genres: ["pop", "dance", "reggaeton", "hip-hop"], atmosphere: ["party", "dance", "fun"], energyBoost: 2 },
    tranquilo: { genres: ["lo-fi", "jazz", "acoustic", "ambient"], atmosphere: ["chill", "calm", "peaceful"], energyBoost: -2 },
    despedida: { genres: ["ballad", "rock", "indie"], atmosphere: ["emotional", "bittersweet"], energyBoost: -1 },
    concierto: { genres: ["rock", "alternative", "indie"], atmosphere: ["live", "energy", "crowd"], energyBoost: 2 },
    noche: { genres: ["r&b", "electronic", "indie"], atmosphere: ["night", "urban", "intimate"], energyBoost: 0 },
    inspiracion: { genres: ["classical", "ambient", "instrumental"], atmosphere: ["creative", "focus", "flow"], energyBoost: 0 },
    evento: { genres: ["pop", "dance", "electronic"], atmosphere: ["celebration", "special"], energyBoost: 1 },
  };

  if (momentMapping[selectedMomentType]) {
    const mapping = momentMapping[selectedMomentType];
    profile.genreHints = mapping.genres;
    profile.atmosphereKeywords = mapping.atmosphere;
    profile.energyRange[0] = Math.max(1, profile.energyRange[0] + mapping.energyBoost);
    profile.energyRange[1] = Math.min(10, profile.energyRange[1] + mapping.energyBoost);
  }

  // Enriquecer con análisis de foto si existe
  if (photoAnalysis) {
    // Ajustar energía según análisis visual
    const visualEnergy = photoAnalysis.energy || 5;
    profile.energyRange[0] = Math.round((profile.energyRange[0] + visualEnergy) / 2);
    profile.energyRange[1] = Math.round((profile.energyRange[1] + visualEnergy) / 2);

    // Añadir moods secundarios basados en foto
    const photoMoodMapping: Record<string, string[]> = {
      happy: ["feliz", "motivado"],
      melancholic: ["nostálgico", "triste"],
      energetic: ["motivado", "libre"],
      peaceful: ["relajado", "reflexivo"],
      romantic: ["enamorado"],
      nostalgic: ["nostálgico"],
      adventurous: ["libre", "motivado"],
    };

    if (photoAnalysis.mood && photoMoodMapping[photoAnalysis.mood]) {
      profile.secondaryMoods.push(...photoMoodMapping[photoAnalysis.mood]);
    }

    // Añadir hints de género según escena
    const sceneGenreMapping: Record<string, string[]> = {
      beach: ["tropical", "reggae", "chill"],
      city: ["urban", "hip-hop", "electronic"],
      nature: ["folk", "acoustic", "ambient"],
      party: ["dance", "pop", "reggaeton"],
      concert: ["rock", "live", "alternative"],
      sunset: ["chill", "indie", "lo-fi"],
      mountain: ["folk", "acoustic", "epic"],
    };

    if (photoAnalysis.scene && sceneGenreMapping[photoAnalysis.scene]) {
      profile.genreHints.push(...sceneGenreMapping[photoAnalysis.scene]);
    }

    // Añadir atmósfera según colores y luz
    if (photoAnalysis.dominantColors?.includes("warm")) {
      profile.atmosphereKeywords.push("warm", "cozy");
    }
    if (photoAnalysis.dominantColors?.includes("cool")) {
      profile.atmosphereKeywords.push("chill", "calm");
    }
    if (photoAnalysis.lighting === "golden") {
      profile.atmosphereKeywords.push("golden-hour", "dreamy");
    }
    if (photoAnalysis.lighting === "night") {
      profile.atmosphereKeywords.push("nocturnal", "intimate");
    }

    // Ajustar según tiempo del día
    if (photoAnalysis.timeOfDay === "morning") {
      profile.atmosphereKeywords.push("fresh", "hopeful");
    }
    if (photoAnalysis.timeOfDay === "evening") {
      profile.atmosphereKeywords.push("sunset", "reflective");
    }

    // Ajustar según estación
    if (photoAnalysis.season === "summer") {
      profile.genreHints.push("summer", "tropical");
    }
    if (photoAnalysis.season === "winter") {
      profile.genreHints.push("cozy", "acoustic");
    }
  }

  // Eliminar duplicados
  profile.secondaryMoods = [...new Set(profile.secondaryMoods)].filter(m => m !== selectedMood);
  profile.genreHints = [...new Set(profile.genreHints)];
  profile.atmosphereKeywords = [...new Set(profile.atmosphereKeywords)];

  return profile;
}
