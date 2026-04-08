import { useState, useCallback } from "react";
import PipelineSidebar from "@/components/PipelineSidebar";
import ChatInterface from "@/components/ChatInterface";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import type { ProjectData, ChatMessage, PipelineStage } from "@/lib/pipeline";

interface WorkspaceProps {
  project: ProjectData;
}

const INITIAL_MESSAGE = (project: ProjectData): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: `Excelente! Vamos construir algo extraordinário a partir da sua ideia: "${project.theme}"${project.genre ? ` no gênero ${project.genre}` : ""}.\n\nAntes de começarmos a estruturar o roteiro, preciso entender melhor a essência da sua história. Vou fazer algumas perguntas para aprofundar a narrativa.\n\nPrimeiro: quando você pensa nessa história, qual é a emoção principal que o espectador deveria sentir ao final do filme?`,
  timestamp: new Date(),
});

const Workspace = ({ project }: WorkspaceProps) => {
  const [currentStage, setCurrentStage] = useState<PipelineStage>("deepening");
  const [completedStages, setCompletedStages] = useState<PipelineStage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE(project)]);
  const [isLoading, setIsLoading] = useState(false);

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

      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader project={project} currentStage={displayStage} />
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Responda para aprofundar sua história..."
        />
      </div>
    </div>
  );
};

export default Workspace;
