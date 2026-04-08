import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Bell, Globe, Shield } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Configurações</DialogTitle>
          <DialogDescription>Personalize sua experiência no CineScript</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Theme */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Modo Escuro</p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Ativado" : "Desativado"}
                </p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Notificações</p>
                <p className="text-xs text-muted-foreground">Sons e alertas do sistema</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Language */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Idioma</p>
                <p className="text-xs text-muted-foreground">Português (Brasil)</p>
              </div>
            </div>
          </div>

          {/* Auto-save */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Salvamento Automático</p>
                <p className="text-xs text-muted-foreground">Salvar progresso automaticamente</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
