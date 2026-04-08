import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PipelineSidebarProps {
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
}

const PipelineSidebarContent = ({ currentStage, completedStages }: PipelineSidebarProps) => {
  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <>
      <div className="p-5 md:p-6 border-b border-border">
        <h2 className="font-display text-lg text-foreground tracking-wide">Pipeline</h2>
        <p className="text-xs text-muted-foreground mt-1">Processo criativo</p>
      </div>

      <div className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
        {PIPELINE_STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          const isLocked = index > currentIndex && !isCompleted;

          return (
            <div key={stage.id} className="relative flex items-start gap-3">
              {index < PIPELINE_STAGES.length - 1 && (
                <div
                  className={cn(
                    "absolute left-5 top-10 w-px h-8",
                    isCompleted ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}

              <div
                className={cn(
                  "relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300",
                  isCurrent
                    ? "border-primary/50 bg-primary/10 glow-green"
                    : isCompleted
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30"
                )}
              >
                <img
                  src={stage.icon}
                  alt={stage.label}
                  className={cn(
                    "w-5 h-5 object-contain transition-opacity",
                    isLocked ? "opacity-30" : "opacity-80"
                  )}
                />
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-primary/30"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              <div className={cn("pt-1 pb-4", isLocked && "opacity-40")}>
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    isCurrent ? "text-primary" : "text-foreground"
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
              </div>

              {isCompleted && (
                <div className="absolute right-0 top-2 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary">
                    <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
    <aside className="hidden md:flex w-72 border-r border-border bg-card/50 flex-col overflow-y-auto">
      <PipelineSidebarContent {...props} />
    </aside>
  );
};

export { PipelineSidebarContent };
export default PipelineSidebar;
