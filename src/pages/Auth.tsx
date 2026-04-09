import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 2) return { level: 1, label: "Fraca", color: "bg-[#dc2626]" };
    if (score <= 3) return { level: 2, label: "Média", color: "bg-[#ea580c]" };
    return { level: 3, label: "Forte", color: "bg-[#16a34a]" };
  };

  const strength = getPasswordStrength(password);

  const generateEmail = (uname: string) => `${uname.toLowerCase().replace(/[^a-z0-9]/g, "")}@cinescript.app`;

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!isLogin && strength.level < 3) {
      toast.error("A senha deve conter: mínimo 8 caracteres, letra minúscula, maiúscula, número e caractere especial");
      return;
    }

    setLoading(true);
    const email = generateEmail(username);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username.trim() } },
        });
        if (error) throw error;
        toast.success("Conta criada com sucesso!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-5">
      <ThemeToggle position="fixed-bottom-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">
            <span className="text-foreground">Cine</span>
            <span className="text-gradient-brand">Script</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        <div className="surface-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Nome de Usuário
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu nome de usuário"
              className="mt-1.5 w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Senha
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {showPassword ? <EyeOff strokeWidth={1.5} className="w-4 h-4" /> : <Eye strokeWidth={1.5} className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                        i <= strength.level ? strength.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Senha {strength.label}
                </p>
                <ul className="text-[10px] text-muted-foreground space-y-0.5">
                  <li className={password.length >= 8 ? "text-[#16a34a]" : ""}>Mínimo 8 caracteres</li>
                  <li className={/[a-z]/.test(password) ? "text-[#16a34a]" : ""}>Letra minúscula</li>
                  <li className={/[A-Z]/.test(password) ? "text-[#16a34a]" : ""}>Letra maiúscula</li>
                  <li className={/[0-9]/.test(password) ? "text-[#16a34a]" : ""}>Números</li>
                  <li className={/[^a-zA-Z0-9]/.test(password) ? "text-[#16a34a]" : ""}>Dígito especial ($@&#)</li>
                </ul>
              </div>
            )}
          </div>

          <Button
            variant="brand"
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setPassword(""); }}
            className="text-primary hover:underline font-medium transition-colors duration-200"
          >
            {isLogin ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
