import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import type { ProjectData } from "@/lib/pipeline";
import { Menu, ArrowLeft } from "lucide-react";

interface WorkspaceHeaderProps {
  project: ProjectData;
  currentStage: PipelineStage;
  onMenuToggle?: () => void;
  onBack?: () => void;
}

const WorkspaceHeader = ({ project, currentStage, onMenuToggle, onBack }: WorkspaceHeaderProps) => {
  const stageInfo = PIPELINE_STAGES.find((s) => s.id === currentStage);

  return (
    <header className="h-13 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150">
            <ArrowLeft strokeWidth={1.5} className="w-[18px] h-[18px]" />
          </button>
        )}
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150">
            <Menu strokeWidth={1.5} className="w-[18px] h-[18px]" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-sm font-medium text-foreground truncate max-w-[180px] md:max-w-[300px]">
            {project.theme?.substring(0, 40)}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {project.genre && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/20 text-primary/80">
                {project.genre}
              </span>
            )}
            {stageInfo && (
              <span className="text-[10px] text-muted-foreground">
                {stageInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <span className="text-[11px] text-muted-foreground hidden sm:inline">
        {project.minDuration}–{project.maxDuration} min
      </span>
    </header>
  );
};

export default WorkspaceHeader;
