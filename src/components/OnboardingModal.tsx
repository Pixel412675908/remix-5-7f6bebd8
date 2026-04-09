import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface OnboardingAnswers {
  theme: string;
  genre: string;
  protagonist: string;
  conflict: string;
  tone: string;
}

interface OnboardingModalProps {
  open: boolean;
  onSubmit: (answers: OnboardingAnswers) => void;
}

const STEPS = [
  {
    id: "theme",
    question: "Qual é o tema do seu roteiro?",
    type: "text" as const,
    placeholder: "Ex: Um músico cego que descobre que pode ver através da música...",
  },
  {
    id: "genre",
    question: "Qual o gênero?",
    type: "single" as const,
    options: [
      "Comédia", "Drama", "Thriller", "Romance", "Terror",
      "Ficção Científica", "Ação", "Aventura", "Fantasia",
      "Documental", "Noir", "Experimental",
    ],
  },
  {
    id: "protagonist",
    question: "Quem é o protagonista?",
    type: "text" as const,
    placeholder: "Descreva brevemente o personagem principal...",
  },
  {
    id: "conflict",
    question: "Qual o conflito principal?",
    type: "text" as const,
    placeholder: "O que está em jogo? Qual o obstáculo central?",
  },
  {
    id: "tone",
    question: "Qual o tom da história?",
    type: "single" as const,
    options: ["Sombrio", "Leve", "Emocional", "Tenso", "Poético", "Cru e Realista", "Com Humor"],
  },
];

const OnboardingModal = ({ open, onSubmit }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textInput, setTextInput] = useState("");

  const current = STEPS[step];
  if (!current) return null;

  const currentValue = current.type === "text" ? textInput : (answers[current.id] || "");
  const canProceed = currentValue.trim().length > 0;

  const handleNext = () => {
    const value = current.type === "text" ? textInput.trim() : answers[current.id];
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);
    setTextInput("");

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onSubmit({
        theme: updated.theme || "",
        genre: updated.genre || "",
        protagonist: updated.protagonist || "",
        conflict: updated.conflict || "",
        tone: updated.tone || "",
      });
      // Reset for next use
      setStep(0);
      setAnswers({});
    }
  };

  const handleBack = () => {
    if (step > 0) {
      if (current.type === "text") {
        setAnswers((prev) => ({ ...prev, [current.id]: textInput.trim() }));
      }
      setStep(step - 1);
      const prevStep = STEPS[step - 1];
      if (prevStep.type === "text") {
        setTextInput(answers[prevStep.id] || "");
      }
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3 }}
            className="surface-card rounded-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-6 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Novo Roteiro — {step + 1}/{STEPS.length}
              </p>
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-display text-lg text-foreground mb-5 leading-snug">
                    {current.question}
                  </h3>

                  {current.type === "text" && (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={current.placeholder}
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-200"
                      autoFocus
                    />
                  )}

                  {current.type === "single" && current.options && (
                    <div className="flex flex-wrap gap-2">
                      {current.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: opt }))}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            answers[current.id] === opt
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-muted/20 text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt}</span>
                            {answers[current.id] === opt && <Check strokeWidth={1.5} className="w-4 h-4 text-primary" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 pt-0 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors duration-200"
              >
                Voltar
              </button>
              <Button variant="brand" onClick={handleNext} disabled={!canProceed} className="px-8">
                {step < STEPS.length - 1 ? "Próxima" : "Iniciar Roteiro"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
