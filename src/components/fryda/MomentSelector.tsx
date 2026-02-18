import { cn } from "@/lib/utils";
import { Palmtree, PartyPopper, Home, HeartCrack, Radio, Stars, Lightbulb, Camera } from "lucide-react";

interface Moment {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface MomentSelectorProps {
  moments: Moment[];
  selected: string;
  onSelect: (id: string) => void;
}

export const MomentSelector = ({ moments, selected, onSelect }: MomentSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {moments.map((moment, index) => {
        const Icon = moment.icon;
        const isSelected = selected === moment.id;
        return (
          <button
            key={moment.id}
            type="button"
            onClick={() => onSelect(moment.id)}
            className={cn(
              "group relative flex items-center gap-3 p-3 rounded-xl",
              "border transition-all duration-200 ease-out",
              "hover:scale-[1.015] active:scale-[0.98]",
              "animate-fade-up opacity-0",
              isSelected
                ? "border-accent/60 bg-accent/8 shadow-sm"
                : "border-border bg-card hover:border-accent/30 hover:bg-muted/40"
            )}
            style={{ animationDelay: `${index * 0.04}s`, animationFillMode: "forwards" }}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                isSelected
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
              )}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
            </div>
            <span
              className={cn(
                "text-sm font-medium text-left leading-tight transition-colors duration-200",
                isSelected ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
              )}
            >
              {moment.label}
            </span>
            {isSelected && (
              <div className="ml-auto w-2 h-2 rounded-full bg-accent animate-scale-in flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export const MOMENT_ICONS: Record<string, React.ElementType> = {
  vacaciones:  Palmtree,
  fiesta:      PartyPopper,
  tranquilo:   Home,
  despedida:   HeartCrack,
  concierto:   Radio,
  noche:       Stars,
  inspiracion: Lightbulb,
  evento:      Camera,
};
