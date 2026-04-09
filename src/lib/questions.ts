import type { Question } from "@/components/QuestionModal";

export const DEEPENING_QUESTIONS: Question[] = [
  {
    id: "protagonist_personality",
    text: "Como é o seu protagonista?",
    type: "single",
    options: [
      { id: "brave", label: "Corajoso e impulsivo" },
      { id: "smart", label: "Inteligente e calculista" },
      { id: "sensitive", label: "Sensível e introvertido" },
      { id: "complex", label: "Complexo e contraditório" },
    ],
  },
  {
    id: "emotional_tone",
    text: "Qual o tom emocional da história?",
    type: "single",
    options: [
      { id: "dark", label: "Tenso e sombrio" },
      { id: "light", label: "Leve e esperançoso" },
      { id: "epic", label: "Épico e grandioso" },
      { id: "intimate", label: "Íntimo e delicado" },
    ],
  },
  {
    id: "turning_point",
    text: "Qual o ponto de virada principal?",
    type: "single",
    options: [
      { id: "betrayal", label: "Uma traição inesperada" },
      { id: "discovery", label: "Uma descoberta que muda tudo" },
      { id: "loss", label: "Uma perda irreversível" },
      { id: "choice", label: "Uma escolha impossível" },
    ],
  },
  {
    id: "ending",
    text: "Como a história termina?",
    type: "single",
    options: [
      { id: "happy", label: "Final feliz" },
      { id: "tragic", label: "Final trágico" },
      { id: "open", label: "Final aberto" },
      { id: "ambiguous", label: "Final ambíguo" },
    ],
  },
  {
    id: "antagonist",
    text: "Quem ou o que é o antagonista?",
    type: "single",
    options: [
      { id: "person", label: "Uma pessoa próxima ao protagonista" },
      { id: "system", label: "Um sistema ou instituição" },
      { id: "self", label: "O próprio protagonista (conflito interno)" },
      { id: "fate", label: "O destino ou forças sobrenaturais" },
    ],
  },
  {
    id: "setting",
    text: "Onde a história se passa?",
    type: "single",
    options: [
      { id: "urban", label: "Cidade grande contemporânea" },
      { id: "rural", label: "Interior ou zona rural" },
      { id: "historical", label: "Período histórico específico" },
      { id: "fictional", label: "Mundo ficcional ou fantástico" },
    ],
  },
  {
    id: "protagonist_motivation",
    text: "O que motiva o protagonista?",
    type: "single",
    options: [
      { id: "revenge", label: "Vingança ou justiça" },
      { id: "love", label: "Amor ou proteção de alguém" },
      { id: "survival", label: "Sobrevivência" },
      { id: "truth", label: "Busca pela verdade ou identidade" },
    ],
  },
  {
    id: "internal_conflict",
    text: "Qual o conflito interno do protagonista?",
    type: "single",
    options: [
      { id: "guilt", label: "Culpa por algo do passado" },
      { id: "fear", label: "Medo de enfrentar a realidade" },
      { id: "duality", label: "Dualidade moral — bem vs. mal" },
      { id: "belonging", label: "Não pertencer a lugar nenhum" },
    ],
  },
  {
    id: "relationships",
    text: "Qual a relação mais importante da história?",
    type: "single",
    options: [
      { id: "romantic", label: "Relação amorosa intensa" },
      { id: "family", label: "Vínculo familiar (pai/mãe/irmão)" },
      { id: "friendship", label: "Amizade profunda e leal" },
      { id: "rivalry", label: "Rivalidade ou relação tóxica" },
    ],
  },
  {
    id: "narrative_rhythm",
    text: "Qual ritmo narrativo você prefere?",
    type: "single",
    options: [
      { id: "fast", label: "Rápido e cheio de ação" },
      { id: "slow", label: "Lento e contemplativo" },
      { id: "crescendo", label: "Crescente — começa calmo, explode no final" },
      { id: "alternating", label: "Alternado — momentos intensos e pausas" },
    ],
  },
  {
    id: "cinematic_references",
    text: "Qual universo cinematográfico mais inspira você?",
    type: "single",
    options: [
      { id: "nolan", label: "Christopher Nolan (complexidade e tempo)" },
      { id: "villeneuve", label: "Denis Villeneuve (atmosfera e silêncio)" },
      { id: "tarantino", label: "Tarantino (diálogos e violência estilizada)" },
      { id: "ghibli", label: "Studio Ghibli (poesia e fantasia)" },
    ],
  },
  {
    id: "audience",
    text: "Para qual público essa história é pensada?",
    type: "single",
    options: [
      { id: "general", label: "Público geral — acessível a todos" },
      { id: "adult", label: "Adulto — temas maduros e complexos" },
      { id: "young", label: "Jovem adulto — identificação geracional" },
      { id: "niche", label: "Nicho — festival, cinema autoral" },
    ],
  },
];
