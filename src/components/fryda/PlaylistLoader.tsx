import { useState, useEffect } from "react";
import { Heart, Music, Disc3, Radio } from "lucide-react";

const PHASES = [
  { message: "Analizando tu foto...",          sub: "Detectando emociones y ambiente",          icon: Disc3 },
  { message: "Interpretando tus emociones...", sub: "Entendiendo cómo te sientes",              icon: Heart },
  { message: "Buscando las canciones perfectas...", sub: "Encontrando el ritmo perfecto",       icon: Radio },
  { message: "Creando tu playlist...",         sub: "Casi listo, preparando la magia",          icon: Music },
];

const ORBS = [
  { size: 180, left: "8%",  top: "15%", color: "hsla(350,85%,65%,0.35)", delay: "0s",   duration: "5s" },
  { size: 120, left: "75%", top: "10%", color: "hsla(15,90%,60%,0.3)",   delay: "0.8s", duration: "4s" },
  { size: 200, left: "85%", top: "55%", color: "hsla(350,70%,55%,0.25)", delay: "1.5s", duration: "6s" },
  { size: 90,  left: "5%",  top: "65%", color: "hsla(30,90%,65%,0.35)",  delay: "0.3s", duration: "3.5s" },
  { size: 150, left: "40%", top: "80%", color: "hsla(350,80%,60%,0.3)",  delay: "1s",   duration: "5.5s" },
  { size: 80,  left: "60%", top: "70%", color: "hsla(15,85%,65%,0.4)",   delay: "2s",   duration: "3s" },
  { size: 110, left: "25%", top: "5%",  color: "hsla(340,75%,60%,0.28)", delay: "0.6s", duration: "4.5s" },
];

const TARGET_SONGS = 20;

interface PlaylistLoaderProps {
  hasPhoto: boolean;
}

export const PlaylistLoader = ({ hasPhoto }: PlaylistLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [songsFound, setSongsFound] = useState(0);

  useEffect(() => {
    if (!hasPhoto) setPhaseIndex(1);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const increment = prev < 20 ? 0.8 : prev < 50 ? 0.5 : prev < 80 ? 0.35 : 0.18;
        return Math.min(95, prev + increment);
      });
    }, 80);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, 2000);

    const songInterval = setInterval(() => {
      setSongsFound((prev) => {
        if (prev >= TARGET_SONGS) return TARGET_SONGS;
        return prev + 1;
      });
    }, 340);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      clearInterval(songInterval);
    };
  }, [hasPhoto]);

  useEffect(() => {
    setDisplayedText("");
    setTypingIndex(0);
  }, [phaseIndex]);

  useEffect(() => {
    const fullText = PHASES[phaseIndex].message;
    if (typingIndex >= fullText.length) return;
    const t = setTimeout(() => {
      setDisplayedText(fullText.slice(0, typingIndex + 1));
      setTypingIndex((i) => i + 1);
    }, 45);
    return () => clearTimeout(t);
  }, [typingIndex, phaseIndex]);

  const currentPhase = PHASES[phaseIndex];
  const PhaseIcon = currentPhase.icon;
  const isComplete = songsFound >= TARGET_SONGS;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-up">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, hsl(350,85%,55%), hsl(20,90%,58%), hsl(340,80%,60%), hsl(15,90%,55%))",
          backgroundSize: "300% 300%",
          animation: "gradient-shift 6s ease infinite",
        }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.08)" }} />

      {/* Floating orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: orb.size, height: orb.size,
            left: orb.left, top: orb.top,
            background: orb.color,
            animationName: "float",
            animationDuration: orb.duration,
            animationDelay: orb.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-6">

        {/* Pulsing icon rings */}
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <div className="absolute rounded-full border-2 border-white/15" style={{ width: 160, height: 160, animation: "ping-slow 2.4s ease-out infinite", animationDelay: "0.4s" }} />
          <div className="absolute rounded-full border-2 border-white/25" style={{ width: 128, height: 128, animation: "ping-slow 2.4s ease-out infinite", animationDelay: "0.2s" }} />
          <div className="absolute rounded-full border-2 border-white/35" style={{ width: 100, height: 100, animation: "ping-slow 2.4s ease-out infinite" }} />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.12))",
              boxShadow: "0 0 50px rgba(255,255,255,0.35), 0 0 100px rgba(255,200,200,0.25)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <Heart className="w-12 h-12 fill-current drop-shadow-lg" style={{ color: "rgba(255,255,255,0.95)" }} />
          </div>
        </div>

        {/* Phase icon */}
        <div key={`icon-${phaseIndex}`} className="animate-scale-in">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <PhaseIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Typing text */}
        <div className="text-center space-y-1 min-h-[4.5rem]">
          <h2 className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.98)", textShadow: "0 2px 20px rgba(0,0,0,0.3)", minHeight: "2rem" }}>
            {displayedText}
            <span className="inline-block w-0.5 h-6 bg-white/80 ml-1 animate-pulse align-middle" />
          </h2>
          <p key={`sub-${phaseIndex}`} className="text-base font-medium" style={{ color: "rgba(255,255,255,0.72)", textShadow: "0 1px 8px rgba(0,0,0,0.2)", animation: "fade-in 0.5s ease-out forwards" }}>
            {currentPhase.sub}
          </p>
        </div>

        {/* Songs found counter */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div className="relative">
            <Music className="w-5 h-5" style={{ color: "rgba(255,255,255,0.9)" }} />
            {isComplete && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" />
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl font-black tabular-nums"
              style={{
                color: "rgba(255,255,255,0.98)",
                textShadow: "0 2px 12px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-out",
                transform: isComplete ? "scale(1.05)" : "scale(1)",
                display: "inline-block",
              }}
            >
              {songsFound}
            </span>
            <span className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
              / {TARGET_SONGS}
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.78)" }}>
            {isComplete ? "canciones listas" : "canciones encontradas"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm space-y-2">
          <div className="text-center">
            <span className="text-5xl font-black tabular-nums" style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              {Math.round(progress)}
            </span>
            <span className="text-2xl font-bold ml-1" style={{ color: "rgba(255,255,255,0.65)" }}>%</span>
          </div>
          <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.18)" }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,240,200,0.92), rgba(255,255,255,0.85))",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            />
          </div>
        </div>

        {/* Animated waveform bars */}
        <div className="flex items-end gap-1 h-8">
          {[0.6, 1, 0.7, 0.9, 0.5, 1, 0.75, 0.85, 0.55, 0.95].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${h * 100}%`,
                background: "rgba(255,255,255,0.6)",
                animationName: "bounce-note",
                animationDuration: `${0.8 + i * 0.1}s`,
                animationDelay: `${i * 0.08}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
