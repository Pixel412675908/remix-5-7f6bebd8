export type PipelineStage =
  | "input"
  | "deepening"
  | "logline"
  | "structure"
  | "characters"
  | "scenes"
  | "writing"
  | "revision"
  | "dialogues"
  | "rhythm"
  | "final";

export interface StageInfo {
  id: PipelineStage;
  label: string;
  description: string;
}

export const PIPELINE_STAGES: StageInfo[] = [
  { id: "logline", label: "Logline", description: "Ideia central e premissa" },
  { id: "structure", label: "Estrutura", description: "Arquitetura em 3 atos" },
  { id: "characters", label: "Personagens", description: "Construção profunda" },
  { id: "scenes", label: "Cenas", description: "Planejamento visual" },
  { id: "writing", label: "Escrita", description: "Primeira versão" },
  { id: "revision", label: "Revisão", description: "Análise estrutural" },
  { id: "dialogues", label: "Diálogos", description: "Refinamento de falas" },
  { id: "rhythm", label: "Ritmo", description: "Ajuste de duração" },
  { id: "final", label: "Final", description: "Versão profissional" },
];

export interface ProjectData {
  theme: string;
  genre: string;
  notes: string;
  minDuration: number;
  maxDuration: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
