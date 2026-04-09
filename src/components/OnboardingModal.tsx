import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";

export interface OnboardingAnswers {
  theme: string;
  genre: string;
  minDuration: number;
  maxDuration: number;
  notes: string;
}

interface OnboardingModalProps {
  open: boolean;
  onSubmit: (answers: OnboardingAnswers) => void;
  onBack?: () => void;
}

const GENRES = [
  "Drama", "Suspense", "Terror", "Comédia", "Ficção Científica",
  "Romance", "Ação", "Aventura", "Fantasia", "Thriller", "Noir", "Experimental",
];

const OnboardingModal = ({ open, onSubmit, onBack }: OnboardingModalProps) => {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [minDuration, setMinDuration] = useState(15);
  const [maxDuration, setMaxDuration] = useState(120);
  const [notes, setNotes] = useState("");

  const canSubmit = theme.trim().length > 0 && genre.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      theme: theme.trim(),
      genre,
      minDuration,
      maxDuration,
      notes: notes.trim(),
    });
    // Reset
    setTheme("");
    setGenre("");
    setMinDuration(15);
    setMaxDuration(120);
    setNotes("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-background border border-border rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto"
          >
            <div className="p-6 pb-2 flex items-start gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 shrink-0 mt-0.5"
                >
                  <ArrowLeft strokeWidth={1.5} className="w-[18px] h-[18px]" />
                </button>
              )}
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Novo Roteiro</h2>
                <p className="text-sm text-muted-foreground mt-1">Preencha os detalhes do seu projeto.</p>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-5">
              {/* TEMA */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tema <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: Um músico cego que descobre que pode ver através da música..."
                  className="mt-1.5 w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all duration-200"
                  autoFocus
                />
              </div>

              {/* GÊNERO */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Gênero <span className="text-[#dc2626]">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        genre === g
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/20 text-foreground hover:border-primary/30"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {g}
                        {genre === g && <Check strokeWidth={1.5} className="w-3.5 h-3.5 text-primary" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DURAÇÃO */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duração (minutos)
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <span className="text-[11px] text-muted-foreground">Mínimo</span>
                    <input
                      type="number"
                      min={1}
                      max={maxDuration}
                      value={minDuration}
                      onChange={(e) => setMinDuration(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <span className="text-muted-foreground mt-4">—</span>
                  <div className="flex-1">
                    <span className="text-[11px] text-muted-foreground">Máximo</span>
                    <input
                      type="number"
                      min={minDuration}
                      max={300}
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(Math.max(minDuration, Number(e.target.value)))}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* OBSERVAÇÃO */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Observação <span className="text-muted-foreground/60">(opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Qualquer detalhe extra que queira compartilhar..."
                  rows={3}
                  className="mt-1.5 w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-200"
                />
              </div>

              {/* SUBMIT */}
              <Button
                variant="brand"
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Criar Roteiro
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
