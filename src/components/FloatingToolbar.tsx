import { Moon, Sun, FolderOpen, Settings, BarChart3 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";

interface FloatingToolbarProps {
  onSettingsOpen: () => void;
  onArchiveOpen: () => void;
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
}

const FloatingToolbar = ({ onSettingsOpen, onArchiveOpen, currentStage, completedStages }: FloatingToolbarProps) => {
  const { theme, toggleTheme } = useTheme();

  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
  const progressPercent = Math.round(((completedStages.length) / PIPELINE_STAGES.length) * 100);

  const items = [
    {
      icon: theme === "dark"
        ? <Sun strokeWidth={1.5} className="w-[18px] h-[18px]" />
        : <Moon strokeWidth={1.5} className="w-[18px] h-[18px]" />,
      onClick: toggleTheme,
      label: "Tema",
    },
    {
      icon: <FolderOpen strokeWidth={1.5} className="w-[18px] h-[18px]" />,
      onClick: onArchiveOpen,
      label: "Arquivo",
    },
    {
      icon: <Settings strokeWidth={1.5} className="w-[18px] h-[18px]" />,
      onClick: onSettingsOpen,
      label: "Config",
    },
  ];

  return (
    <div className="flex items-center gap-1 justify-end px-4 py-2 border-t border-border bg-background">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mr-auto">
        <BarChart3 strokeWidth={1.5} className="w-4 h-4 text-primary" />
        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground">{progressPercent}%</span>
      </div>

      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          title={item.label}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-150"
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default FloatingToolbar;
