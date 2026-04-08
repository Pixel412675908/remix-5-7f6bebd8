import type { Question } from "@/components/QuestionModal";

export const DEEPENING_QUESTIONS: Question[] = [
  {
    id: "emotion",
    text: "Qual é a emoção principal que o espectador deveria sentir ao final do filme?",
    type: "single",
    options: [
      { id: "hope", label: "Esperança" },
      { id: "sadness", label: "Melancolia / Tristeza" },
      { id: "fear", label: "Medo / Tensão" },
      { id: "joy", label: "Alegria / Satisfação" },
      { id: "reflection", label: "Reflexão profunda" },
      { id: "surprise", label: "Surpresa / Choque" },
    ],
  },
  {
    id: "protagonist_type",
    text: "Que tipo de protagonista você imagina para essa história?",
    type: "single",
    options: [
      { id: "hero", label: "Herói clássico — corajoso e determinado" },
      { id: "antihero", label: "Anti-herói — moralmente ambíguo" },
      { id: "ordinary", label: "Pessoa comum em situação extraordinária" },
      { id: "broken", label: "Personagem quebrado buscando redenção" },
      { id: "villain_pov", label: "Vilão como protagonista" },
    ],
  },
  {
    id: "conflict_type",
    text: "Quais tipos de conflito são centrais nessa história?",
    type: "multiple",
    options: [
      { id: "internal", label: "Conflito interno — luta consigo mesmo" },
      { id: "interpersonal", label: "Conflito interpessoal — contra outra pessoa" },
      { id: "social", label: "Conflito social — contra a sociedade" },
      { id: "nature", label: "Conflito com a natureza ou destino" },
      { id: "supernatural", label: "Conflito sobrenatural" },
    ],
  },
  {
    id: "setting",
    text: "Em que tipo de ambiente a história se passa?",
    type: "single",
    options: [
      { id: "urban", label: "Urbano contemporâneo" },
      { id: "rural", label: "Rural / Interior" },
      { id: "historical", label: "Período histórico" },
      { id: "futuristic", label: "Futuro / Sci-fi" },
      { id: "fantasy", label: "Mundo fantástico" },
      { id: "isolated", label: "Lugar isolado / Confinamento" },
    ],
  },
  {
    id: "tone",
    text: "Qual o tom narrativo predominante?",
    type: "multiple",
    options: [
      { id: "dark", label: "Sombrio e pesado" },
      { id: "light", label: "Leve e esperançoso" },
      { id: "suspenseful", label: "Tenso e suspenseful" },
      { id: "poetic", label: "Poético e contemplativo" },
      { id: "raw", label: "Cru e realista" },
      { id: "humorous", label: "Com toques de humor" },
    ],
  },
  {
    id: "themes",
    text: "Quais temas você gostaria de explorar?",
    type: "multiple",
    options: [
      { id: "love", label: "Amor e relacionamentos" },
      { id: "loss", label: "Perda e luto" },
      { id: "identity", label: "Identidade e autoconhecimento" },
      { id: "power", label: "Poder e corrupção" },
      { id: "freedom", label: "Liberdade e opressão" },
      { id: "family", label: "Família e legado" },
    ],
  },
  {
    id: "ending",
    text: "Como você imagina o desfecho?",
    type: "single",
    options: [
      { id: "happy", label: "Final feliz / Resolvido" },
      { id: "tragic", label: "Final trágico" },
      { id: "ambiguous", label: "Final aberto / Ambíguo" },
      { id: "twist", label: "Com reviravolta surpreendente" },
      { id: "bittersweet", label: "Agridoce" },
    ],
  },
  {
    id: "additional",
    text: "Há algo mais que você gostaria de acrescentar sobre a sua visão para esse filme?",
    type: "text",
  },
];
