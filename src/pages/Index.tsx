import { useEffect, useState } from "react";
import { Auth } from "@/components/Auth";
import { ExperienceForm } from "@/components/ExperienceForm";
import { PlaylistResult } from "@/components/PlaylistResult";
import { Button } from "@/components/ui/button";
import { LogOut, Music } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Sesión cerrada");
      setCurrentPlaylistId(null);
    } catch (error: any) {
      toast.error("Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="animate-pulse text-center space-y-4">
          <Music className="w-16 h-16 text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mood Playlist
            </h1>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
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
          Crea playlists que reflejan tus emociones
        </div>
      </footer>
    </div>
  );
};

export default Index;
