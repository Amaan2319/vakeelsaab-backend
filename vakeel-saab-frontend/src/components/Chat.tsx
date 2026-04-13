import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useAuth } from "../context/AuthContext";
import { ApiError, fetchQueryHistory, generateLegalResponse } from "../services/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      setIsBootstrapping(true);

      try {
        const history = await fetchQueryHistory(token);
        if (history.length === 0) {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content:
                "Namaste! I am Vakeel Sahab. Ask me about the Bharatiya Nyaya Sanhita (BNS), Indian legal procedures, or upload a document for review.",
            },
          ]);
          return;
        }

        const mappedMessages = history.flatMap((entry) => [
          {
            id: `user-${entry.id}`,
            role: "user" as const,
            content: entry.question,
          },
          {
            id: `assistant-${entry.id}`,
            role: "assistant" as const,
            content: entry.answer,
          },
        ]);

        setMessages(mappedMessages);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        setMessages([
          {
            id: "welcome-fallback",
            role: "assistant",
            content:
              "Namaste! I am Vakeel Sahab. I could not load your earlier consultations, but you can continue asking questions here.",
          },
        ]);
      } finally {
        setIsBootstrapping(false);
      }
    };

    loadHistory();
  }, [navigate, logout, token]);

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
            Legal Chat
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            Ask Vakeel Sahab anything about Indian law
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Your previous legal questions stay visible here so you can continue the conversation without losing context.
          </p>
        </div>

        <div className="flex-1 space-y-6 py-8">
          {isBootstrapping && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-gray-400">
                Loading your recent legal queries...
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-[#19191c] border border-[#2d2d31] rounded-2xl px-5 py-4 text-sm text-gray-400 animate-pulse">
                Vakeel Sahab is reviewing the laws...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading || isBootstrapping}
          showAttachment
          onAttachmentClick={handleAttachmentClick}
        />
      </div>
    </div>
  );
}
