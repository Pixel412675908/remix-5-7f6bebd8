import iconLogline from "@/assets/icons/icon-logline.png";
import iconStructure from "@/assets/icons/icon-structure.png";
import iconCharacters from "@/assets/icons/icon-characters.png";
import iconScenes from "@/assets/icons/icon-scenes.png";
import iconWriting from "@/assets/icons/icon-writing.png";
import iconRevision from "@/assets/icons/icon-revision.png";
import iconDialogues from "@/assets/icons/icon-dialogues.png";
import iconRhythm from "@/assets/icons/icon-rhythm.png";
import iconFinal from "@/assets/icons/icon-final.png";

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
  icon: string;
}

export const PIPELINE_STAGES: StageInfo[] = [
  { id: "logline", label: "Logline", description: "Ideia central e premissa", icon: iconLogline },
  { id: "structure", label: "Estrutura", description: "Arquitetura em 3 atos", icon: iconStructure },
  { id: "characters", label: "Personagens", description: "Construção profunda", icon: iconCharacters },
  { id: "scenes", label: "Cenas", description: "Planejamento visual", icon: iconScenes },
  { id: "writing", label: "Escrita", description: "Primeira versão", icon: iconWriting },
  { id: "revision", label: "Revisão", description: "Análise estrutural", icon: iconRevision },
  { id: "dialogues", label: "Diálogos", description: "Refinamento de falas", icon: iconDialogues },
  { id: "rhythm", label: "Ritmo", description: "Ajuste de duração", icon: iconRhythm },
  { id: "final", label: "Final", description: "Versão profissional", icon: iconFinal },
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
