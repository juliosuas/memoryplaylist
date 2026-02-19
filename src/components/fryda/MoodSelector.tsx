import { cn } from "@/lib/utils";

interface Mood {
  id: string;
  label: string;
  emoji: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  selected: string;
  onSelect: (id: string) => void;
}

export const MoodSelector = ({ moods, selected, onSelect }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {moods.map((mood, index) => (
        <button
          key={mood.id}
          type="button"
          onClick={() => onSelect(mood.id)}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl",
            "border-2 transition-all duration-300 ease-out",
            "hover:scale-[1.02] active:scale-[0.98]",
            "animate-fade-up opacity-0",
            selected === mood.id
              ? "border-primary bg-primary/10 shadow-lg"
              : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
          )}
          style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
        >
          <span 
            className={cn(
              "text-3xl transition-transform duration-300",
              selected === mood.id ? "scale-110" : "group-hover:scale-110"
            )}
          >
            {mood.emoji}
          </span>
          <span 
            className={cn(
              "text-xs font-medium text-center leading-tight",
              selected === mood.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {mood.label}
          </span>
          
          {/* Selection indicator */}
          {selected === mood.id && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
