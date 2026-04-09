import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme, useTranslation } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Globe, Type, Trash2, User, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/ReportModal";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onClearHistory?: () => void;
}

const SettingsModal = ({ open, onClose, onClearHistory }: SettingsModalProps) => {
  const { fontSize, setFontSize, language, setLanguage } = useTheme();
  const { user, signOut } = useAuth();
  const t = useTranslation();
  const [confirmClear, setConfirmClear] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const username = user?.user_metadata?.username || "user";

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{t("settings")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {/* Language */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Globe strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
                <p className="text-sm font-medium text-foreground">{t("language")}</p>
              </div>
              <div className="flex gap-1">
                {(["pt-BR", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      language === lang
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "pt-BR" ? "PT-BR" : "EN"}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Type strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
                <p className="text-sm font-medium text-foreground">{t("fontSize")}</p>
              </div>
              <div className="flex gap-1">
                {(["small", "medium", "large"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      fontSize === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear History */}
            {onClearHistory && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <Trash2 strokeWidth={1.5} className="w-[18px] h-[18px] text-destructive" />
                  <p className="text-sm font-medium text-foreground">{t("clearHistory")}</p>
                </div>
                {!confirmClear ? (
                  <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)} className="text-destructive text-xs">
                    {t("clearHistory")}
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)} className="text-xs">
                      {t("cancel")}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => { onClearHistory(); setConfirmClear(false); }} className="text-xs">
                      {t("confirm")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Report Problem */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <AlertTriangle strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
                <p className="text-sm font-medium text-foreground">Reportar Problema</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReportOpen(true)} className="text-xs text-primary">
                Reportar
              </Button>
            </div>

            {/* Account */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center gap-3">
                <User strokeWidth={1.5} className="w-[18px] h-[18px] text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("account")}</p>
                  <p className="text-[11px] text-muted-foreground">@{username}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start text-destructive hover:text-destructive gap-2"
              >
                <LogOut strokeWidth={1.5} className="w-4 h-4" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
};

export default SettingsModal;
