import { useState, useCallback, useRef, useEffect } from "react";
import PipelineSidebar from "@/components/PipelineSidebar";
import ChatInterface from "@/components/ChatInterface";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import SettingsModal from "@/components/SettingsModal";
import FloatingToolbar from "@/components/FloatingToolbar";
import ArchiveModal from "@/components/ArchiveModal";
import PipelineModal from "@/components/PipelineModal";
import ScriptLibrarySidebar from "@/components/ScriptLibrarySidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { ProjectData, ChatMessage, PipelineStage } from "@/lib/pipeline";
import { PIPELINE_STAGES } from "@/lib/pipeline";
import type { OnboardingAnswers } from "@/components/OnboardingModal";

interface WorkspaceProps {
  project: ProjectData;
  onboardingAnswers?: OnboardingAnswers | null;
  questionAnswers?: Record<string, string | string[]> | null;
  onBack?: () => void;
  onNewScript?: () => void;
  onLoadScript?: (script: any) => void;
}

const STAGE_SYSTEM_PROMPTS: Record<string, string> = {
  deepening: `Você é um roteirista profissional de cinema. Seu papel é aprofundar a visão narrativa do usuário fazendo perguntas estratégicas sobre a história que ele quer contar. Faça UMA pergunta por vez, sempre DIFERENTE da anterior. Explore aspectos variados: protagonista, antagonista, conflito central, mundo da história, tom, referências cinematográficas, motivações, arco de transformação, tema subjacente, público-alvo, clímax desejado. NUNCA repita uma pergunta já feita. Mantenha um registro interno das perguntas feitas. Se o usuário não souber responder sobre um tema, ofereça 3-5 opções para ele escolher. Se o usuário fugir do tema do roteiro, redirecione educadamente. Responda sempre em português brasileiro. Não use emojis. Seja conciso e profissional.`,
  logline: `Você é um roteirista especializado em construir loglines cinematográficas. Com base no contexto fornecido, crie uma logline profissional e proponha a estrutura em 3 atos. Responda em português brasileiro. Sem emojis.`,
  structure: `Você é um roteirista estrutural. Desenvolva a arquitetura narrativa em 3 atos com pontos de virada, midpoint e clímax. Português brasileiro. Sem emojis.`,
  characters: `Você é especialista em construção de personagens. Desenvolva fichas completas com objetivo externo, desejo interno, ferida emocional e arco de transformação. Português brasileiro. Sem emojis.`,
  scenes: `Você é um roteirista de cenas. Planeje a sequência de cenas com ambientação, atmosfera e função narrativa. Português brasileiro. Sem emojis.`,
  writing: `Você é um roteirista cinematográfico profissional. Escreva cenas com formatação técnica da indústria: cabeçalhos INT./EXT., ação no presente, diálogos com subtexto. Português brasileiro. Sem emojis.`,
  revision: `Você é um revisor estrutural de roteiros. Identifique inconsistências, furos de roteiro e sugira correções. Português brasileiro. Sem emojis.`,
  dialogues: `Você é especialista em diálogos cinematográficos. Refine os diálogos adicionando subtexto, naturalidade e voz única para cada personagem. Português brasileiro. Sem emojis.`,
  rhythm: `Você é especialista em ritmo narrativo. Ajuste o pacing do roteiro para a duração alvo. Português brasileiro. Sem emojis.`,
  final: `Você é um roteirista sênior. Faça a validação final do roteiro garantindo qualidade profissional. Português brasileiro. Sem emojis.`,
};

const STAGE_PROVIDERS: Record<string, { provider: string; fallback: string }> = {
  deepening: { provider: "gemini", fallback: "grok" },
  logline: { provider: "gemini", fallback: "grok" },
  structure: { provider: "chatgpt", fallback: "grok" },
  characters: { provider: "gemini", fallback: "grok" },
  scenes: { provider: "gemini", fallback: "grok" },
  writing: { provider: "claude", fallback: "grok" },
  revision: { provider: "deepseek", fallback: "grok" },
  dialogues: { provider: "openrouter", fallback: "grok" },
  rhythm: { provider: "chatgpt", fallback: "grok" },
  final: { provider: "chatgpt", fallback: "grok" },
};

const SESSION_KEY = "cinescript-session";

