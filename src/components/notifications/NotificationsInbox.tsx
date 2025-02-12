import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotificationsInbox() {
  const { notifications } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <CardTitle>Caixa de Entrada</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <NotificationList />
      </CardContent>
    </Card>
  );
}
