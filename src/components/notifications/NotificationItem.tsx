import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notifications";
import { format } from "date-fns";
import { Checkbox } from "@radix-ui/react-checkbox";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onClick?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function NotificationItem({ notification, isSelected, onMarkAsRead, onClick, onSelect }: NotificationItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if not clicking checkbox
    if (!(e.target as HTMLElement).closest('.checkbox-wrapper')) {
      onMarkAsRead();
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 p-2.5 cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30"
      )}
    >
      <div className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect?.()}
          className="ml-2"
        />
      </div>
      <Bell className="h-4 w-4 text-primary mt-1" />
      <div className="flex-1 space-y-0.5">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
        </p>
      </div>
    </div>
  );
}