const Workspace = ({ project, onboardingAnswers, questionAnswers, onBack, onNewScript, onLoadScript }: WorkspaceProps) => {
  const { user } = useAuth();
  const [currentStage, setCurrentStage] = useState<PipelineStage>("deepening");
  const [completedStages, setCompletedStages] = useState<PipelineStage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLibraryOpen, setScriptLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const conversationRef = useRef<Array<{ role: string; content: string }>>([]);
  const questionsAskedRef = useRef<string[]>([]);

  const isImproveMode = project.notes?.startsWith("[MELHORAR ROTEIRO EXISTENTE]") ?? false;

  // On mount: either restore session or start fresh with onboarding answers
  useEffect(() => {
    if (initialized) return;

    // Try to restore session only if no new onboarding answers and not improve mode
    if (!onboardingAnswers && !isImproveMode) {
      try {
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          if (session.projectTheme === project.theme) {
            setMessages(session.messages?.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) || []);
            setCurrentStage(session.currentStage || "deepening");
            setCompletedStages(session.completedStages || []);
            setCurrentScriptId(session.currentScriptId || null);
            conversationRef.current = session.conversationHistory || [];
            questionsAskedRef.current = session.questionsAsked || [];
            setInitialized(true);
            return;
          }
        }
      } catch {}
    }

    // Fresh start
    conversationRef.current = [];
    questionsAskedRef.current = [];
    setMessages([]);
    setCurrentStage("deepening");
    setCompletedStages([]);
    setCurrentScriptId(null);
    localStorage.removeItem(SESSION_KEY);

    if (isImproveMode) {
      generateImproveAnalysis();
    } else if (onboardingAnswers) {
      generateFirstQuestion(onboardingAnswers);
    }

    setInitialized(true);
  }, []);

  const generateImproveAnalysis = async () => {
    setIsLoading(true);
    const scriptContent = project.notes?.replace("[MELHORAR ROTEIRO EXISTENTE]\n", "") || "";
    const summary = `Tema: ${project.theme}\nGênero: ${project.genre || "Não definido"}\nDuração: ${project.minDuration}-${project.maxDuration} min\nRoteiro/Observações:\n${scriptContent}`;

    try {
      const response = await callAI(
        `O usuário enviou um roteiro existente para análise e melhoria profissional. Aqui estão os dados:\n${summary}\n\nAnalise o roteiro fornecido como um roteirista profissional de cinema. Identifique pontos fortes e fracos. Inicie a conversa apresentando uma análise inicial concisa e fazendo UMA pergunta específica sobre qual aspecto o usuário gostaria de melhorar primeiro: estrutura narrativa, desenvolvimento de personagens, diálogos, ritmo, coerência ou outro aspecto.`,
        "deepening",
        summary
      );

      setMessages([{
        id: "improve-welcome",
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      toast.error("Erro ao conectar com a IA: " + (err.message || "Tente novamente"));
      setMessages([{
        id: "improve-welcome",
        role: "assistant",
        content: `Recebi seu roteiro sobre "${project.theme}". Vou analisá-lo profissionalmente. Para começar, qual aspecto você gostaria de melhorar primeiro: estrutura narrativa, personagens, diálogos ou ritmo?`,
        timestamp: new Date(),
      }]);
    }
    setIsLoading(false);
  };

  const generateFirstQuestion = async (answers: OnboardingAnswers) => {
    setIsLoading(true);
    const qaSummary = questionAnswers
      ? Object.entries(questionAnswers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n")
      : "";
    const summary = `Tema: ${answers.theme}\nGênero: ${answers.genre}\nDuração: ${answers.minDuration}-${answers.maxDuration} min\nObservações: ${answers.notes || "Nenhuma"}\n\nRespostas de aprofundamento:\n${qaSummary}`;

    try {
      const response = await callAI(
        `O usuário configurou um novo projeto de roteiro com as seguintes informações:\n${summary}\n\nCom base nessas informações, faça UMA pergunta estratégica e específica para aprofundar a visão do usuário. Explore um aspecto que não foi coberto pelas informações iniciais — como motivação do protagonista, antagonista, arco de transformação, mundo da história ou referências cinematográficas.`,
        "deepening",
        summary
      );

      setMessages([{
        id: "welcome",
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      toast.error("Erro ao conectar com a IA: " + (err.message || "Tente novamente"));
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: `Recebi suas informações sobre "${answers.theme}". Vamos aprofundar: o que motivou você a contar essa história? Qual o evento transformador na vida do protagonista?`,
        timestamp: new Date(),
      }]);
    }
    setIsLoading(false);
  };

  // Save session on every change
  useEffect(() => {
    if (!initialized || messages.length === 0) return;
    try {
      const session = {
        projectTheme: project.theme,
        messages: messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() })),
        currentStage,
        completedStages,
        currentScriptId,
        conversationHistory: conversationRef.current,
        questionsAsked: questionsAskedRef.current,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
  }, [messages, currentStage, completedStages, currentScriptId, initialized]);

  // Auto-save to Supabase
  const saveToSupabase = useCallback(async (msgs: ChatMessage[]) => {
    if (!user || msgs.length === 0) return;

    const now = new Date();
    const defaultTitle = `Roteiro — ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

    const scriptData = {
      user_id: user.id,
      theme: project.theme,
      genre: project.genre || null,
      notes: project.notes || null,
      min_duration: project.minDuration,
      max_duration: project.maxDuration,
      current_stage: currentStage === "deepening" ? "logline" : currentStage,
      status: "in_progress",
      pipeline_outputs: { messages: msgs.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })) },
    };

    try {
      if (currentScriptId) {
        await supabase
          .from("scripts")
          .update({ ...scriptData, updated_at: now.toISOString() })
          .eq("id", currentScriptId);
      } else {
        const { data } = await supabase
          .from("scripts")
          .insert({ ...scriptData, title: defaultTitle })
          .select("id")
          .single();
        if (data) setCurrentScriptId(data.id);
      }
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  }, [user, project, currentStage, currentScriptId]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => saveToSupabase(messages), 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, saveToSupabase]);

  const callAI = async (
    userContent: string,
    stage: string,
    contextSummary: string
  ): Promise<string> => {
    const systemPrompt = STAGE_SYSTEM_PROMPTS[stage] || STAGE_SYSTEM_PROMPTS.deepening;
    const providerConfig = STAGE_PROVIDERS[stage] || STAGE_PROVIDERS.deepening;
    
    const previousQuestionsContext = questionsAskedRef.current.length > 0
      ? `\n\nPerguntas já feitas anteriormente (NÃO repita nenhuma delas):\n${questionsAskedRef.current.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";
    
    const contextMsg = contextSummary
      ? `\n\nContexto do projeto:\nTema: ${project.theme}\nGênero: ${project.genre || "Não definido"}\nDuração: ${project.minDuration}-${project.maxDuration} min\nRespostas do aprofundamento: ${contextSummary}${previousQuestionsContext}`
      : previousQuestionsContext;

    conversationRef.current.push({ role: "user", content: userContent });

    const messagesPayload = [
      { role: "system", content: systemPrompt + contextMsg },
      ...conversationRef.current.slice(-20),
    ];

    const { data, error } = await supabase.functions.invoke("ai-orchestrator", {
      body: {
        step: stage,
        provider: providerConfig.provider,
        messages: messagesPayload,
        context: { theme: project.theme, genre: project.genre },
        fallbackProvider: providerConfig.fallback,
      },
    });

    if (error) throw new Error(error.message || "Erro ao conectar com a IA");
    const result = data?.result || "Desculpe, não consegui gerar uma resposta. Tente novamente.";
    conversationRef.current.push({ role: "assistant", content: result });
    
    const questionMatch = result.match(/\?[^?]*$/);
    if (questionMatch) {
      questionsAskedRef.current.push(result.substring(0, 100));
    }
    
    return result;
  };

  const qaSummaryCtx = questionAnswers
    ? "\n" + Object.entries(questionAnswers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n")
    : "";
  const contextSummary = onboardingAnswers
    ? `Tema: ${onboardingAnswers.theme}\nGênero: ${onboardingAnswers.genre}\nDuração: ${onboardingAnswers.minDuration}-${onboardingAnswers.maxDuration} min\nObservações: ${onboardingAnswers.notes || "Nenhuma"}${qaSummaryCtx}`
    : project.notes || "";

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await callAI(content, currentStage, contextSummary);
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }]);
      } catch (err: any) {
        toast.error("Erro da IA: " + (err.message || "Tente novamente"));
      }
      setIsLoading(false);
    },
    [currentStage, contextSummary]
  );

  const handleClearHistory = () => {
    setMessages([]);
    conversationRef.current = [];
    questionsAskedRef.current = [];
    setCurrentScriptId(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const displayStage: PipelineStage =
    currentStage === "deepening" || currentStage === "input" ? "logline" : currentStage;

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      <PipelineSidebar currentStage={displayStage} completedStages={completedStages} />

      <ScriptLibrarySidebar
        open={scriptLibraryOpen}
        onClose={() => setScriptLibraryOpen(false)}
        onNewScript={() => { onNewScript?.(); }}
        onLoadScript={onLoadScript}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <WorkspaceHeader
          project={project}
          currentStage={displayStage}
          onMenuToggle={() => setScriptLibraryOpen(true)}
          onBack={onBack}
        />

        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Responda para aprofundar sua história..."
        />

        <FloatingToolbar
          onSettingsOpen={() => setSettingsOpen(true)}
          onArchiveOpen={() => setArchiveOpen(true)}
          onProgressClick={() => setPipelineModalOpen(true)}
          currentStage={displayStage}
          completedStages={completedStages}
        />
      </div>

      <PipelineModal
        open={pipelineModalOpen}
        onClose={() => setPipelineModalOpen(false)}
        currentStage={displayStage}
        completedStages={completedStages}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onClearHistory={handleClearHistory}
      />
      <ArchiveModal open={archiveOpen} onClose={() => setArchiveOpen(false)} />
    </div>
  );
};

export default Workspace;
