import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ProjectData } from "@/lib/pipeline";

interface ProjectSetupModalProps {
  open: boolean;
  onSubmit: (data: ProjectData) => void;
}

const GENRES = [
  "Drama", "Suspense", "Terror", "Comédia", "Ficção Científica",
  "Romance", "Ação", "Aventura", "Fantasia", "Documental",
  "Thriller", "Noir", "Experimental",
];

const ProjectSetupModal = ({ open, onSubmit }: ProjectSetupModalProps) => {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");
  const [minDuration, setMinDuration] = useState(15);
  const [maxDuration, setMaxDuration] = useState(30);

  const handleSubmit = () => {
    if (!theme.trim()) return;
    onSubmit({ theme: theme.trim(), genre, notes: notes.trim(), minDuration, maxDuration });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="surface-elevated rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border">
              <h2 className="font-display text-2xl text-foreground">Novo Projeto</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Conte-nos sobre o seu filme
              </p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Theme */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tema do Filme *
                </label>
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: Um músico cego que descobre que pode ver através da música..."
                  className="mt-2 w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Gênero
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(genre === g ? "" : g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        genre === g
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duração do Filme
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Mínimo</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={minDuration}
                        onChange={(e) => setMinDuration(Number(e.target.value))}
                        min={5}
                        max={180}
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-all"
                      />
                      <span className="text-xs text-muted-foreground shrink-0">min</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground pt-4">—</div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Máximo</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={maxDuration}
                        onChange={(e) => setMaxDuration(Number(e.target.value))}
                        min={5}
                        max={180}
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-all"
                      />
                      <span className="text-xs text-muted-foreground shrink-0">min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma referência, tom desejado, requisito específico..."
                  rows={3}
                  className="mt-2 w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 flex justify-end">
              <Button
                variant="cinema"
                size="lg"
                onClick={handleSubmit}
                disabled={!theme.trim()}
                className="px-8"
              >
                Iniciar Processo Criativo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectSetupModal;
