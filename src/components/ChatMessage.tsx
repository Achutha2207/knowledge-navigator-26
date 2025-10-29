import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Source {
  title: string;
  snippet: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Source[];
}

const ChatMessage = ({ role, content, timestamp, confidence, sources }: ChatMessageProps) => {
  const [showSources, setShowSources] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const getConfidenceBadge = () => {
    if (!confidence) return null;
    
    let variant: "default" | "secondary" | "destructive" = "default";
    let text = "";
    
    if (confidence > 0.8) {
      variant = "default";
      text = "High Confidence";
    } else if (confidence > 0.6) {
      variant = "secondary";
      text = "Medium Confidence";
    } else {
      variant = "destructive";
      text = "Low Confidence";
    }
    
    return (
      <Badge variant={variant} className="text-xs">
        {text} ({(confidence * 100).toFixed(0)}%)
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-sm",
          role === "user"
            ? "bg-primary text-primary-foreground ml-auto"
            : "glass-panel"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs opacity-70">{timestamp}</p>
          {role === "assistant" && getConfidenceBadge()}
        </div>
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {role === "assistant" && sources && sources.length > 0 && (
          <div className="mt-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSources(!showSources)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Sources ({sources.length})
              </span>
              {showSources ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showSources && (
              <div className="space-y-2 pt-2">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <p className="font-medium text-sm mb-1">{source.title}</p>
                    <p className="text-xs text-muted-foreground">{source.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {role === "assistant" && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
            <span className="text-xs text-muted-foreground">Helpful?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={cn(
                "h-7 w-7 p-0",
                feedback === "up" && "bg-success/20 text-success"
              )}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={cn(
                "h-7 w-7 p-0",
                feedback === "down" && "bg-destructive/20 text-destructive"
              )}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
