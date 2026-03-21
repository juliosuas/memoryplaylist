import { useState, useEffect } from "react";
import { Heart, Music } from "lucide-react";

const PHASES = [
  { message: "Analizando tu foto...", emoji: "📸", sub: "Detectando emociones y ambiente" },
  { message: "Interpretando tus emociones...", emoji: "💭", sub: "Entendiendo cómo te sientes" },
  { message: "Buscando las canciones perfectas...", emoji: "🎵", sub: "Encontrando el ritmo perfecto" },
  { message: "Creando tu playlist...", emoji: "✨", sub: "Casi listo, preparando la magia" },
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

const NOTES = [
  { note: "🎵", left: "10%", delay: "0s",   duration: "4s",   fontSize: "1.8rem" },
  { note: "🎶", left: "25%", delay: "0.6s", duration: "5s",   fontSize: "1.4rem" },
  { note: "♪",  left: "45%", delay: "1.2s", duration: "3.5s", fontSize: "2rem"   },
  { note: "♫",  left: "65%", delay: "0.3s", duration: "4.5s", fontSize: "1.6rem" },
  { note: "🎵", left: "80%", delay: "0.9s", duration: "5.5s", fontSize: "1.3rem" },
  { note: "🎶", left: "92%", delay: "1.8s", duration: "4s",   fontSize: "1.7rem" },
];

const TARGET_SONGS = 20;

interface PlaylistLoaderProps {
  hasPhoto: boolean;
  onCancel?: () => void;
}

export const PlaylistLoader = ({ hasPhoto }: PlaylistLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [songsFound, setSongsFound] = useState(0);
  

  // Progress + song counter — slow & dramatic (~8s to reach 95%)
  useEffect(() => {
    if (!hasPhoto) setPhaseIndex(1);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Very slow ramp: takes ~8s to reach 95
        const increment = prev < 20 ? 0.8 : prev < 50 ? 0.5 : prev < 80 ? 0.35 : 0.18;
        return Math.min(95, prev + increment);
      });
    }, 80);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, 2000);

    // Song counter: ramp up slowly over ~6.5s
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

  // Typing effect
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

      {/* Floating musical notes */}
      {NOTES.map((n, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: n.left, bottom: "-10%",
            fontSize: n.fontSize, opacity: 0.85,
            animationName: "float-note",
            animationDuration: n.duration,
            animationDelay: n.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >
          {n.note}
        </div>
      ))}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-6">

        {/* Heart with pulsing rings */}
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <div className="absolute rounded-full border-4 border-white/20" style={{ width: 160, height: 160, animation: "ping-slow 2.4s ease-out infinite", animationDelay: "0.4s" }} />
          <div className="absolute rounded-full border-4 border-white/30" style={{ width: 128, height: 128, animation: "ping-slow 2.4s ease-out infinite", animationDelay: "0.2s" }} />
          <div className="absolute rounded-full border-4 border-white/40" style={{ width: 100, height: 100, animation: "ping-slow 2.4s ease-out infinite" }} />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15))",
              boxShadow: "0 0 50px rgba(255,255,255,0.4), 0 0 100px rgba(255,200,200,0.3)",
              backdropFilter: "blur(8px)",
              border: "2px solid rgba(255,255,255,0.4)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <Heart className="w-12 h-12 fill-current drop-shadow-lg" style={{ color: "rgba(255,255,255,0.95)" }} />
          </div>
        </div>

        {/* Phase emoji + text */}
        <div key={`emoji-${phaseIndex}`} className="text-5xl animate-scale-in" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
          {currentPhase.emoji}
        </div>

        <div className="text-center space-y-1 min-h-[4.5rem]">
          <h2 className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.98)", textShadow: "0 2px 20px rgba(0,0,0,0.3)", minHeight: "2rem" }}>
            {displayedText}
            <span className="inline-block w-0.5 h-6 bg-white/80 ml-1 animate-pulse align-middle" />
          </h2>
          <p key={`sub-${phaseIndex}`} className="text-base font-medium" style={{ color: "rgba(255,255,255,0.75)", textShadow: "0 1px 8px rgba(0,0,0,0.2)", animation: "fade-in 0.5s ease-out forwards" }}>
            {currentPhase.sub}
          </p>
        </div>

        {/* ── Songs Found Counter ── */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
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
            <span className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
              / {TARGET_SONGS}
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
            {isComplete ? "🎉 canciones listas" : "canciones encontradas"}
          </span>
        </div>

        {/* Progress section */}
        <div className="w-full max-w-sm space-y-2">
          <div className="text-center">
            <span className="text-5xl font-black tabular-nums" style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              {Math.round(progress)}
            </span>
            <span className="text-2xl font-bold ml-1" style={{ color: "rgba(255,255,255,0.7)" }}>%</span>
          </div>

          <div className="relative h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,240,200,0.95), rgba(255,255,255,0.9))",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              }}
            />
          </div>
        </div>

        {/* Bottom bouncing notes */}
        <div className="flex gap-6">
          {["🎵", "🎶", "♪", "♫", "🎵"].map((note, i) => (
            <span key={i} className="text-2xl opacity-70" style={{ animationName: "bounce-note", animationDuration: "1.5s", animationDelay: `${i * 0.15}s`, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", display: "inline-block" }}>
              {note}
            </span>
          ))}
        </div>

        {/* Cancel button — appears after 5 seconds */}
        {showCancel && onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 animate-fade-up"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};
