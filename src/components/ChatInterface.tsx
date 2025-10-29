import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{ title: string; snippet: string }>;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Private RAG Knowledge Assistant. Ask me anything about your documents, and I'll provide answers with sources.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      confidence: 1.0,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your question "${input}", here's what I found in the knowledge base. This is a simulated response demonstrating the RAG system's capabilities.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        confidence: 0.87,
        sources: [
          {
            title: "Technical Documentation - Chapter 3",
            snippet: "Relevant information extracted from the document...",
          },
          {
            title: "FAQ Section - Authentication",
            snippet: "Common questions and answers about the topic...",
          },
          {
            title: "API Reference Guide",
            snippet: "Detailed API specifications and examples...",
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} file(s) selected for upload`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <Send className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Start a Conversation</h2>
              <p className="text-muted-foreground">
                Ask anything about your documents or upload new files to expand the knowledge base.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-panel rounded-2xl p-4 max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="typing-indicator flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
                <span className="text-sm text-muted-foreground">Analyzing documents...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 glass-panel border-t">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
            className="shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your documents..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 gradient-primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
