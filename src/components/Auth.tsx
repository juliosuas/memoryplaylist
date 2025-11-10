import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        // Mock login - check localStorage
        const users = JSON.parse(localStorage.getItem("fryda_users") || "[]");
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error("Credenciales incorrectas");
        }
        
        localStorage.setItem("fryda_current_user", JSON.stringify(user));
        toast.success("¡Bienvenido de vuelta!");
        window.dispatchEvent(new Event("storage"));
      } else {
        // Mock signup - save to localStorage
        const users = JSON.parse(localStorage.getItem("fryda_users") || "[]");
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          throw new Error("El usuario ya existe");
        }
        
        const newUser = { 
          id: Date.now().toString(), 
          email, 
          password,
          name: name || email.split("@")[0] 
        };
        users.push(newUser);
        localStorage.setItem("fryda_users", JSON.stringify(users));
        localStorage.setItem("fryda_current_user", JSON.stringify(newUser));
        toast.success("¡Cuenta creada exitosamente!");
        window.dispatchEvent(new Event("storage"));
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
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center mb-2">
            Fryda
          </CardTitle>
          <CardDescription className="text-muted-foreground text-center">
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
