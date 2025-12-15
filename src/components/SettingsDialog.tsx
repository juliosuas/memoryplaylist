import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings, Trash2, HardDrive } from "lucide-react";
import { toast } from "sonner";

interface StorageMetrics {
  experiences: number;
  playlists: number;
  tracks: number;
  preferences: number;
  totalSize: string;
}

const calculateStorageMetrics = (): StorageMetrics => {
  const experiences = JSON.parse(localStorage.getItem("fryda_experiences") || "[]");
  const playlists = JSON.parse(localStorage.getItem("fryda_playlists") || "[]");
  const tracks = JSON.parse(localStorage.getItem("fryda_tracks") || "[]");
  const preferences = JSON.parse(localStorage.getItem("fryda_preferences") || "[]");

  // Calcular tamaño aproximado en KB
  const totalBytes = 
    (localStorage.getItem("fryda_experiences")?.length || 0) +
    (localStorage.getItem("fryda_playlists")?.length || 0) +
    (localStorage.getItem("fryda_tracks")?.length || 0) +
    (localStorage.getItem("fryda_preferences")?.length || 0);

  const totalKB = totalBytes / 1024;
  const totalSize = totalKB > 1024 
    ? `${(totalKB / 1024).toFixed(2)} MB` 
    : `${totalKB.toFixed(2)} KB`;

  return {
    experiences: experiences.length,
    playlists: playlists.length,
    tracks: tracks.length,
    preferences: preferences.length,
    totalSize,
  };
};

export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<StorageMetrics>({
    experiences: 0,
    playlists: 0,
    tracks: 0,
    preferences: 0,
    totalSize: "0 KB",
  });

  useEffect(() => {
    if (open) {
      setMetrics(calculateStorageMetrics());
    }
  }, [open]);

  const handleClearStorage = () => {
    localStorage.removeItem("fryda_experiences");
    localStorage.removeItem("fryda_playlists");
    localStorage.removeItem("fryda_tracks");
    localStorage.removeItem("fryda_preferences");
    
    setMetrics(calculateStorageMetrics());
    toast.success("Almacenamiento local limpiado correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Ajustes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ajustes
          </DialogTitle>
          <DialogDescription>
            Gestiona tu almacenamiento local y preferencias.
          </DialogDescription>
        </DialogHeader>
        
        {/* Métricas de uso */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="h-4 w-4 text-primary" />
            Uso de almacenamiento
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{metrics.experiences}</p>
              <p className="text-xs text-muted-foreground">Experiencias</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{metrics.playlists}</p>
              <p className="text-xs text-muted-foreground">Playlists</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{metrics.tracks}</p>
              <p className="text-xs text-muted-foreground">Canciones</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{metrics.preferences}</p>
              <p className="text-xs text-muted-foreground">Favoritos</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-semibold">{metrics.totalSize}</p>
            <p className="text-xs text-muted-foreground">Espacio total utilizado</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Limpiar todo el almacenamiento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente todas tus experiencias, playlists, canciones guardadas y favoritos. 
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearStorage}>
                  Sí, eliminar todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
