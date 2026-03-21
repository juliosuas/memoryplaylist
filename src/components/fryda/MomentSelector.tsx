import { cn } from "@/lib/utils";

interface Moment {
  id: string;
  label: string;
  emoji: string;
}

interface MomentSelectorProps {
  moments: Moment[];
  selected: string;
  onSelect: (id: string) => void;
}

export const MomentSelector = ({ moments, selected, onSelect }: MomentSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {moments.map((moment, index) => (
        <button
          key={moment.id}
          type="button"
          onClick={() => onSelect(selected === moment.id ? "" : moment.id)}
          className={cn(
            "group relative flex items-center gap-3 p-3 rounded-xl",
            "border-2 transition-all duration-300 ease-out",
            "hover:scale-[1.02] active:scale-[0.98]",
            "animate-fade-up opacity-0",
            selected === moment.id
              ? "border-accent bg-accent/10 shadow-lg"
              : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
          )}
          style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
        >
          <span 
            className={cn(
              "text-2xl transition-transform duration-300 flex-shrink-0",
              selected === moment.id ? "scale-110" : "group-hover:scale-110"
            )}
          >
            {moment.emoji}
          </span>
          <span 
            className={cn(
              "text-sm font-medium text-left leading-tight",
              selected === moment.id ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {moment.label}
          </span>
          
          {selected === moment.id && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-2.5 h-2.5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
