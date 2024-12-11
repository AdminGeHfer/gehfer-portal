import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onFileUpload: (file: File) => void;
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

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-background/50">
      <div className="flex-1 flex gap-2">
        <Input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(file);
          }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="min-h-[2.5rem] max-h-32 bg-background/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>
      <Button 
        type="submit" 
        size="icon"
        disabled={isLoading}
        className="shrink-0 bg-primary/90 hover:bg-primary"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </form>
  );
};