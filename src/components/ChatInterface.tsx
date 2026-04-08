import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/lib/pipeline";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInterface = ({ messages, onSendMessage, isLoading, placeholder }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close context menu on click outside
  useEffect(() => {
    const handler = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [contextMenu]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleTouchStart = (msg: ChatMessage, e: React.TouchEvent) => {
    if (msg.role !== "user") return;
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setContextMenu({ id: msg.id, x: touch.clientX, y: touch.clientY });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`relative group ${
                  msg.role === "user"
                    ? "chat-bubble-user max-w-[80%] px-4 py-3"
                    : "chat-bubble-ai max-w-[85%] px-4 py-3"
                }`}
                onTouchStart={(e) => handleTouchStart(msg, e)}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => {
                  if (msg.role === "user") {
                    e.preventDefault();
                    setContextMenu({ id: msg.id, x: e.clientX, y: e.clientY });
                  }
                }}
              >
                <div className="text-sm leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Copy button for AI messages */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors duration-150"
                  >
                    {copiedId === msg.id ? (
                      <><Check strokeWidth={1.5} className="w-3.5 h-3.5" /> Copiado</>
                    ) : (
                      <><Copy strokeWidth={1.5} className="w-3.5 h-3.5" /> Copiar</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Context menu for user messages */}
        {contextMenu && (
          <div
            className="fixed z-50 surface-card rounded-xl p-1 shadow-lg border border-border min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                const msg = messages.find((m) => m.id === contextMenu.id);
                if (msg) copyToClipboard(msg.content, msg.id);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg flex items-center gap-2 transition-colors duration-150"
            >
              <Copy strokeWidth={1.5} className="w-3.5 h-3.5" /> Copiar mensagem
            </button>
          </div>
        )}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-2">
        <div className="surface-card rounded-xl flex items-end gap-2 p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Digite sua mensagem..."}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none px-2 py-2 max-h-36"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            <Send strokeWidth={1.5} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
