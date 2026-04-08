/**
 * AI Pipeline Orchestrator
 * 
 * Defines the multi-AI architecture where each AI has a specific role:
 * - Gemini: Creative direction, questions, logline, structure
 * - ChatGPT: Structural validation, coherence checking
 * - Claude: Writing, scene development, narrative fluidity
 * - DeepSeek: Revision, inconsistency correction
 * - OpenRouter (Dialogue AI): Dialogue refinement, subtext
 * - Grok: Fallback for any failing AI
 * - Lovable AI: Support, input validation, display
 */

export type AIProvider = "gemini" | "chatgpt" | "claude" | "deepseek" | "openrouter" | "grok" | "lovable";

export interface PipelineStep {
  id: string;
  label: string;
  provider: AIProvider;
  fallback: AIProvider;
  description: string;
}

export const AI_PIPELINE: PipelineStep[] = [
  {
    id: "deepening",
    label: "Aprofundamento",
    provider: "lovable",
    fallback: "grok",
    description: "Organizar respostas do usuário e validar inputs",
  },
  {
    id: "logline",
    label: "Logline + Estrutura",
    provider: "gemini",
    fallback: "grok",
    description: "Gerar ideia central e estrutura narrativa em 3 atos",
  },
  {
    id: "validation_1",
    label: "Validação Estrutural",
    provider: "chatgpt",
    fallback: "grok",
    description: "Validar coerência narrativa e melhorar estrutura lógica",
  },
  {
    id: "writing",
    label: "Escrita do Roteiro",
    provider: "claude",
    fallback: "grok",
    description: "Escrever roteiro completo com profundidade cinematográfica",
  },
  {
    id: "revision",
    label: "Revisão Estrutural",
    provider: "deepseek",
    fallback: "grok",
    description: "Revisar inconsistências e melhorar coerência",
  },
  {
    id: "dialogues",
    label: "Refinamento de Diálogos",
    provider: "openrouter",
    fallback: "grok",
    description: "Aplicar subtexto e naturalidade nos diálogos",
  },
  {
    id: "validation_final",
    label: "Validação Final",
    provider: "chatgpt",
    fallback: "grok",
    description: "Validação final de qualidade profissional",
  },
];

export interface ProjectContext {
  theme: string;
  genre: string;
  notes: string;
  minDuration: number;
  maxDuration: number;
  userAnswers: Record<string, string | string[]>;
  conversationHistory: Array<{ role: string; content: string }>;
  pipelineOutputs: Record<string, string>;
}
