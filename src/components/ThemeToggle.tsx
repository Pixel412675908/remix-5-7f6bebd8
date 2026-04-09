import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  position?: "fixed-bottom-right" | "inline";
}

const ThemeToggle = ({ position = "inline" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = "w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200";

  if (position === "fixed-bottom-right") {
    return (
      <button
        onClick={toggleTheme}
        className={`fixed bottom-5 right-5 z-40 ${baseClasses}`}
        title="Alternar tema"
      >
        {theme === "dark" ? <Sun strokeWidth={1.5} className="w-[18px] h-[18px]" /> : <Moon strokeWidth={1.5} className="w-[18px] h-[18px]" />}
      </button>
    );
  }

  return (
    <button onClick={toggleTheme} title="Tema" className={baseClasses}>
      {theme === "dark" ? <Sun strokeWidth={1.5} className="w-[18px] h-[18px]" /> : <Moon strokeWidth={1.5} className="w-[18px] h-[18px]" />}
    </button>
  );
};

export default ThemeToggle;
