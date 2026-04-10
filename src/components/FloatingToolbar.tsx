import { FolderOpen, Settings, BarChart2 } from "lucide-react";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import ThemeToggle from "@/components/ThemeToggle";

interface FloatingToolbarProps {
  onSettingsOpen: () => void;
  onArchiveOpen: () => void;
  onProgressClick: () => void;
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
  progressOverride?: number;
}

const FloatingToolbar = ({ onSettingsOpen, onArchiveOpen, onProgressClick, currentStage, completedStages, progressOverride }: FloatingToolbarProps) => {
  const progressPercent = progressOverride ?? Math.round((completedStages.length / PIPELINE_STAGES.length) * 100);

  return (
    <div className="flex items-center gap-1 justify-end px-4 py-2 border-t border-border bg-background shrink-0">
      {/* Progress indicator */}
      <button
        onClick={onProgressClick}
        className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity duration-200"
        title="Ver pipeline"
      >
        <BarChart2 strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">{progressPercent}%</span>
      </button>

      <ThemeToggle position="inline" />

      <button
        onClick={onArchiveOpen}
        title="Arquivo"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200"
      >
        <FolderOpen strokeWidth={1.5} className="w-[18px] h-[18px]" />
      </button>

      <button
        onClick={onSettingsOpen}
        title="Config"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200"
      >
        <Settings strokeWidth={1.5} className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
