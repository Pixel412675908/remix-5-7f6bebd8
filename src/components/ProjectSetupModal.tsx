import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ProjectData } from "@/lib/pipeline";

interface ProjectSetupModalProps {
  open: boolean;
  onSubmit: (data: ProjectData) => void;
  isImproveMode?: boolean;
}

const GENRES = [
  "Drama", "Suspense", "Terror", "Comédia", "Ficção Científica",
  "Romance", "Ação", "Aventura", "Fantasia", "Documental",
  "Thriller", "Noir", "Experimental",
];

const ProjectSetupModal = ({ open, onSubmit, isImproveMode }: ProjectSetupModalProps) => {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");
  const [existingScript, setExistingScript] = useState("");
  const [minDuration, setMinDuration] = useState(15);
  const [maxDuration, setMaxDuration] = useState(30);

  const handleSubmit = () => {
    if (!theme.trim()) return;
    const finalNotes = isImproveMode
      ? `${existingScript}\n\nObservações: ${notes.trim()}`
      : notes.trim();
    onSubmit({ theme: theme.trim(), genre, notes: finalNotes, minDuration, maxDuration });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="surface-card rounded-t-2xl sm:rounded-2xl w-full max-w-lg sm:mx-4 max-h-[90vh] overflow-y-auto"
            style={{ borderRadius: "16px" }}
          >
            <div className="p-6 pb-4 border-b border-border">
              <h2 className="font-display text-2xl text-foreground">
                {isImproveMode ? "Melhorar Roteiro" : "Novo Projeto"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isImproveMode
                  ? "Cole ou descreva seu roteiro existente para a IA analisar e melhorar"
                  : "Conte-nos sobre o seu filme"}
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {isImproveMode ? "Título ou Tema do Roteiro *" : "Tema do Filme *"}
                </label>
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder={isImproveMode
                    ? "Ex: Meu roteiro sobre a jornada de um astronauta..."
                    : "Ex: Um músico cego que descobre que pode ver através da música..."}
                  className="mt-2 w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all duration-150"
                />
              </div>

              {isImproveMode && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cole seu roteiro aqui
                  </label>
                  <textarea
                    value={existingScript}
                    onChange={(e) => setExistingScript(e.target.value)}
                    placeholder="Cole o texto do roteiro existente que deseja melhorar..."
                    rows={8}
                    className="mt-2 w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-150"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gênero</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(genre === g ? "" : g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
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

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duração do Filme</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Mínimo</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={minDuration}
                        onChange={(e) => setMinDuration(Number(e.target.value))}
                        min={5} max={180}
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-all duration-150"
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
                        min={5} max={180}
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-all duration-150"
                      />
                      <span className="text-xs text-muted-foreground shrink-0">min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Observações</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isImproveMode
                    ? "O que gostaria de melhorar? Diálogos, estrutura, ritmo..."
                    : "Alguma referência, tom desejado, requisito específico..."}
                  rows={3}
                  className="mt-2 w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-150"
                />
              </div>
            </div>

            <div className="p-6 pt-2 flex justify-end">
              <Button variant="brand" size="lg" onClick={handleSubmit} disabled={!theme.trim()} className="px-8">
                {isImproveMode ? "Analisar e Melhorar" : "Iniciar Processo Criativo"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectSetupModal;
