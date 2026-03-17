import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Send, Trash2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { useAuth } from "../../lib/auth";

export function AiCoachView() {
  const { userId } = useAuth();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messages = useQuery(api.ai.listMessages, userId ? { userId } : "skip");
  const sendMessage = useMutation(api.ai.sendMessage);
  const clearMessages = useMutation(api.ai.clearMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trigger } = useWebHaptics();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const message = input.trim();
    setInput("");
    setSending(true);
    trigger("nudge");

    try {
      await sendMessage({ message, userId: userId! });
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  // AI is thinking if last message is from user
  const isThinking =
    messages &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100dvh-5rem)]">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">The Wheel</h2>
          <p className="text-white/40 text-sm">Your accountability coach</p>
        </div>
        {messages && messages.length > 0 && (
          <button
            onClick={() => {
              trigger("error");
              clearMessages({ userId: userId! });
            }}
            className="text-[#333] hover:text-[#888] transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {(!messages || messages.length === 0) && (
          <div className="glass-card text-center mt-8">
            <p className="text-white/40 text-sm">
              The wheel is listening. What's on your mind?
            </p>
          </div>
        )}

        {messages
          ?.filter((m) => m.role !== "system")
          .map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "border border-[#333] text-[#FAD399]"
                    : "border border-[#222] text-[#888] p-4"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 bg-[#555] rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-[#555] rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-[#555] rounded-full inline-block" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to the wheel..."
            className="glass-input flex-1"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="glass-button px-4"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
