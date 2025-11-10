import { useState } from "react";
import { ExperienceForm } from "@/components/ExperienceForm";
import { PlaylistResult } from "@/components/PlaylistResult";
import { Heart } from "lucide-react";

const Index = () => {
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fryda
              </h1>
              <p className="text-xs text-muted-foreground">Every memory has its song</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {currentPlaylistId ? (
          <PlaylistResult
            playlistId={currentPlaylistId}
            onBack={() => setCurrentPlaylistId(null)}
          />
        ) : (
          <ExperienceForm onPlaylistGenerated={setCurrentPlaylistId} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Every memory has its song
        </div>
      </footer>
    </div>
  );
};

export default Index;
