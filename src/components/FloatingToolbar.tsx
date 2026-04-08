import { Moon, Sun, FolderOpen, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";

interface FloatingToolbarProps {
  onSettingsOpen: () => void;
  onArchiveOpen: () => void;
  onProgressClick: () => void;
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
}

const FloatingToolbar = ({ onSettingsOpen, onArchiveOpen, onProgressClick, currentStage, completedStages }: FloatingToolbarProps) => {
  const { theme, toggleTheme } = useTheme();

  const progressPercent = Math.round((completedStages.length / PIPELINE_STAGES.length) * 100);

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
      {/* Progress indicator - clickable */}
      <button
        onClick={onProgressClick}
        className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity duration-150"
        title="Ver pipeline"
      >
        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">{progressPercent}%</span>
      </button>

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
