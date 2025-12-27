import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

export const GenerateButton = ({ isLoading, disabled }: GenerateButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        "w-full h-14 text-lg font-semibold rounded-xl",
        "bg-gradient-to-r from-primary to-accent hover:opacity-90",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !disabled && !isLoading && "animate-pulse-glow"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Creando tu playlist...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Generar Playlist
        </>
      )}
    </Button>
  );
};
