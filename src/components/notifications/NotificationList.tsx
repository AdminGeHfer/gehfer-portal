import * as React from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, Filter, SquareCheck } from "lucide-react";

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications?.filter(n => !n.read) || [];
    }
    return notifications || [];
  }, [notifications, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value: "all" | "unread") => setFilter(value)}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              {filter === "all" ? "Todas" : "Não lidas"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Não lidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={() => markAllAsRead.mutate()}>
          <SquareCheck />
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Clock className="w-12 h-12 mb-2" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead.mutate(notification.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
