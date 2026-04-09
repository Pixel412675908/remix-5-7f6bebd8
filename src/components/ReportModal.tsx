import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

const ReportModal = ({ open, onClose }: ReportModalProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;
    setLoading(true);
    try {
      const username = user.user_metadata?.username || "user";
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        username,
        message: message.trim(),
      });
      if (error) throw error;
      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      toast.error("Erro ao enviar relato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setSuccess(false); setMessage(""); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Reportar Problema</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle strokeWidth={1.5} className="w-10 h-10 text-green-500" />
            <p className="text-sm text-foreground text-center">Obrigado! Seu relato foi enviado.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o problema encontrado..."
              rows={5}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-all duration-200"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="brand" size="sm" onClick={handleSubmit} disabled={!message.trim() || loading}>
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
