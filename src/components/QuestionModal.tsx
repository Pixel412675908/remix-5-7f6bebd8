import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple" | "text";
  options?: QuestionOption[];
}

interface QuestionModalProps {
  open: boolean;
  questions: Question[];
  onSubmit: (answers: Record<string, string | string[]>) => void;
  title?: string;
  subtitle?: string;
}

const QuestionModal = ({ open, questions, onSubmit, title, subtitle }: QuestionModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [freeTextInputs, setFreeTextInputs] = useState<Record<string, string>>({});

  const question = questions[currentIndex];
  if (!question) return null;

  const selectedSingle = (answers[question.id] as string) || "";
  const selectedMultiple = (answers[question.id] as string[]) || [];
  const freeText = freeTextInputs[question.id] || "";

  const handleSelectSingle = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    // Clear free text when selecting an option
    setFreeTextInputs((prev) => ({ ...prev, [question.id]: "" }));
  };

  const handleToggleMultiple = (optionId: string) => {
    setAnswers((prev) => {
      const current = (prev[question.id] as string[]) || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [question.id]: next };
    });
  };

  const handleFreeTextChange = (value: string) => {
    setFreeTextInputs((prev) => ({ ...prev, [question.id]: value }));
    if (value.trim()) {
      // Clear option selection when typing free text
      setAnswers((prev) => {
        const copy = { ...prev };
        delete copy[question.id];
        return copy;
      });
    }
  };

  const canProceed = () => {
    if (freeText.trim().length > 0) return true;
    if (question.type === "text") return freeText.trim().length > 0;
    if (question.type === "single") return !!selectedSingle;
    if (question.type === "multiple") return selectedMultiple.length > 0;
    return false;
  };

  const handleNext = () => {
    // If free text is filled, use it as the answer
    const finalAnswers = { ...answers };
    if (freeText.trim()) {
      finalAnswers[question.id] = `[custom] ${freeText.trim()}`;
    }

    if (currentIndex < questions.length - 1) {
      setAnswers(finalAnswers);
      setCurrentIndex((i) => i + 1);
    } else {
      onSubmit(finalAnswers);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg overflow-hidden"
            style={{
              borderRadius: "20px",
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
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
                {title || "Aprofundamento"} — {currentIndex + 1}/{questions.length}
              </p>
              {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
            </div>

            <div className="px-6 pb-4 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <h3 className="font-display text-lg text-foreground mb-5 leading-snug">
                    {question.text}
                  </h3>

                  {question.type === "text" && (
                    <textarea
                      value={freeText}
                      onChange={(e) => handleFreeTextChange(e.target.value)}
                      placeholder="Escreva sua resposta..."
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-150"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  )}

                  {(question.type === "single" || question.type === "multiple") && question.options && (
                    <>
                      <div className="space-y-2">
                        {question.options.map((opt) => {
                          const isSelected = question.type === "single"
                            ? selectedSingle === opt.id && !freeText.trim()
                            : selectedMultiple.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={() =>
                                question.type === "single"
                                  ? handleSelectSingle(opt.id)
                                  : handleToggleMultiple(opt.id)
                              }
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border bg-muted/20 text-foreground hover:border-primary/30"
                              }`}
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              <div className="flex items-center justify-between">
                                <span>{opt.label}</span>
                                {isSelected && <Check strokeWidth={1.5} className="w-4 h-4 text-primary" />}
                              </div>
                            </button>
                          );
                        })}
                        {question.type === "multiple" && (
                          <p className="text-xs text-muted-foreground mt-2">Selecione quantas opções desejar</p>
                        )}
                      </div>

                      {/* Free text fallback */}
                      <div className="mt-4">
                        <textarea
                          value={freeText}
                          onChange={(e) => handleFreeTextChange(e.target.value)}
                          placeholder="Caso não encontre a resposta desejada, escreva aqui para continuar"
                          rows={2}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-150"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 pt-2 flex justify-between items-center">
              <button
                onClick={() => currentIndex > 0 && setCurrentIndex((i) => i - 1)}
                disabled={currentIndex === 0}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors duration-150"
              >
                Voltar
              </button>
              <Button variant="brand" onClick={handleNext} disabled={!canProceed()} className="px-8">
                {currentIndex < questions.length - 1 ? "Próxima" : "Enviar Respostas"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal;
