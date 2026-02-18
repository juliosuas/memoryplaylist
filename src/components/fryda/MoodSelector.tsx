import { cn } from "@/lib/utils";
import {
  Heart, Sunset, Smile, Wind, Zap, CloudRain,
  Moon, Flame, Mic2, Leaf, Sun
} from "lucide-react";

interface Mood {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  selected: string;
  onSelect: (id: string) => void;
}

export const MoodSelector = ({ moods, selected, onSelect }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {moods.map((mood, index) => {
        const Icon = mood.icon;
        const isSelected = selected === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onSelect(mood.id)}
            className={cn(
              "group relative flex items-center gap-3 px-4 py-3 rounded-xl",
              "border transition-all duration-200 ease-out text-left",
              "hover:scale-[1.015] active:scale-[0.98]",
              "animate-fade-up opacity-0",
              isSelected
                ? "border-primary/60 bg-primary/8 shadow-sm"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
            )}
            style={{ animationDelay: `${index * 0.04}s`, animationFillMode: "forwards" }}
          >
            {/* Icon container */}
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                isSelected
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
            </div>

            <span
              className={cn(
                "text-sm font-medium leading-tight transition-colors duration-200",
                isSelected ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
              )}
            >
              {mood.label}
            </span>

            {/* Selection dot */}
            {isSelected && (
              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-scale-in flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Export icons map for use in ExperienceForm
export const MOOD_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  enamorado:   { icon: Heart,     color: "text-rose-500" },
  nostálgico:  { icon: Sunset,    color: "text-amber-500" },
  feliz:       { icon: Smile,     color: "text-yellow-500" },
  relajado:    { icon: Wind,      color: "text-teal-500" },
  nervioso:    { icon: Zap,       color: "text-purple-500" },
  triste:      { icon: CloudRain, color: "text-blue-500" },
  reflexivo:   { icon: Moon,      color: "text-slate-500" },
  motivado:    { icon: Flame,     color: "text-red-500" },
  rapero:      { icon: Mic2,      color: "text-zinc-600" },
  esperanzado: { icon: Leaf,      color: "text-green-500" },
  libre:       { icon: Sun,       color: "text-sky-500" },
};
