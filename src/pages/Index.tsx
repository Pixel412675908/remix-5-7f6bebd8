import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ProjectSetupModal from "@/components/ProjectSetupModal";
import OnboardingModal from "@/components/OnboardingModal";
import type { OnboardingAnswers } from "@/components/OnboardingModal";
import QuestionModal from "@/components/QuestionModal";
import { DEEPENING_QUESTIONS } from "@/lib/questions";
import SettingsModal from "@/components/SettingsModal";
import Workspace from "@/pages/Workspace";
import ThemeToggle from "@/components/ThemeToggle";
import type { ProjectData } from "@/lib/pipeline";
import { PIPELINE_STAGES } from "@/lib/pipeline";
import {
  Lightbulb, LayoutList, Users, Film, PenTool, Search, MessageCircle, Timer, Award
} from "lucide-react";

const STAGE_ICONS: Record<string, React.ElementType> = {
  logline: Lightbulb,
  structure: LayoutList,
  characters: Users,
  scenes: Film,
  writing: PenTool,
  revision: Search,
  dialogues: MessageCircle,
  rhythm: Timer,
  final: Award,
};

const Index = () => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showImprove, setShowImprove] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewScript = useCallback(() => {
    localStorage.removeItem("cinescript-session");
    setProject(null);
    setOnboardingAnswers(null);
    setQuestionAnswers(null);
    setShowOnboarding(true);
  }, []);

  const handleOnboardingSubmit = useCallback((answers: OnboardingAnswers) => {
    setShowOnboarding(false);
    setOnboardingAnswers(answers);
    // Show deepening questions before opening workspace
    setShowQuestions(true);
  }, []);

  const handleQuestionsSubmit = useCallback((answers: Record<string, string | string[]>) => {
    setShowQuestions(false);
    setQuestionAnswers(answers);
    if (onboardingAnswers) {
      setProject({
        theme: onboardingAnswers.theme,
        genre: onboardingAnswers.genre,
        notes: onboardingAnswers.notes || "",
        minDuration: onboardingAnswers.minDuration,
        maxDuration: onboardingAnswers.maxDuration,
      });
    }
  }, [onboardingAnswers]);

  if (project) {
    return (
      <Workspace
        project={project}
        onboardingAnswers={onboardingAnswers}
        questionAnswers={questionAnswers}
        onBack={() => { setProject(null); setOnboardingAnswers(null); setQuestionAnswers(null); }}
        onNewScript={handleNewScript}
        onLoadScript={(s) => {
          localStorage.removeItem("cinescript-session");
          setOnboardingAnswers(null);
          setQuestionAnswers(null);
          setProject({
            theme: s.theme,
            genre: s.genre || "",
            notes: s.notes || "",
            minDuration: s.min_duration,
            maxDuration: s.max_duration,
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden">
      {/* Top bar */}
      <div className="fixed top-0 right-0 z-30 flex items-center gap-1 p-4">
        <ThemeToggle position="inline" />
        <button onClick={() => setShowSettings(true)} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200">
          <Settings strokeWidth={1.5} className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Hero */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            <span className="text-foreground">Cine</span>
            <span className="text-gradient-brand">Script</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Plataforma de roteirização profissional com múltiplas IAs especializadas.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="brand" size="lg" onClick={handleNewScript} className="px-10">
              Criar Roteiro
            </Button>
            <Button variant="brand-outline" size="lg" onClick={() => setShowImprove(true)} className="px-10">
              Melhorar Roteiro Existente
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Pipeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              9 Etapas. Um Roteiro Real.
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-9 gap-3">
            {PIPELINE_STAGES.map((stage, i) => {
              const Icon = STAGE_ICONS[stage.id] || Lightbulb;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="surface-card rounded-xl p-3 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-200 cursor-default"
                >
                  <Icon
                    strokeWidth={1.5}
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200 mb-2"
                  />
                  <p className="text-[11px] font-medium text-foreground">{stage.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight hidden md:block">
                    {stage.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { title: "Orquestração Multi-IA", desc: "Gemini, Claude, GPT, DeepSeek — cada IA com seu papel específico no pipeline." },
            { title: "Processo Adaptativo", desc: "Perguntas dinâmicas que se adaptam conforme a história evolui." },
            { title: "Padrão Profissional", desc: "Formatação técnica da indústria audiovisual com controle de duração." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface-card rounded-xl p-5"
            >
              <h3 className="font-display text-base text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-border">
        <h2 className="font-display text-2xl text-foreground mb-4">Pronto para criar?</h2>
        <Button variant="brand" size="lg" onClick={handleNewScript} className="px-12">
          Começar Agora
        </Button>
      </section>

      <OnboardingModal open={showOnboarding} onSubmit={handleOnboardingSubmit} onBack={() => setShowOnboarding(false)} />

      <QuestionModal
        open={showQuestions}
        questions={DEEPENING_QUESTIONS}
        onSubmit={handleQuestionsSubmit}
        title="Aprofundamento"
        subtitle="Quanto mais detalhes, melhor o roteiro"
      />

      <ProjectSetupModal
        open={showImprove}
        onSubmit={(data) => {
          setProject({ ...data, notes: `[MELHORAR ROTEIRO EXISTENTE]\n${data.notes}` });
          setShowImprove(false);
        }}
        isImproveMode
        onBack={() => setShowImprove(false)}
      />
      
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Index;
