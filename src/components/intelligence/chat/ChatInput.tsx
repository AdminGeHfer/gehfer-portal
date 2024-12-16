import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSubmit, onFileUpload, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-2 p-4 bg-background/80 backdrop-blur-md border-t"
    >
      <div className="flex-1 flex gap-2 max-w-[900px] mx-auto w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className="shrink-0"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Paperclip className="h-5 w-5" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Anexar arquivo
          </TooltipContent>
        </Tooltip>
        
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className={cn(
            "min-h-[2.5rem] max-h-32 resize-none bg-card/50 border-0 focus-visible:ring-1",
            "rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm"
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !input.trim()}
              className={cn(
                "shrink-0 bg-primary hover:bg-primary/90 transition-colors shadow-sm",
                isLoading && "animate-pulse"
              )}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Enviar mensagem
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
};