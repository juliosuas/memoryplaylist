import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Crear perfil del usuario
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_profiles").insert({
            user_id: user.id,
            name: name || email.split("@")[0],
          });
        }
        
        toast.success("¡Cuenta creada exitosamente!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-soft)] border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin
              ? "Ingresa para crear playlists emocionales"
              : "Registrate para comenzar tu viaje musical"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-input focus:ring-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-input focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-input focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Procesando..." : isLogin ? "Entrar" : "Crear Cuenta"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
