import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTheme";
import { Trash2, FileText, Download, FolderOpen, MoreHorizontal, Pin, PenLine } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
  onLoadScript?: (script: any) => void;
}

const ArchiveModal = ({ open, onClose, onLoadScript }: ArchiveModalProps) => {
  const { user } = useAuth();
  const t = useTranslation();
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

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
    if (!error) setScripts(data || []);
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

  const handleExport = (script: any, fmt: "txt" | "pdf") => {
    const content = script.final_script || "Roteiro em andamento...";
    const dateStr = format(new Date(script.created_at), "dd-MM-yyyy");
    const timeStr = format(new Date(script.created_at), "HH-mm");
    const filename = `${script.title} — ${dateStr} — ${timeStr} — ${script.theme?.substring(0, 30)} — ${script.genre || "Geral"}`;

    if (fmt === "txt") {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (fmt === "pdf") {
      // Simple PDF using print
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`<html><head><title>${script.title}</title><style>body{font-family:'Courier New',monospace;padding:40px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${content}</body></html>`);
        win.document.close();
        win.print();
      }
    }
  };

  const statusLabels: Record<string, { label: string; cls: string }> = {
    in_progress: { label: t("inProgress"), cls: "text-orange-500 bg-orange-500/10" },
    completed: { label: t("completed"), cls: "text-green-500 bg-green-500/10" },
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FolderOpen strokeWidth={1.5} className="w-5 h-5 text-primary" />
            {t("myScripts")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">{t("loading")}</div>
        ) : scripts.length === 0 ? (
          <div className="py-12 text-center">
            <FileText strokeWidth={1.5} className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">{t("noScripts")}</p>
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {scripts.map((s) => {
              const st = statusLabels[s.status] || statusLabels.in_progress;
              return (
                <div key={s.id} className="surface-card rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {renaming === s.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRename(s.id)}
                            className="text-sm bg-muted/50 border border-border rounded-lg px-2 py-1 outline-none focus:border-primary/50"
                            autoFocus
                          />
                          <button onClick={() => handleRename(s.id)} className="text-xs text-primary">OK</button>
                        </div>
                      ) : (
                        <h4 className="text-sm font-medium text-foreground truncate">{s.title}</h4>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {s.genre && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/20 text-primary/80">
                            {s.genre}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(s.created_at), "dd/MM/yy")}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                        >
                          <MoreHorizontal strokeWidth={1.5} className="w-4 h-4" />
                        </button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 top-8 z-10 surface-card rounded-xl p-1 min-w-[120px] shadow-lg">
                            {onLoadScript && (
                              <button onClick={() => { onLoadScript(s); onClose(); }} className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-150">
                                {t("open")}
                              </button>
                            )}
                            <button onClick={() => { setRenaming(s.id); setRenameValue(s.title); }} className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-150">
                              <PenLine strokeWidth={1.5} className="w-3 h-3" /> {t("rename")}
                            </button>
                            <button onClick={() => handleExport(s, "txt")} className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-150">
                              <Download strokeWidth={1.5} className="w-3 h-3" /> TXT
                            </button>
                            <button onClick={() => handleExport(s, "pdf")} className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-150">
                              <Download strokeWidth={1.5} className="w-3 h-3" /> PDF
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2 transition-colors duration-150">
                              <Trash2 strokeWidth={1.5} className="w-3 h-3" /> {t("delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">{s.theme}</p>
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
