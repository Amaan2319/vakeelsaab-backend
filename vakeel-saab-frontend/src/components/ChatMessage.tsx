import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  role: "user" | "assistant"
  content: string
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-[85%] md:max-w-[75%]
          rounded-2xl
          px-4 py-3
          text-sm
          leading-relaxed
          ${
            isUser
              ? "bg-indigo-600 text-white"
              : "bg-white/5 border border-white/10 text-gray-200"
          }
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 mb-2 font-semibold tracking-wide">
            <Scale size={14} />
            Vakeel Sahab
          </div>
        )}

        {isUser ? (
          // User messages are usually plain text, so we keep it simple
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          // AI messages run through the Markdown parser with custom Tailwind styling
          <div className="markdown-body overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Style paragraphs
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                // Style bold text
                strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                // Style bullet lists
                ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                // Style numbered lists
                ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                // Style tables to look like beautiful dark-mode data grids
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 border border-white/10 rounded-lg">
                    <table className="min-w-full divide-y divide-white/10 text-sm text-left" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
                th: ({ node, ...props }) => <th className="px-4 py-2 font-medium text-gray-300 tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-2 text-gray-300 border-t border-white/5" {...props} />,
                // Style links if Gemini provides any
                a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}