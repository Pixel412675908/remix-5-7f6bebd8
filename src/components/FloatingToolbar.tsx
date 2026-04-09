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

  return (
    <div className="flex items-center gap-1 justify-end px-4 py-2 border-t border-border bg-background shrink-0">
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

      <button
        onClick={toggleTheme}
        title="Tema"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-150"
      >
        {theme === "dark"
          ? <Sun strokeWidth={1.5} className="w-[18px] h-[18px]" />
          : <Moon strokeWidth={1.5} className="w-[18px] h-[18px]" />}
      </button>

      <button
        onClick={onArchiveOpen}
        title="Arquivo"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-150"
      >
        <FolderOpen strokeWidth={1.5} className="w-[18px] h-[18px]" />
      </button>

      <button
        onClick={onSettingsOpen}
        title="Config"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-150"
      >
        <Settings strokeWidth={1.5} className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
