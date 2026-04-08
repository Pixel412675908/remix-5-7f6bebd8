import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import type { ProjectData } from "@/lib/pipeline";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  project: ProjectData;
  currentStage: PipelineStage;
  onMenuToggle?: () => void;
  onSettingsOpen?: () => void;
}

const WorkspaceHeader = ({ project, currentStage, onMenuToggle, onSettingsOpen }: WorkspaceHeaderProps) => {
  const stageInfo = PIPELINE_STAGES.find((s) => s.id === currentStage);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/30">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden h-9 w-9">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <h1 className="font-display text-sm md:text-base text-foreground truncate max-w-[180px] md:max-w-[300px]">
          {project.theme}
        </h1>
        {project.genre && (
          <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-md border border-primary/30 text-primary/80">
            {project.genre}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {stageInfo && (
          <span className="hidden sm:inline">
            Etapa: <span className="text-primary">{stageInfo.label}</span>
          </span>
        )}
        <span className="hidden sm:inline">
          {project.minDuration}–{project.maxDuration} min
        </span>
        {onSettingsOpen && (
          <Button variant="ghost" size="icon" onClick={onSettingsOpen} className="h-9 w-9">
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default WorkspaceHeader;
