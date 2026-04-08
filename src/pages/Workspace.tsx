import { useState, useCallback } from "react";
import PipelineSidebar, { PipelineSidebarContent } from "@/components/PipelineSidebar";
import ChatInterface from "@/components/ChatInterface";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import QuestionModal from "@/components/QuestionModal";
import SettingsModal from "@/components/SettingsModal";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DEEPENING_QUESTIONS } from "@/lib/questions";
import type { ProjectData, ChatMessage, PipelineStage } from "@/lib/pipeline";

interface WorkspaceProps {
  project: ProjectData;
}

const Workspace = ({ project }: WorkspaceProps) => {
  const [currentStage, setCurrentStage] = useState<PipelineStage>("deepening");
  const [completedStages, setCompletedStages] = useState<PipelineStage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string | string[]> | null>(null);

  const handleQuestionsSubmit = useCallback(
    (answers: Record<string, string | string[]>) => {
      setQuestionAnswers(answers);
      setShowQuestions(false);

      // Build summary from answers
      const summary = Object.entries(answers)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("\n");

      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Excelente! Recebi suas respostas sobre "${project.theme}"${project.genre ? ` no gênero ${project.genre}` : ""}.\n\nAgora tenho uma visão muito mais clara da sua história. Com base nas suas escolhas, vou começar a construir a logline e a estrutura narrativa.\n\nVamos refinar juntos. Me conte: o que motivou você a contar essa história? Há alguma experiência pessoal ou referência cinematográfica que inspira esse projeto?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    },
    [project]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Simulated response — will be replaced by real AI pipeline
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Obrigado por compartilhar isso. Essa camada emocional é fundamental para a construção do roteiro.\n\nAgora, fale-me sobre o protagonista — não precisa ser um nome ainda, mas quem é essa pessoa? O que a move? O que ela esconde de si mesma?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 1500);
    },
    []
  );

  const displayStage: PipelineStage =
    currentStage === "deepening" || currentStage === "input" ? "logline" : currentStage;

  return (
    <div className="flex h-screen bg-background">
      <PipelineSidebar currentStage={displayStage} completedStages={completedStages} />

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Pipeline</SheetTitle>
          <PipelineSidebarContent currentStage={displayStage} completedStages={completedStages} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader
          project={project}
          currentStage={displayStage}
          onMenuToggle={() => setMobileMenuOpen(true)}
          onSettingsOpen={() => setSettingsOpen(true)}
        />
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Responda para aprofundar sua história..."
        />
      </div>

      {/* Question modal for deepening */}
      <QuestionModal
        open={showQuestions}
        questions={DEEPENING_QUESTIONS}
        onSubmit={handleQuestionsSubmit}
        title="Aprofundamento Narrativo"
        subtitle="Suas respostas guiarão as IAs na criação do roteiro"
      />

      {/* Settings */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Workspace;
