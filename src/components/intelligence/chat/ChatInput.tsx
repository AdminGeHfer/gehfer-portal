import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSubmit, onFileUpload, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");

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
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-background/80 backdrop-blur-md border-t">
      <div className="flex-1 flex gap-2 max-w-[900px] mx-auto w-full">
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
        
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="min-h-[2.5rem] max-h-32 resize-none bg-card/50 border-0 focus-visible:ring-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading}
          className={cn(
            "shrink-0 bg-primary hover:bg-primary/90 transition-colors",
            isLoading && "animate-pulse"
          )}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};