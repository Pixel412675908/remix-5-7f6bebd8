import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun } from "lucide-react";
import ProjectSetupModal from "@/components/ProjectSetupModal";
import SettingsModal from "@/components/SettingsModal";
import Workspace from "@/pages/Workspace";
import { useTheme } from "@/hooks/useTheme";
import type { ProjectData } from "@/lib/pipeline";
import { PIPELINE_STAGES } from "@/lib/pipeline";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (project) {
    return <Workspace project={project} />;
  }

  return (
    <div className="min-h-screen bg-background cinema-grain overflow-hidden">
      {/* Top bar */}
      <div className="fixed top-0 right-0 z-30 flex items-center gap-2 p-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="h-9 w-9">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-4 font-medium">
              Roteiro Profissional
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground">Cine</span>
              <span className="text-gradient-green">Script</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Plataforma inteligente de geração de roteiros cinematográficos com processo criativo
              real. De uma ideia simples a um roteiro profissional completo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="cinema" size="lg" onClick={() => setShowSetup(true)} className="px-10 text-base">
              Criar Roteiro
            </Button>
            <Button variant="cinema-outline" size="lg" className="px-10 text-base">
              Como Funciona
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-primary/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-primary/50" />
          </div>
        </motion.div>
      </section>

      {/* Pipeline preview */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-3">
              Pipeline Criativo
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              9 Etapas. Um Roteiro Real.
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-3 md:gap-4">
            {PIPELINE_STAGES.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="surface-elevated rounded-xl p-3 md:p-4 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-muted/50 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-primary/10 transition-colors">
                  <img
                    src={stage.icon}
                    alt={stage.label}
                    loading="lazy"
                    width={20}
                    height={20}
                    className="w-4 h-4 md:w-5 md:h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[11px] md:text-xs font-medium text-foreground">{stage.label}</p>
                <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1 leading-tight hidden md:block">
                  {stage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Orquestração de IA",
              desc: "Múltiplos modelos de IA especializados trabalhando em pipeline, cada um na sua etapa.",
            },
            {
              title: "Processo Adaptativo",
              desc: "Perguntas dinâmicas que se adaptam conforme a história evolui. Nada de formulários fixos.",
            },
            {
              title: "Padrão Profissional",
              desc: "Formatação técnica real da indústria audiovisual com controle preciso de duração.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="surface-elevated rounded-xl p-5 md:p-6"
            >
              <h3 className="font-display text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-border">
        <h2 className="font-display text-3xl text-foreground mb-4">
          Pronto para criar?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Transforme sua ideia em um roteiro cinematográfico profissional.
        </p>
        <Button variant="cinema" size="lg" onClick={() => setShowSetup(true)} className="px-12 text-base">
          Começar Agora
        </Button>
      </section>

      <ProjectSetupModal open={showSetup} onSubmit={(data) => { setProject(data); setShowSetup(false); }} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Index;
