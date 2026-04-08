import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/pipeline";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Lightbulb, LayoutList, Users, Film, PenTool, Search, MessageCircle, Timer, Award, CheckCircle2
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

interface PipelineModalProps {
  open: boolean;
  onClose: () => void;
  currentStage: PipelineStage;
  completedStages: PipelineStage[];
}

const PipelineModal = ({ open, onClose, currentStage, completedStages }: PipelineModalProps) => {
  const progressPercent = Math.round((completedStages.length / PIPELINE_STAGES.length) * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Pipeline do Roteiro</DialogTitle>
          <p className="text-sm text-muted-foreground">{progressPercent}% concluído</p>
        </DialogHeader>

        <div className="mt-2 w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="mt-4 space-y-0">
          {PIPELINE_STAGES.map((stage, index) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = stage.id === currentStage;
            const Icon = STAGE_ICONS[stage.id] || Lightbulb;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="relative flex items-start gap-3"
              >
                {/* Connecting line */}
                {index < PIPELINE_STAGES.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[11px] top-8 w-px h-8",
                      isCompleted ? "bg-primary/40" : "bg-[#e5e7eb]"
                    )}
                  />
                )}

                <div className="relative shrink-0 w-[22px] h-[22px] mt-0.5 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
                  ) : (
                    <Icon
                      strokeWidth={1.5}
                      className={cn(
                        "w-[18px] h-[18px] transition-colors duration-150",
                        isCurrent ? "text-primary" : "text-[#9ca3af]"
                      )}
                    />
                  )}
                </div>

                <div className={cn("pb-6", !isCompleted && !isCurrent && "opacity-50")}>
                  <p className={cn(
                    "text-sm font-medium leading-tight",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stage.description}</p>
                  {isCurrent && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      Em andamento
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineModal;
