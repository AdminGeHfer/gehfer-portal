import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCCommentSection } from "./RNCCommentSection";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RNCCommentsProps {
  rncId: string;
  onCommentAdded: () => void;
}

interface RNCEvent {
  id: string;
  rnc_id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
  created_by: string;
  comment?: string;
  created_by_profile: {
    name: string;
    modules: string[];
  };
}

export function RNCComments({ rncId, onCommentAdded }: RNCCommentsProps) {
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: comments, isLoading, refetch } = useQuery({
    queryKey: ["rnc-comments", rncId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rnc_events")
        .select(`
          *,
          created_by_profile:profiles(name, modules)
        `)
        .eq("rnc_id", rncId)
        .eq("type", "comment")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RNCEvent[];
    },
  });

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("rnc_events")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comentário excluído com sucesso");
      refetch();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Erro ao excluir comentário");
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const canDeleteComment = (createdBy: string, userModules: string[] | null) => {
    return currentUser?.id === createdBy || userModules?.includes("admin");
  };

  if (isLoading) {
    return <div>Carregando comentários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Comentários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RNCCommentSection rncId={rncId} onCommentAdded={onCommentAdded} />
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(comment.created_by_profile?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {comment.created_by_profile?.name}
                        </p>
                        {canDeleteComment(comment.created_by, comment.created_by_profile?.modules) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}