import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PHASES = [
  { message: "Analizando tu foto...", emoji: "📸" },
  { message: "Interpretando tus emociones...", emoji: "💭" },
  { message: "Buscando las canciones perfectas...", emoji: "🎵" },
  { message: "Creando tu playlist...", emoji: "✨" },
];

interface PlaylistLoaderProps {
  hasPhoto: boolean;
}

export const PlaylistLoader = ({ hasPhoto }: PlaylistLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    // Start from phase 0 if photo, phase 1 if no photo
    if (!hasPhoto) setPhaseIndex(1);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Slow down as we approach 95
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : 1;
        return Math.min(95, prev + increment);
      });
    }, 80);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [hasPhoto]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8 animate-fade-up">
      {/* Pulsing heart */}
      <div className="relative">
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl animate-pulse">
          <Heart className="w-10 h-10 text-primary-foreground fill-current" />
        </div>
      </div>

      {/* Phase message */}
      <div className="text-center space-y-2 min-h-[4rem]">
        <p className="text-2xl" key={phaseIndex}>
          {currentPhase.emoji}
        </p>
        <p className="text-lg font-medium text-foreground animate-fade-in" key={`msg-${phaseIndex}`}>
          {currentPhase.message}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};
