import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
  onLoadScript?: (script: any) => void;
}

const ArchiveModal = ({ open, onClose, onLoadScript }: ArchiveModalProps) => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) fetchScripts();
  }, [open, user]);

  const fetchScripts = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar roteiros");
    } else {
      setScripts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scripts").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao deletar");
    } else {
      setScripts((prev) => prev.filter((s) => s.id !== id));
      toast.success("Roteiro removido");
    }
  };

  const handleExport = (script: any, format: "txt" | "pdf") => {
    const content = script.final_script || "Roteiro em andamento...";
    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${script.title || "roteiro"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const statusLabels: Record<string, { label: string; cls: string }> = {
    in_progress: { label: "Em andamento", cls: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
    completed: { label: "Finalizado", cls: "text-green-500 bg-green-500/10 border-green-500/20" },
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Meus Roteiros
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">Carregando...</div>
        ) : scripts.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum roteiro arquivado</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {scripts.map((s) => {
              const st = statusLabels[s.status] || statusLabels.in_progress;
              return (
                <div
                  key={s.id}
                  className="surface-elevated rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{s.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {s.genre && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md border border-primary/30 text-primary/80">
                            {s.genre}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {format(new Date(s.created_at), "dd/MM/yyyy")}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{s.theme}</p>

                  <div className="flex items-center gap-2 pt-1">
                    {onLoadScript && (
                      <button
                        onClick={() => { onLoadScript(s); onClose(); }}
                        className="text-xs text-primary hover:underline"
                      >
                        Abrir
                      </button>
                    )}
                    <button
                      onClick={() => handleExport(s, "txt")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> TXT
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-xs text-destructive hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveModal;