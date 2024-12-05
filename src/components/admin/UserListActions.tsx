import { Button } from "@/components/ui/button";
import { Mail, UserCog, Trash2, Key } from "lucide-react";

interface UserListActionsProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onResetPassword: (user: any) => void;
  onSendPasswordReset: (email: string) => void;
}

export function UserListActions({ 
  user, 
  onEdit, 
  onDelete, 
  onResetPassword,
  onSendPasswordReset 
}: UserListActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => user.email && onSendPasswordReset(user.email)}
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onResetPassword(user)}
      >
        <Key className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(user)}
      >
        <UserCog className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDelete(user)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}