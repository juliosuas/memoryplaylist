import { Slider } from "@/components/ui/slider";
import { Music, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscoverySliderProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export const DiscoverySlider = ({ value, onChange }: DiscoverySliderProps) => {
  const percentage = value[0];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Music className="w-4 h-4" />
          <span>Favoritos</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Descubrir</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative">
        <Slider
          value={value}
          onValueChange={onChange}
          max={100}
          step={5}
          className="py-2"
        />
        
        {/* Custom track visualization */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 to-primary/40"
            style={{ width: `${percentage}%` }}
          />
          <div 
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-accent/20 to-accent/40"
            style={{ width: `${100 - percentage}%` }}
          />
        </div>
      </div>
      
      {/* Value indicator */}
      <div className="flex justify-center">
        <div 
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            "bg-gradient-to-r from-primary/10 to-accent/10 border border-border"
          )}
        >
          <span className="text-primary">{100 - percentage}% favoritos</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-accent">{percentage}% nuevas</span>
        </div>
      </div>
    </div>
  );
};
