import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export function AuthModal({ open, onOpenChange, onAuthed }) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetLocal = () => {
    setError("");
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ full_name: fullName, email, password });
      }

      resetLocal();
      onOpenChange(false);
      if (onAuthed) onAuthed();
    } catch (err) {
      setError(err?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-green-700">
                {mode === "login" ? "Acessar Painel" : "Criar Conta"}
              </DialogTitle>
              <DialogDescription>
                {mode === "login"
                  ? "Entre com seu e-mail e senha."
                  : "Cadastro simples: nome, e-mail e senha."}
              </DialogDescription>
            </div>

            <Badge variant="outline" className="border-green-300 text-green-700">
              JWT • Email
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "login" ? "default" : "outline"}
            className={mode === "login" ? "bg-green-600 hover:bg-green-700 w-1/2" : "w-1/2"}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Entrar
          </Button>
          <Button
            type="button"
            variant={mode === "register" ? "default" : "outline"}
            className={mode === "register" ? "bg-emerald-600 hover:bg-emerald-700 w-1/2" : "w-1/2"}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Criar conta
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label>Nome completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}

          <div>
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <Label>Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
          >
            {loading ? "Processando..." : mode === "login" ? "Entrar" : "Concluir Cadastro"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
