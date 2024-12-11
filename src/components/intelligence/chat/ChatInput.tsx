import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSubmit, onFileUpload, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const { conversationId } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!conversationId) {
      toast.error("Por favor, crie uma nova conversa antes de enviar arquivos");
      return;
    }
    
    onFileUpload(file);
    e.target.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-background/50">
      <div className="flex-1 flex gap-2">
        <div className="relative flex items-center">
          <Input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className={cn(
              "cursor-pointer p-2 rounded-md hover:bg-accent",
              !conversationId && "opacity-50 cursor-not-allowed"
            )}
          >
            <Paperclip className="h-5 w-5" />
          </label>
        </div>
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