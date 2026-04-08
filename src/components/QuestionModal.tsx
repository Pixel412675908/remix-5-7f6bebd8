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
  const [textInput, setTextInput] = useState("");

  const question = questions[currentIndex];
  if (!question) return null;

  const selectedSingle = (answers[question.id] as string) || "";
  const selectedMultiple = (answers[question.id] as string[]) || [];

  const handleSelectSingle = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
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

  const canProceed = () => {
    if (question.type === "text") return textInput.trim().length > 0;
    if (question.type === "single") return !!selectedSingle;
    if (question.type === "multiple") return selectedMultiple.length > 0;
    return false;
  };

  const handleNext = () => {
    if (question.type === "text") {
      setAnswers((prev) => ({ ...prev, [question.id]: textInput.trim() }));
      setTextInput("");
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const finalAnswers = { ...answers };
      if (question.type === "text") finalAnswers[question.id] = textInput.trim();
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3 }}
            className="surface-card rounded-2xl w-full max-w-lg overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            {/* Progress */}
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

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-display text-lg text-foreground mb-5 leading-snug">
                    {question.text}
                  </h3>

                  {question.type === "text" && (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Escreva sua resposta..."
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-150"
                    />
                  )}

                  {question.type === "single" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectSingle(opt.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                            selectedSingle === opt.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-muted/20 text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt.label}</span>
                            {selectedSingle === opt.id && <Check strokeWidth={1.5} className="w-4 h-4 text-primary" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === "multiple" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((opt) => {
                        const isSelected = selectedMultiple.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleToggleMultiple(opt.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-muted/20 text-foreground hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt.label}</span>
                              {isSelected && <Check strokeWidth={1.5} className="w-4 h-4 text-primary" />}
                            </div>
                          </button>
                        );
                      })}
                      <p className="text-xs text-muted-foreground mt-2">Selecione quantas opções desejar</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 pt-0 flex justify-between items-center">
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
