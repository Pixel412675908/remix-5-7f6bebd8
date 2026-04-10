import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, MoreHorizontal, PenLine, Pin, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SavedScript {
  id: string;
  title: string;
  theme: string;
  genre: string | null;
  created_at: string;
  current_stage: string;
  status: string;
  min_duration: number;
  max_duration: number;
  notes: string | null;
  pipeline_outputs: any;
  question_answers: any;
  pinned?: boolean;
}

interface ScriptLibrarySidebarProps {
  open: boolean;
  onClose: () => void;
  onNewScript: () => void;
  onLoadScript?: (script: SavedScript) => void;
  activeScripts?: SavedScript[];
}

const ScriptLibrarySidebar = ({ open, onClose, onNewScript, onLoadScript, activeScripts }: ScriptLibrarySidebarProps) => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("cinescript-pinned");
      return new Set(stored ? JSON.parse(stored) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    if (open && user) fetchScripts();
  }, [open, user]);

  useEffect(() => {
    if (activeScripts && activeScripts.length > 0) {
      setScripts(prev => {
        const dbIds = new Set(prev.map(s => s.id));
        const merged = [...prev];
        for (const as of activeScripts) {
          if (!dbIds.has(as.id)) {
            merged.unshift(as);
          } else {
            const idx = merged.findIndex(s => s.id === as.id);
            if (idx >= 0) merged[idx] = { ...merged[idx], ...as };
          }
        }
        return merged;
      });
    }
  }, [activeScripts]);

  const fetchScripts = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setScripts(data as SavedScript[] || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("scripts").delete().eq("id", id);
    setScripts((prev) => prev.filter((s) => s.id !== id));
    toast.success("Roteiro removido");
    setMenuOpen(null);
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    await supabase.from("scripts").update({ title: renameValue.trim() }).eq("id", id);
    setScripts((prev) => prev.map((s) => s.id === id ? { ...s, title: renameValue.trim() } : s));
    setRenaming(null);
    setMenuOpen(null);
  };

  const handlePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("cinescript-pinned", JSON.stringify([...next]));
      return next;
    });
    setMenuOpen(null);
  };

  const progressForStage = (stage: string) => {
    const stages = ["logline", "structure", "characters", "scenes", "writing", "revision", "dialogues", "rhythm", "final"];
    const idx = stages.indexOf(stage);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / stages.length) * 100);
  };

  const sortedScripts = [...scripts].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id) ? 1 : 0;
    const bPinned = pinnedIds.has(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetTitle className="sr-only">Roteiros</SheetTitle>

        <div className="p-4 border-b border-border">
          <h2 className="font-display text-lg text-foreground">Meus Roteiros</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          ) : sortedScripts.length === 0 ? (
            <div className="text-center py-12">
              <FileText strokeWidth={1.5} className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum roteiro ainda</p>
            </div>
          ) : (
            sortedScripts.map((s) => (
              <div key={s.id} className="relative group">
                <button
                  onClick={() => { onLoadScript?.(s); onClose(); }}
                  className="w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  {renaming === s.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRename(s.id)}
                        className="text-sm bg-muted/50 border border-border rounded-lg px-2 py-1 outline-none focus:border-primary/50 flex-1"
                        autoFocus
                      />
                      <button onClick={() => handleRename(s.id)} className="text-xs text-primary font-medium">OK</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        {pinnedIds.has(s.id) && <Pin strokeWidth={1.5} className="w-3 h-3 text-primary shrink-0" />}
                        <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(s.created_at), "dd/MM/yy HH:mm")}
                        </span>
                        {s.genre && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-primary/20 text-primary/80">
                            {s.genre}
                          </span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          s.status === "completed" ? "text-green-500 bg-green-500/10" : "text-orange-500 bg-orange-500/10"
                        }`}>
                          {s.status === "completed" ? "Finalizado" : "Em andamento"}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {progressForStage(s.current_stage)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{s.theme}</p>
                    </>
                  )}
                </button>

                <div className="absolute right-2 top-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === s.id ? null : s.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreHorizontal strokeWidth={1.5} className="w-4 h-4" />
                  </button>
                  {menuOpen === s.id && (
                    <div className="absolute right-0 top-8 z-10 surface-card rounded-xl p-1 min-w-[130px] shadow-lg border border-border">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePin(s.id); }}
                        className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <Pin strokeWidth={1.5} className="w-3 h-3" /> {pinnedIds.has(s.id) ? "Desafixar" : "Fixar"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenaming(s.id); setRenameValue(s.title); setMenuOpen(null); }}
                        className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <PenLine strokeWidth={1.5} className="w-3 h-3" /> Renomear
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                        className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <Trash2 strokeWidth={1.5} className="w-3 h-3" /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating + button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => { onNewScript(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 transition-all duration-200"
          >
            <Plus strokeWidth={1.5} className="w-5 h-5" />
            Novo Roteiro
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScriptLibrarySidebar;
