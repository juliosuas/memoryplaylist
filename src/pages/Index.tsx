import { useEffect, useState } from "react";
import { ExperienceForm } from "@/components/ExperienceForm";
import { PlaylistResult } from "@/components/PlaylistResult";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Heart } from "lucide-react";
import { importSharedPlaylistFromUrl } from "@/lib/localPlaylistStore";

const Index = () => {
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    const shared = importSharedPlaylistFromUrl(window.location.hash);
    if (shared) setCurrentPlaylistId(shared.playlist.id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SettingsDialog triggerClassName="" onOpenPlaylist={setCurrentPlaylistId} />
          <button
            onClick={() => setCurrentPlaylistId(null)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gradient">Fryda</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Every memory has its song</p>
            </div>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 max-w-xl">
        {/* Hero - only on form view */}
        {!currentPlaylistId && (
          <div className="text-center mb-10 animate-fade-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-gradient mb-3">
              Revive tus recuerdos
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Sube una foto, cuéntanos cómo te sentías, y crearemos la playlist perfecta para ese momento.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border/50">
          {currentPlaylistId ? (
            <PlaylistResult playlistId={currentPlaylistId} onBack={() => setCurrentPlaylistId(null)} />
          ) : (
            <ExperienceForm onPlaylistGenerated={setCurrentPlaylistId} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Hecho con <Heart className="w-3 h-3 inline text-primary fill-primary" /> para revivir momentos especiales
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
