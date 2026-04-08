import { Moon, Sun, Settings, FolderOpen, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";

interface FloatingToolbarProps {
  onSettingsOpen: () => void;
  onArchiveOpen: () => void;
  onSignOut: () => void;
}

const FloatingToolbar = ({ onSettingsOpen, onArchiveOpen, onSignOut }: FloatingToolbarProps) => {
  const { theme, toggleTheme } = useTheme();

  const items = [
    {
      icon: theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      onClick: toggleTheme,
      label: "Tema",
    },
    {
      icon: <FolderOpen className="w-4 h-4" />,
      onClick: onArchiveOpen,
      label: "Arquivo",
    },
    {
      icon: <Settings className="w-4 h-4" />,
      onClick: onSettingsOpen,
      label: "Config",
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      onClick: onSignOut,
      label: "Sair",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-4 z-50 flex flex-col gap-2"
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          title={item.label}
          className="w-11 h-11 rounded-xl surface-elevated flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 shadow-lg"
        >
          {item.icon}
        </button>
      ))}
    </motion.div>
  );
};

export default FloatingToolbar;