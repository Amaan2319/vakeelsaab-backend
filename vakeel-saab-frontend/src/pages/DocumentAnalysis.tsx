import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import { useAuth } from "../context/AuthContext";
import { ApiError, generateLegalResponse } from "../services/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function DocumentAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const summaryFromState = location.state?.summary as string | undefined;
    const fileUrlFromState = location.state?.fileUrl as string | undefined;
    const fileNameFromState = location.state?.fileName as string | undefined;
    const summaryFromStorage = sessionStorage.getItem("latestDocumentSummary") || undefined;
    const fileUrlFromStorage = sessionStorage.getItem("latestDocumentUrl") || undefined;

    const summary = summaryFromState || summaryFromStorage;
    const fileUrl = fileUrlFromState || fileUrlFromStorage;

    if (!summary) {
      navigate("/upload", { replace: true });
      return;
    }

    const intro = fileNameFromState
      ? `Summary for ${fileNameFromState}`
      : "Document summary";
    const body = fileUrl ? `${intro}\n\n${summary}\n\nFile: ${fileUrl}` : `${intro}\n\n${summary}`;

    setMessages([
      {
        id: "1",
        role: "assistant",
        content: body,
      },
    ]);
  }, [location.state, navigate]);

  const handleSendMessage = async (query: string) => {
    if (!token) {
      navigate("/login");
      return;
    }

    // 1. Add user message to UI immediately
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const aiResponseText = await generateLegalResponse(query, token);
      const newAiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: aiResponseText };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "I could not reach the backend right now.";

      if (error instanceof ApiError && error.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: message,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachmentClick = () => {
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white px-4 md:px-6">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col">
        <div className="border-b border-white/10 px-1 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300/80">
            Document Analysis
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            Review your uploaded legal document
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Ask follow-up questions about the uploaded notice, or upload another document using the attachment button below.
          </p>
        </div>

        <div className="flex-1 space-y-6 py-8">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
              <span>Analyzing document...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          showAttachment
          onAttachmentClick={handleAttachmentClick}
        />
      </div>
    </div>
  );
}
