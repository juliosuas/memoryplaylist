import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ExperienceFormProps {
  onPlaylistGenerated: (playlistId: string) => void;
}

export const ExperienceForm = ({ onPlaylistGenerated }: ExperienceFormProps) => {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [discoveryPercentage, setDiscoveryPercentage] = useState([50]);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Por favor describe tu experiencia");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      let photoUrl = "";
      
      // Subir foto si existe
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("experience-photos")
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("experience-photos")
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      // Llamar a edge function para analizar emoción y generar playlist
      const { data, error } = await supabase.functions.invoke("analyze-emotion", {
        body: {
          description,
          photoUrl,
          discoveryPercentage: discoveryPercentage[0],
          userId: user.id,
        },
      });

      if (error) throw error;

      toast.success(`¡Playlist generada! Emoción: ${data.emotion}`);
      onPlaylistGenerated(data.playlistId);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al generar playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-[var(--shadow-soft)] backdrop-blur-sm bg-card/80">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Comparte tu Momento
        </h2>
        <p className="text-muted-foreground">
          Describe lo que sientes, los olores, las sensaciones... Nosotros crearemos la banda sonora perfecta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload de foto */}
        <div className="space-y-2">
          <Label htmlFor="photo" className="text-foreground">Foto (opcional)</Label>
          <div className="relative">
            {photoPreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview("");
                  }}
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click para subir una foto</span>
              </label>
            )}
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Describe tu experiencia
          </Label>
          <Textarea
            id="description"
            placeholder="Estoy en la playa al atardecer, siento la brisa salada, el aroma del mar... me siento nostálgico pero en paz..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="resize-none border-input focus:ring-primary"
            required
          />
        </div>

        {/* Slider de descubrimiento */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground">Descubrimiento</Label>
            <span className="text-sm font-medium text-primary">{discoveryPercentage[0]}%</span>
          </div>
          <Slider
            value={discoveryPercentage}
            onValueChange={setDiscoveryPercentage}
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {discoveryPercentage[0] < 30
              ? "Más canciones familiares"
              : discoveryPercentage[0] > 70
              ? "Más canciones nuevas para descubrir"
              : "Balance entre familiar y nuevo"}
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="gradient"
          className="w-full"
        >
          {loading ? (
            "Generando tu playlist..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Playlist
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
