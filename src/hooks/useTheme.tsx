import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type FontSize = "small" | "medium" | "large";
type Language = "pt-BR" | "en";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("cinescript-theme");
    return stored === "dark" ? "dark" : "light";
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem("cinescript-fontsize") as FontSize) || "medium";
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("cinescript-lang") as Language) || "pt-BR";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("cinescript-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem("cinescript-fontsize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("cinescript-lang", language);
  }, [language]);

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme: () => setThemeState(prev => prev === "dark" ? "light" : "dark"),
      setTheme: setThemeState,
      fontSize,
      setFontSize: setFontSizeState,
      language,
      setLanguage: setLanguageState,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}

// i18n helper
const translations: Record<string, Record<string, string>> = {
  "pt-BR": {
    "settings": "Configurações",
    "darkMode": "Modo Escuro",
    "language": "Idioma",
    "fontSize": "Tamanho da Fonte",
    "small": "Pequeno",
    "medium": "Médio",
    "large": "Grande",
    "clearHistory": "Limpar Histórico",
    "clearHistoryConfirm": "Tem certeza? Isso removerá todas as mensagens da conversa atual.",
    "account": "Conta",
    "logout": "Sair",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "archive": "Arquivo",
    "export": "Exportar",
    "save": "Salvar",
    "delete": "Remover",
    "rename": "Renomear",
    "pin": "Fixar",
    "newScript": "Novo Roteiro",
    "myScripts": "Meus Roteiros",
    "progress": "Progresso",
    "theme": "Tema",
    "login": "Entrar",
    "signup": "Criar Conta",
    "username": "Nome de Usuário",
    "password": "Senha",
    "weak": "Fraca",
    "medium_str": "Média",
    "strong": "Forte",
    "back": "Voltar",
    "next": "Próxima",
    "submit": "Enviar Respostas",
    "createScript": "Criar Roteiro",
    "startCreating": "Começar Agora",
    "howItWorks": "Como Funciona",
    "enabled": "Ativado",
    "disabled": "Desativado",
    "noScripts": "Nenhum roteiro arquivado",
    "loading": "Carregando...",
    "inProgress": "Em andamento",
    "completed": "Finalizado",
    "open": "Abrir",
    "saveToDB": "Salvar no App",
    "exportPDF": "Exportar PDF",
    "exportTXT": "Exportar TXT",
  },
  "en": {
    "settings": "Settings",
    "darkMode": "Dark Mode",
    "language": "Language",
    "fontSize": "Font Size",
    "small": "Small",
    "medium": "Medium",
    "large": "Large",
    "clearHistory": "Clear History",
    "clearHistoryConfirm": "Are you sure? This will remove all messages from the current conversation.",
    "account": "Account",
    "logout": "Log out",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "archive": "Archive",
    "export": "Export",
    "save": "Save",
    "delete": "Delete",
    "rename": "Rename",
    "pin": "Pin",
    "newScript": "New Script",
    "myScripts": "My Scripts",
    "progress": "Progress",
    "theme": "Theme",
    "login": "Log in",
    "signup": "Sign up",
    "username": "Username",
    "password": "Password",
    "weak": "Weak",
    "medium_str": "Medium",
    "strong": "Strong",
    "back": "Back",
    "next": "Next",
    "submit": "Submit Answers",
    "createScript": "Create Script",
    "startCreating": "Start Now",
    "howItWorks": "How It Works",
    "enabled": "Enabled",
    "disabled": "Disabled",
    "noScripts": "No archived scripts",
    "loading": "Loading...",
    "inProgress": "In progress",
    "completed": "Completed",
    "open": "Open",
    "saveToDB": "Save to App",
    "exportPDF": "Export PDF",
    "exportTXT": "Export TXT",
  },
};

export function useTranslation() {
  const { language } = useTheme();
  return (key: string) => translations[language]?.[key] || translations["pt-BR"]?.[key] || key;
}
