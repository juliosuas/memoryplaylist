import { useState, useRef } from "react";
import { Upload, Camera, Loader2, Sparkles, X, AlertCircle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoUploadProps {
  photoPreview: string;
  photoInsight: string | null;
  isAnalyzing: boolean;
  errorMessage?: string | null;
  onRetryAnalysis?: () => void;
  onPhotoChange: (file: File) => void;
  onPhotoRemove: () => void;
}

export const PhotoUpload = ({
  photoPreview,
  photoInsight,
  isAnalyzing,
  errorMessage,
  onRetryAnalysis,
  onPhotoChange,
  onPhotoRemove,
}: PhotoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onPhotoChange(file);
    } else {
      toast.error("Solo se permiten imágenes (JPG, PNG, etc.)");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  if (photoPreview) {
    return (
      <div className="space-y-3 animate-scale-in">
        <div className="relative rounded-2xl overflow-hidden">
        <div className="aspect-[16/9] relative">
          <img
            src={photoPreview}
            alt="Tu recuerdo"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          
          {/* Loading state */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-pulse" />
                <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <span className="text-sm font-medium text-foreground">Analizando con IA...</span>
            </div>
          )}
          
          {/* Insight badge */}
          {photoInsight && !isAnalyzing && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg animate-slide-up">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{photoInsight}</span>
              </div>
            </div>
          )}
          
          {/* Remove button */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 rounded-full shadow-lg"
            onClick={onPhotoRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        </div>

        {errorMessage && !isAnalyzing && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 animate-fade-up">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-foreground">{errorMessage}</p>
              {onRetryAnalysis && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetryAnalysis}
                  className="gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Reintentar análisis con IA
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative aspect-[16/9] rounded-2xl cursor-pointer overflow-hidden",
        "border-2 border-dashed transition-all duration-300",
        "group hover:border-primary/50",
        isDragOver
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-border bg-muted/30"
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
        <div 
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            isDragOver
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-muted group-hover:bg-primary/10"
          )}
        >
          {isDragOver ? (
            <Upload className="w-7 h-7" />
          ) : (
            <Camera className="w-7 h-7 text-muted-foreground group-hover:text-primary" />
          )}
        </div>
        
        <div className="text-center space-y-1">
          <p className="font-medium text-foreground">
            {isDragOver ? "¡Suelta aquí!" : "Sube una foto de ese momento"}
          </p>
          <p className="text-sm text-muted-foreground">
            Arrastra o haz clic • La IA analizará tus recuerdos
          </p>
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
