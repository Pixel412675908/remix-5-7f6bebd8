import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import type { ProjectData } from "@/lib/pipeline";

interface WorkspaceHeaderProps {
  project: ProjectData;
  currentStage: PipelineStage;
}

const WorkspaceHeader = ({ project, currentStage }: WorkspaceHeaderProps) => {
  const stageInfo = PIPELINE_STAGES.find((s) => s.id === currentStage);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/30">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-base text-foreground truncate max-w-[300px]">
          {project.theme}
        </h1>
        {project.genre && (
          <span className="text-xs px-2 py-0.5 rounded-md border border-primary/30 text-primary/80">
            {project.genre}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {stageInfo && (
          <span>
            Etapa: <span className="text-primary">{stageInfo.label}</span>
          </span>
        )}
        <span>
          {project.minDuration}–{project.maxDuration} min
        </span>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
