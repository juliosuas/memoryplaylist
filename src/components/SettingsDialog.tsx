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
import { Settings, Trash2, HardDrive, Music } from "lucide-react";
import { toast } from "sonner";
import { listGeneratedPlaylists, type StoredPlaylist } from "@/lib/localPlaylistStore";

interface StorageMetrics {
  experiences: number;
  playlists: number;
  tracks: number;
  preferences: number;
  totalSize: string;
}

const calculateStorageMetrics = (): StorageMetrics => {
  const experiences = JSON.parse(localStorage.getItem("vibeplaylist_experiences") || "[]");
  const playlists = JSON.parse(localStorage.getItem("vibeplaylist_playlists") || "[]");
  const tracks = JSON.parse(localStorage.getItem("vibeplaylist_tracks") || "[]");
  const preferences = JSON.parse(localStorage.getItem("vibeplaylist_preferences") || "[]");

  // Calcular tamaño aproximado en KB
  const totalBytes = 
    (localStorage.getItem("vibeplaylist_experiences")?.length || 0) +
    (localStorage.getItem("vibeplaylist_playlists")?.length || 0) +
    (localStorage.getItem("vibeplaylist_tracks")?.length || 0) +
    (localStorage.getItem("vibeplaylist_preferences")?.length || 0);

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

interface SettingsDialogProps {
  triggerClassName?: string;
  onOpenPlaylist?: (playlistId: string) => void;
}

export const SettingsDialog = ({ triggerClassName, onOpenPlaylist }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [recentPlaylists, setRecentPlaylists] = useState<StoredPlaylist[]>([]);
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
      setRecentPlaylists(listGeneratedPlaylists(5));
    }
  }, [open]);

  const handleClearStorage = () => {
    localStorage.removeItem("vibeplaylist_experiences");
    localStorage.removeItem("vibeplaylist_playlists");
    localStorage.removeItem("vibeplaylist_tracks");
    localStorage.removeItem("vibeplaylist_preferences");
    
    setMetrics(calculateStorageMetrics());
    setRecentPlaylists([]);
    toast.success("Almacenamiento local limpiado correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={triggerClassName ?? "fixed top-4 right-4 z-50"}>
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

          {recentPlaylists.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Music className="h-4 w-4 text-primary" />
                Playlists recientes
              </div>
              <div className="space-y-2">
                {recentPlaylists.map((playlist) => (
                  <button
                    key={String(playlist.id)}
                    type="button"
                    onClick={() => {
                      onOpenPlaylist?.(String(playlist.id));
                      setOpen(false);
                    }}
                    className="w-full rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <p className="truncate text-sm font-medium">{String(playlist.name ?? "Playlist sin nombre")}</p>
                    <p className="text-xs text-muted-foreground">
                      {playlist.emotion ?? "mood"} · {playlist.new_music_percentage ?? 0}% nuevas
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
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
