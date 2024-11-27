import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  onClick: () => void;
}

export function NotificationItem({ title, message, time, isRead, onClick }: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
        !isRead && "bg-muted/30"
      )}
    >
      <Bell className="h-5 w-5 text-primary mt-1" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}