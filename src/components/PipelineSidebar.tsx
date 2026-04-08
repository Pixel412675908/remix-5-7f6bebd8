import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import { cn } from "@/lib/utils";
import {
  Lightbulb, LayoutList, Users, Film, PenTool, Search, MessageCircle, Timer, Award
} from "lucide-react";

const STAGE_ICONS: Record<string, React.ElementType> = {
  logline: Lightbulb,
  structure: LayoutList,
  characters: Users,
  scenes: Film,
  writing: PenTool,
  revision: Search,
  dialogues: MessageCircle,
  rhythm: Timer,
  final: Award,
};

interface PipelineSidebarProps {
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
}

const PipelineSidebarContent = ({ currentStage, completedStages }: PipelineSidebarProps) => {
  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <>
      <div className="p-5 border-b border-border">
        <h2 className="font-display text-lg text-foreground">Pipeline</h2>
        <p className="text-xs text-muted-foreground mt-1">Processo criativo</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {PIPELINE_STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          const isLocked = index > currentIndex && !isCompleted;
          const Icon = STAGE_ICONS[stage.id] || Lightbulb;

          return (
            <div key={stage.id} className="relative flex items-start gap-3">
              {/* Connecting line */}
              {index < PIPELINE_STAGES.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[11px] top-8 w-px h-8",
                    isCompleted ? "bg-primary/40" : "bg-border"
                  )}
                  style={{ width: "1px" }}
                />
              )}

              {/* Icon — bare, no container */}
              <div className="relative shrink-0 w-[22px] h-[22px] mt-0.5 flex items-center justify-center">
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors duration-150",
                    isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : isLocked ? "text-muted-foreground/30" : "text-muted-foreground/60"
                  )}
                  strokeWidth={1.5}
                />
              </div>

              <div className={cn("pb-6", isLocked && "opacity-40")}>
                <p className={cn(
                  "text-sm font-medium leading-tight",
                  isCurrent ? "text-primary" : "text-foreground"
                )}>
                  {stage.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stage.description}</p>
              </div>

              {isCompleted && (
                <div className="absolute right-0 top-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="text-primary">
                    <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

const PipelineSidebar = (props: PipelineSidebarProps) => {
  return (
    <aside className="hidden md:flex w-64 border-r border-border bg-surface-subtle flex-col overflow-y-auto">
      <PipelineSidebarContent {...props} />
    </aside>
  );
};

export { PipelineSidebarContent };
export default PipelineSidebar;
