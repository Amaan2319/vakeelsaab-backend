import { Send, Plus, Paperclip } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

// Add props interface
interface ChatInputProps {
  onSend: (query: string) => void;
  disabled?: boolean;
  showAttachment?: boolean;
  onAttachmentClick?: () => void;
}

export default function ChatInput({
  onSend,
  disabled,
  showAttachment = false,
  onAttachmentClick,
}: ChatInputProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!query.trim() || disabled) return;
    onSend(query); // Call the function passed from Chat.tsx
    setQuery("");  // Clear the input
  };

  const quickPrompts = [
    "Explain BNS Section 115",
    "What is the penalty for cyber fraud?",
    "Difference between IPC and BNS"
  ];

  // ... (Keep your existing themeColors object here)
  const themeColors = {
    bg: "#000000", card: "#19191c", border: "#2d2d31", primaryText: "#FFFFFF", secondaryText: "#a1a1aa", accent: "#5664F5",
  };

  return (
    <div className="sticky bottom-0 z-40 -mx-4 border-t border-white/10 bg-black/90 px-4 pb-4 pt-4 backdrop-blur-xl md:-mx-6 md:px-6 md:pb-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-500">
            Suggested Questions
          </p>
          <p className="text-xs text-gray-500">
            Tap a prompt to fill the input
          </p>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto px-1 pb-2 hide-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setQuery(prompt);
                // Optional: Auto-send when clicking a prompt
                // onSend(prompt); 
              }}
              disabled={disabled}
              className="whitespace-nowrap flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-medium text-gray-300 transition-all hover:border-indigo-500/50 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <Plus size={12} className="text-indigo-400" />
              {prompt}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative flex items-end gap-2 rounded-3xl border border-white/10 bg-[#19191c] p-2 shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/30"
        >
          {showAttachment && (
            <button
              className="flex-shrink-0 rounded-2xl p-3 text-indigo-400 transition-colors hover:bg-indigo-500/10 disabled:opacity-50"
              disabled={disabled}
              onClick={onAttachmentClick}
              type="button"
            >
              <Paperclip size={20} />
            </button>
          )}

          <textarea
            ref={textareaRef}
            rows={2}
            disabled={disabled}
            placeholder="Ask about Bharatiya Nyaya Sanhita or Indian law..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }} 
            className="min-h-[56px] max-h-40 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-50 md:text-base"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!query.trim() || disabled}
            className={`flex-shrink-0 rounded-2xl p-3.5 transition-all duration-200 ${
              query.trim() && !disabled
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400"
                : "cursor-not-allowed bg-[#2d2d31] text-gray-500"
            }`}
          >
            <Send size={18} />
          </button>
        </motion.div>

        <p className="mt-3.5 px-4 text-center text-[10.5px] text-gray-500">
          AI responses may contain errors. Verify legal advice with professionals.
        </p>
      </div>
    </div>
  );
}
